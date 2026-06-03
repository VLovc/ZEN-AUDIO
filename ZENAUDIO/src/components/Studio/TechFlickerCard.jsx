// src/components/Studio/TechFlickerCard.jsx
import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

// 30 thanh EQ thuần CSS — mỗi thanh có duration và delay ngẫu nhiên
// Tính sẵn lúc module load để không tạo lại mỗi render
const BAR_COUNT = 30;
const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
    duration: (0.5 + Math.random() * 0.8).toFixed(2),
    delay: (Math.random() * 0.6).toFixed(2),
    minH: 8 + Math.floor(Math.random() * 10),
    maxH: 40 + Math.floor(Math.random() * 44),
}));

const TechFlickerCard = () => {
    const { isPlaying, currentTrack, currentTime, duration, volume } = usePlayer();

    const [stats, setStats] = useState({ bitrate: 320, latency: 12 });

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setStats({
                bitrate: 320,
                latency: (10 + Math.random() * 4).toFixed(0),
            });
        }, 800);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const progressPct = duration ? (currentTime / duration) * 100 : 0;

    const formatTime = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <section className="col-span-12 lg:col-span-8 h-full">
            <div className="glass-panel p-6 rounded-xl shadow-2xl h-full flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: isPlaying ? '#c3f400' : '#444',
                                boxShadow: isPlaying ? '0 0 8px #c3f400' : 'none',
                                transition: 'all 0.4s ease',
                            }}
                        />
                        <h2 className="font-headline-lg text-headline-lg text-surface-bright">Tech Flicker</h2>
                    </div>
                    <span className="text-[9px] font-mono text-primary-fixed opacity-40 uppercase tracking-widest">
                        ANALOG-DIGITAL // v2.0.4
                    </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-black/30 rounded-lg border border-white/5 mb-5">
                    <div>
                        <p className="text-[9px] text-primary-fixed opacity-50 uppercase mb-1">Bitrate</p>
                        <p className="text-xl text-primary-fixed font-mono">{stats.bitrate} <span className="text-xs opacity-60">kbps</span></p>
                    </div>
                    <div>
                        <p className="text-[9px] text-primary-fixed opacity-50 uppercase mb-1">Latency</p>
                        <p className="text-xl text-primary-fixed font-mono animate-tech-flicker">{stats.latency} <span className="text-xs opacity-60">ms</span></p>
                    </div>
                    <div>
                        <p className="text-[9px] text-primary-fixed opacity-50 uppercase mb-1">Volume</p>
                        <p className="text-xl text-primary-fixed font-mono">{Math.round(volume * 100)}<span className="text-xs opacity-60">%</span></p>
                    </div>
                </div>

                {/* CSS-only EQ visualizer — flex-1 để fill vùng trống */}
                <div
                    className="flex-1 flex items-end justify-between gap-px px-3 rounded-lg overflow-hidden"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        minHeight: '60px',
                    }}
                >
                    {bars.map((bar, i) => (
                        <div
                            key={i}
                            className="eq-bar"
                            style={{
                                flex: 1,
                                minHeight: `${bar.minH}px`,
                                maxHeight: `${bar.maxH}px`,
                                height: `${bar.minH}px`,
                                backgroundColor: '#c3f400',
                                borderRadius: '2px 2px 0 0',
                                opacity: isPlaying ? 0.75 : 0.15,
                                animationName: 'sound-wave',
                                animationDuration: `${bar.duration}s`,
                                animationDelay: `${bar.delay}s`,
                                animationTimingFunction: 'ease-in-out',
                                animationIterationCount: 'infinite',
                                animationDirection: 'alternate',
                                // Chỉ toggle animation-play-state — không cần JS mỗi frame
                                animationPlayState: isPlaying ? 'running' : 'paused',
                                transition: 'opacity 0.5s ease',
                                willChange: 'height',
                            }}
                        />
                    ))}
                </div>

                {/* Spacer nhỏ */}
                <div className="mb-4" />

                {/* Current track */}
                <div className="flex-shrink-0">
                    <div
                        className="flex items-center gap-4 p-4 rounded-lg border"
                        style={{
                            backgroundColor: isPlaying ? 'rgba(195,244,0,0.04)' : 'rgba(255,255,255,0.02)',
                            borderColor: isPlaying ? 'rgba(195,244,0,0.12)' : 'rgba(255,255,255,0.05)',
                            transition: 'all 0.5s ease',
                        }}
                    >
                        {currentTrack?.imgSrc && (
                            <img
                                src={currentTrack.imgSrc}
                                alt="album"
                                className="w-14 h-14 rounded-lg object-cover shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-surface-bright truncate">{currentTrack?.title || 'No song playing'}</p>
                            <p className="text-[11px] text-on-tertiary-container truncate mt-0.5">{currentTrack?.subtitle}</p>

                            {/* Progress bar */}
                            <div className="mt-3 rounded-full overflow-hidden" style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${progressPct}%`,
                                        backgroundColor: '#c3f400',
                                        transition: 'width 0.5s linear',
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[9px] font-mono text-on-tertiary-container opacity-50">{formatTime(currentTime)}</span>
                                <span className="text-[9px] font-mono text-on-tertiary-container opacity-50">{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechFlickerCard;