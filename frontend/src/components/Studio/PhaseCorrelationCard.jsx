// src/components/Studio/PhaseCorrelationCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useAudioVisualizer } from '../../hooks/useAudioVisualizer';

const PhaseCorrelationCard = () => {
    const { isPlaying, currentTime } = usePlayer();
    const bands = useAudioVisualizer(isPlaying, currentTime);
    const canvasRef = useRef(null);
    const frameRef = useRef(null);
    const historyRef = useRef([]);
    const [correlation, setCorrelation] = useState(0.82);
    const [lrDelay, setLrDelay] = useState(1.2);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const SIZE = canvas.width;
        const cx = SIZE / 2;
        const cy = SIZE / 2;
        const R = SIZE * 0.42;
        let t = currentTime;

        const draw = () => {
            t += isPlaying ? 0.012 : 0.002;

            // Update correlation based on bands
            if (isPlaying) {
                const avg = bands.reduce((a, b) => a + b, 0) / bands.length;
                const c = (0.6 + avg * 0.38 + (Math.random() - 0.5) * 0.04).toFixed(2);
                setCorrelation(c);
                const delay = (0.8 + avg * 0.8 + (Math.random() - 0.5) * 0.3).toFixed(1);
                setLrDelay(delay);
            }

            // Clear
            ctx.clearRect(0, 0, SIZE, SIZE);

            // Draw dark background
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, SIZE, SIZE);

            // Grid
            ctx.strokeStyle = 'rgba(195,244,0,0.1)';
            ctx.lineWidth = 0.5;
            ctx.setLineDash([2, 6]);
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - R - 4, cy); ctx.lineTo(cx + R + 4, cy);
            ctx.moveTo(cx, cy - R - 4); ctx.lineTo(cx, cy + R + 4);
            ctx.stroke();
            ctx.setLineDash([]);

            // Generate Lissajous points
            const points = [];
            const numPoints = isPlaying ? 300 : 120;
            const freqX = 1 + (Math.sin(t * 0.3) * 0.5 + 0.5) * 1.5;
            const freqY = 2 + (Math.sin(t * 0.2) * 0.5 + 0.5) * 1.0;
            const phase = t * 0.8;
            const ampMod = isPlaying ? (0.6 + bands[6] * 0.4) : 0.3;

            for (let i = 0; i < numPoints; i++) {
                const theta = (i / numPoints) * Math.PI * 2;
                const x = cx + Math.sin(freqX * theta + phase) * R * ampMod;
                const y = cy + Math.sin(freqY * theta) * R * ampMod;
                points.push({ x, y });
            }

            // Glow gradient
            const grd = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
            grd.addColorStop(0, `rgba(195,244,0,${isPlaying ? 0.9 : 0.3})`);
            grd.addColorStop(0.5, `rgba(128,255,0,${isPlaying ? 0.7 : 0.2})`);
            grd.addColorStop(1, `rgba(195,244,0,${isPlaying ? 0.9 : 0.3})`);

            ctx.shadowColor = '#c3f400';
            ctx.shadowBlur = isPlaying ? 8 : 2;
            ctx.strokeStyle = grd;
            ctx.lineWidth = 1.5;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            points.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;

            frameRef.current = requestAnimationFrame(draw);
        };

        frameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameRef.current);
    }, [isPlaying, bands, currentTime]);

    return (
        <section className="col-span-12 lg:col-span-6">
            <div className="glass-panel p-6 rounded-xl shadow-2xl h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary-fixed">scatter_plot</span>
                    <h2 className="font-headline-lg text-headline-lg text-surface-bright">Phase Correlation</h2>
                    <span
                        className="ml-auto text-[9px] font-mono uppercase px-2 py-0.5 rounded border"
                        style={{
                            color: isPlaying ? '#c3f400' : '#6a6b6b',
                            borderColor: isPlaying ? '#c3f400' : '#333',
                            backgroundColor: isPlaying ? 'rgba(195,244,0,0.06)' : 'transparent',
                            transition: 'all 0.4s ease'
                        }}
                    >
                        {isPlaying ? 'STEREO ACTIVE' : 'STANDBY'}
                    </span>
                </div>

                {/* Canvas Lissajous */}
                <div
                    className="flex-1 min-h-[200px] flex items-center justify-center rounded-lg relative overflow-hidden"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(195,244,0,0.08)' }}
                >
                    <canvas
                        ref={canvasRef}
                        width={240}
                        height={240}
                        style={{ width: '100%', maxWidth: '240px', height: 'auto' }}
                    />
                </div>

                <div className="flex justify-between items-end mt-4">
                    <div>
                        <p className="font-label-pixel text-[9px] text-primary-fixed opacity-60 uppercase">Correlation</p>
                        <p
                            className="font-control-num text-lg text-primary-fixed transition-all duration-500"
                            style={{ textShadow: isPlaying ? '0 0 8px #c3f400' : 'none' }}
                        >
                            +{correlation}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-label-pixel text-[9px] text-primary-fixed opacity-60 uppercase">L-R Delay</p>
                        <p
                            className="font-control-num text-lg text-primary-fixed transition-all duration-500"
                            style={{ textShadow: isPlaying ? '0 0 8px #c3f400' : 'none' }}
                        >
                            {lrDelay}ms
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PhaseCorrelationCard;