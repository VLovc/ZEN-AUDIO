// src/components/Studio/BitDepthAnalyticsCard.jsx
import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useAudioVisualizer } from '../../hooks/useAudioVisualizer';

const BitDepthAnalyticsCard = () => {
    const { isPlaying, currentTime, currentTrack, duration } = usePlayer();
    const bands = useAudioVisualizer(isPlaying, currentTime);
    const canvasRef = useRef(null);
    const frameRef = useRef(null);
    const phaseRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        const draw = () => {
            phaseRef.current += isPlaying ? 0.04 : 0.005;
            const phase = phaseRef.current;

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, W, H);

            // Draw multi-layer waveforms
            const layers = [
                { alpha: isPlaying ? 0.8 : 0.2, speed: 1.0, ampMult: 1.0, color: '#c3f400' },
                { alpha: isPlaying ? 0.4 : 0.1, speed: 1.5, ampMult: 0.6, color: '#80ff00' },
                { alpha: isPlaying ? 0.2 : 0.06, speed: 2.2, ampMult: 0.35, color: '#ffffff' },
            ];

            layers.forEach(({ alpha, speed, ampMult, color }) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = color;
                ctx.shadowBlur = isPlaying ? 4 : 0;

                for (let x = 0; x < W; x++) {
                    const t = (x / W) * Math.PI * 4;
                    const bandIndex = Math.floor((x / W) * bands.length);
                    const bandH = bands[bandIndex] ?? 0.1;
                    const amp = (H / 2) * 0.7 * ampMult * (isPlaying ? bandH : 0.15);
                    const y = H / 2 + Math.sin(t * speed + phase) * amp + Math.sin(t * speed * 0.5 - phase * 0.7) * amp * 0.3;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            });

            // Center line
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(195,244,0,0.15)';
            ctx.lineWidth = 0.5;
            ctx.setLineDash([4, 8]);
            ctx.moveTo(0, H / 2);
            ctx.lineTo(W, H / 2);
            ctx.stroke();
            ctx.setLineDash([]);

            frameRef.current = requestAnimationFrame(draw);
        };

        frameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameRef.current);
    }, [isPlaying, bands]);

    const totalMin = duration ? Math.floor(duration / 60) : 0;
    const totalSec = duration ? Math.floor(duration % 60) : 0;

    return (
        <section className="col-span-12 lg:col-span-6">
            <div className="glass-panel p-6 rounded-xl shadow-2xl h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary-fixed">waveform</span>
                    <h2 className="font-headline-lg text-headline-lg text-surface-bright">Bit Depth Analytics</h2>
                </div>

                {/* Canvas waveform */}
                <div
                    className="relative rounded-xl overflow-hidden mb-4"
                    style={{
                        height: '128px',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        border: `1px solid ${isPlaying ? 'rgba(195,244,0,0.15)' : 'rgba(255,255,255,0.05)'}`,
                        transition: 'border-color 0.5s ease'
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={128}
                        style={{ width: '100%', height: '100%' }}
                    />
                    {/* Overlay gradient edges */}
                    <div
                        style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: 'linear-gradient(90deg, rgba(37,38,38,0.8) 0%, transparent 8%, transparent 92%, rgba(37,38,38,0.8) 100%)'
                        }}
                    />
                </div>

                {/* Track metadata */}
                {currentTrack?.title && (
                    <div
                        className="flex items-center gap-3 p-3 rounded-lg mb-4"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        {currentTrack.imgSrc && (
                            <img
                                src={currentTrack.imgSrc}
                                alt="album"
                                className="w-10 h-10 rounded object-cover shrink-0"
                                style={{ filter: isPlaying ? 'none' : 'grayscale(0.6)', transition: 'filter 0.5s ease' }}
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-surface-bright truncate">{currentTrack.title}</p>
                            <p className="text-[10px] text-on-tertiary-container truncate">{currentTrack.album}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[9px] font-mono text-primary-fixed opacity-60 uppercase">Duration</p>
                            <p className="text-sm font-mono text-primary-fixed">
                                {totalMin}:{totalSec.toString().padStart(2, '0')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-[9px] text-on-tertiary-container uppercase mb-1">Dynamic Range</p>
                        <p
                            className="text-xl text-primary-fixed font-mono transition-all duration-500"
                            style={{ textShadow: isPlaying ? '0 0 10px #c3f400' : 'none' }}
                        >
                            {isPlaying ? `${(130 + (bands[4] ?? 0) * 20).toFixed(0)}dB` : '144dB'}
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-[9px] text-on-tertiary-container uppercase mb-1">Sample Rate</p>
                        <p className="text-xl text-primary-fixed font-mono">44.1kHz</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BitDepthAnalyticsCard;