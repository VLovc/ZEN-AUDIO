import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

const PlayerBarStudio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        currentTrack, isPlaying, togglePlay, progress,
        currentTime, duration, volume, changeVolume, seek,
        nextTrack, previousTrack, isShuffle, repeatMode, toggleShuffle, toggleRepeat
    } = usePlayer();

    if (location.pathname === '/home' || location.pathname === '/studio') {
        return null;
    }



    const track = currentTrack || {
        imgSrc: "https://via.placeholder.com/48",
        title: "No track playing",
        subtitle: "Select a song"
    };

    const formatTime = (time) => {
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

    return (
        <footer className="fixed bottom-0 right-0 w-[calc(100%-16rem)] h-20 bg-surface-container/50 backdrop-blur-2xl border-t border-white/10 z-50 flex items-center px-10 justify-between">

            {/* Left: Info */}
            <div className="flex items-center gap-4 w-1/4">
                <div className="w-12 h-12 rounded bg-surface-container-highest overflow-hidden">
                    <img alt="Album art" className="w-full h-full object-cover" src={track.imgSrc} />
                </div>
                <div className="overflow-hidden">
                    <p className="font-body-md font-bold truncate text-[14px] text-on-surface">{track.title}</p>
                    <p 
                        onClick={() => track.artistId && navigate(`/artist?id=${track.artistId}`)}
                        className={`font-label-pixel text-[10px] text-secondary truncate uppercase ${track.artistId ? 'hover:text-primary hover:underline cursor-pointer' : ''}`}
                    >
                        {track.subtitle}
                    </p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center gap-2 flex-grow max-w-lg">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={toggleShuffle}
                        className={`material-symbols-outlined transition-all cursor-pointer ${isShuffle ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        shuffle
                    </button>
                    <button 
                        onClick={previousTrack}
                        className="material-symbols-outlined text-on-surface hover:text-primary transition-all cursor-pointer"
                    >
                        skip_previous
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-on-surface text-surface flex items-center justify-center hover:scale-110 hover:bg-primary transition-all cursor-pointer active:scale-90"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>

                    <button 
                        onClick={nextTrack}
                        className="material-symbols-outlined text-on-surface hover:text-primary transition-all cursor-pointer"
                    >
                        skip_next
                    </button>
                    <button 
                        onClick={toggleRepeat}
                        className={`material-symbols-outlined transition-all cursor-pointer relative ${repeatMode !== 'off' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        {repeatMode === 'track' ? 'repeat_one' : 'repeat'}
                        {repeatMode !== 'off' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>}
                    </button>
                </div>

                <div className="w-full flex items-center gap-3">
                    <span className="font-control-num text-control-num text-[10px] w-8 text-right">{formatTime(currentTime)}</span>
                    <div 
                        onClick={handleProgressClick}
                        className="h-1.5 bg-surface-container-highest flex-grow rounded-full relative cursor-pointer"
                    >
                        <div
                            className="absolute h-full bg-primary rounded-full shadow-[0_0_8px_rgba(195,244,0,0.6)] transition-all duration-100 ease-linear"
                            style={{ width: `${progress * 100}%` }}
                        ></div>
                    </div>
                    <span className="font-control-num text-control-num text-[10px] w-8">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6 w-auto min-w-fit justify-end px-4">
                <div className="flex gap-6 items-center">
                    <button className="flex flex-col items-center gap-1 text-on-secondary-container opacity-60 hover:text-primary hover:opacity-100 transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">queue_music</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-on-secondary-container opacity-60 hover:text-primary hover:opacity-100 transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">lyrics</span>
                    </button>
                </div>

                {/* --- SLEEK HORIZONTAL VOLUME BAR --- */}
                <div className="flex items-center gap-3 ml-6 group/volume">
                    <button
                        onClick={() => changeVolume(volume > 0 ? 0 : 0.5)}
                        className="cursor-pointer text-secondary hover:text-primary transition-colors flex items-center"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                        </span>
                    </button>

                    <div className="w-24 h-1 bg-surface-container-highest rounded-full relative cursor-pointer group-hover/volume:h-1.5 transition-all duration-150 flex items-center">
                        {/* Neon Fill */}
                        <div
                            className="absolute left-0 top-0 h-full bg-primary rounded-full shadow-[0_0_8px_rgba(195,244,0,0.6)]"
                            style={{ width: `${volume * 100}%` }}
                        ></div>
                        {/* Invisible Input on top to catch events easily */}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => changeVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <span className="text-[10px] text-secondary font-control-num min-w-[24px] text-right select-none">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default PlayerBarStudio;