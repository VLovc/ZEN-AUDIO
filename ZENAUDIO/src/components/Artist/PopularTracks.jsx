// src/components/Artist/PopularTracks.jsx
import React from 'react';
import { usePlayer } from '../../context/PlayerContext';

const PopularTracks = ({ tracks }) => {
    const { playTrack, currentTrack, isPlaying } = usePlayer();

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const displayTracks = (tracks && tracks.length > 0) ? tracks : [
        { id: "1", name: "Neural Drift", artists: [{ name: "ECHO VOYAGER" }], album: { name: "SYNTHETIC_DREAMS" }, popularity: 82, duration_ms: 262000 },
        { id: "2", name: "Analog Pulse", artists: [{ name: "ECHO VOYAGER" }], album: { name: "CORE_STRATA" }, popularity: 71, duration_ms: 225000 },
        { id: "3", name: "Static Horizon", artists: [{ name: "ECHO VOYAGER" }], album: { name: "SINGLE" }, popularity: 65, duration_ms: 310000 },
        { id: "4", name: "Vector Void", artists: [{ name: "ECHO VOYAGER" }], album: { name: "CORE_STRATA" }, popularity: 58, duration_ms: 242000 },
    ];

    return (
        <div className="mb-10 text-on-surface">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-dotted border-outline-variant/30 pb-3">
                <h3 className="font-headline text-2xl text-on-surface">Popular Tracks</h3>
                <span className="font-label-pixel text-[9px] text-primary uppercase tracking-wider">[MATRIX_UPLINK_STABLE]</span>
            </div>

            {/* List */}
            <div className="space-y-1.5">
                {displayTracks.slice(0, 5).map((track, idx) => {
                    const trackIdx = String(idx + 1).padStart(2, '0');
                    const isActive = currentTrack?.id === track.id;
                    const trackImg = track.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                    const artistNames = track.artists?.map(a => a.name).join(', ') || "Unknown Artist";
                    const albumName = track.album?.name || "Unknown Album";
                    const views = track.popularity ? (track.popularity * 72583).toLocaleString() : "1,482,901";

                    return (
                        <div
                            key={track.id || idx}
                            onClick={() => playTrack(track)}
                            className={`group flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer border ${
                                isActive 
                                    ? 'bg-surface-container border-primary/20 shadow-[0_0_12px_rgba(204,255,0,0.05)]' 
                                    : 'border-transparent hover:bg-surface-container-low hover:border-white/5'
                            }`}
                        >
                            {/* Index */}
                            <span className={`font-pixel w-6 text-xs ${isActive ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                {trackIdx}
                            </span>

                            {/* Thumbnail */}
                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-white/5 bg-zinc-950">
                                <img
                                    src={trackImg}
                                    alt="Cover art"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Title & Meta */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-body font-bold text-xs truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                                    {track.name}
                                </p>
                                <p className="font-pixel text-[9px] text-secondary truncate uppercase mt-0.5">
                                    {artistNames} • {albumName}
                                </p>
                            </div>

                            {/* Equalizer animation */}
                            {isActive && isPlaying && (
                                <div className="flex items-end gap-0.5 h-3.5 w-5 px-1 pb-0.5 flex-shrink-0">
                                    <div className="w-0.5 bg-primary eq-bar-1 h-full"></div>
                                    <div className="w-0.5 bg-primary eq-bar-2 h-full"></div>
                                    <div className="w-0.5 bg-primary eq-bar-3 h-full"></div>
                                </div>
                            )}

                            {/* Stats */}
                            <span className="font-pixel text-zinc-500 hidden md:block text-[11px] px-4">{views} syncs</span>
                            <span className="font-pixel text-on-surface w-10 text-right text-xs">{formatTime(track.duration_ms)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularTracks;