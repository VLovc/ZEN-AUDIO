// src/components/Layout/MainContent.jsx
import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

const MainContent = () => {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        progress,
        currentTime,
        duration,
        seek,
        nextTrack,
        previousTrack
    } = usePlayer();

    const [waveformBars, setWaveformBars] = useState([20, 40, 60, 80, 100, 90, 70, 50, 30, 45, 65, 85, 95, 75, 55]);
    const [colorOffset, setColorOffset] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setWaveformBars(prevBars => prevBars.map(() => Math.random() * 80 + 20));
                setColorOffset(prev => prev + 1);
            }, 150);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = clickX / width;
        seek(ratio);
    };

    const track = currentTrack || {
        title: "No song playing",
        subtitle: "Select a song",
        imgSrc: "./img/music.png",
        album: "Unknown Album"
    };

    return (
        <section className="lg:col-span-7 flex flex-col w-full pb-24">
            {/* Turntable Plinth */}
            <div className="relative aspect-square max-w-[500px] mx-auto w-full group">
                <div className="absolute inset-0 bg-surface-dim rounded-[40px] shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.8),inset_5px_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center p-8">
                    <div className="absolute inset-4 rounded-full border-[12px] border-secondary/10 border-dotted"></div>

                    {/* 💿 Rotating Vinyl */}
                    <div
                        onClick={togglePlay}
                        className="relative w-full h-full rounded-full bg-[#111] shadow-2xl p-1 flex items-center justify-center cursor-pointer select-none"
                        style={{
                            animation: 'spin 20s linear infinite',
                            animationPlayState: isPlaying ? 'running' : 'paused'
                        }}
                    >
                        <div className="absolute inset-4 rounded-full border border-white/5"></div>
                        <div className="absolute inset-10 rounded-full border border-white/5"></div>
                        <div className="absolute inset-16 rounded-full border border-white/5"></div>

                        <div className="w-44 h-44 rounded-full bg-[#1e1e1e] relative z-10 shadow-lg overflow-hidden border-4 border-[#121212] flex items-center justify-center">
                            {/* 🌟 Ảnh Album từ Spotify */}
                            <img
                                src={track.imgSrc || "./img/music.png"}
                                alt="Album Cover"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* 🕹️ Tonearm Assembly */}
                    <div
                        className="absolute top-8 right-8 w-16 h-48 origin-top-right transition-transform duration-1000 ease-in-out pointer-events-none z-20"
                        style={{ transform: isPlaying ? 'rotate(10deg)' : 'rotate(-30deg)' }}
                    >
                        <div className="w-4 h-4 bg-secondary-fixed-dim rounded-full shadow-md ml-auto"></div>
                        <div className="w-1.5 h-full bg-surface-variant mx-auto rounded-full shadow-inner border border-white/20"></div>
                        <div className="w-6 h-10 bg-on-surface-variant rounded-sm mt-[-10px] mx-auto shadow-md"></div>
                    </div>

                    <div className="absolute bottom-8 left-8 flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface shadow-md flex items-center justify-center border border-white/55">
                            <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isPlaying ? 'bg-error shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-neutral-400'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Track Info & Controls */}
            <div className="mt-12 flex flex-col items-center lg:items-start w-full">
                <div className="flex items-center gap-4 mb-2 select-none">
                    <span className="px-3 py-1 bg-on-background text-primary-fixed font-pixel text-[10px] rounded">CLASSIC</span>
                    <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">forum</span>
                        <span className="font-pixel text-sm font-bold">392</span>
                    </div>
                </div>

                {/* 🌟 Tên bài hát & Nghệ sĩ từ Spotify */}
                <h2 className="font-headline text-5xl font-bold tracking-tight mb-2 text-on-surface line-clamp-1">{track.title}</h2>
                <p className="font-body text-base text-on-surface-variant mb-8 line-clamp-1">{track.subtitle} • {track.album}</p>

                {/* Waveform Visualizer */}
                <div className="w-full flex items-end justify-between h-16 gap-1 mb-6 px-4">
                    {waveformBars.map((height, i) => {
                        const totalBars = waveformBars.length;
                        const virtualIndex = (i - colorOffset % totalBars + totalBars) % totalBars;
                        const lightness = 72 - (virtualIndex / (totalBars - 1)) * 50;
                        return (
                            <div
                                key={i}
                                style={{
                                    height: isPlaying ? `${height}%` : '15%',
                                    backgroundColor: `hsl(73, 100%, ${lightness}%)`
                                }}
                                className="flex-1 rounded-full opacity-90 transition-all duration-250"
                            ></div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="w-full flex justify-between items-center mb-10">
                    <span className="font-pixel text-xs text-secondary w-12 text-right select-none">{formatTime(currentTime)}</span>
                    <div 
                        onClick={handleProgressClick}
                        className="flex-1 mx-8 h-1.5 bg-surface-variant rounded-full relative cursor-pointer"
                    >
                        <div 
                            className="absolute left-0 top-0 h-full bg-primary rounded-full shadow-[0_0_8px_rgba(195,244,0,0.6)] transition-all duration-100 ease-linear"
                            style={{ width: `${progress * 100}%` }}
                        ></div>
                    </div>
                    <span className="font-pixel text-xs text-secondary w-12 select-none">{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-10 w-full select-none">
                    <button className="text-secondary hover:text-primary transition-all active:scale-90 cursor-pointer">
                        <span className="material-symbols-outlined">shuffle</span>
                    </button>
                    <button 
                        onClick={previousTrack}
                        className="text-on-surface hover:text-primary transition-all active:scale-90 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-4xl">skip_previous</span>
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-on-surface text-surface flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>
                    <button 
                        onClick={nextTrack}
                        className="text-on-surface hover:text-primary transition-all active:scale-90 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-4xl">skip_next</span>
                    </button>
                    <button className="text-secondary hover:text-primary transition-all active:scale-90 cursor-pointer">
                        <span className="material-symbols-outlined">repeat</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MainContent;