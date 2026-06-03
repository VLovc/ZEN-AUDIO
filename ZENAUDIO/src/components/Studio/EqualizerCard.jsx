// src/components/Studio/EqualizerCard.jsx
import React from 'react';
import { usePlayer } from '../../context/PlayerContext';

const EqualizerCard = () => {
    const { isPlaying, currentTrack } = usePlayer();

    const fallbackImg = 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=400';

    return (
        <section className="col-span-12 lg:col-span-4 h-full">
            <div
                className="glass-panel rounded-xl shadow-2xl flex flex-col"
                style={{ height: '100%', padding: '24px' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4" style={{ flexShrink: 0 }}>
                    <h2 className="font-headline-lg text-headline-lg text-surface-bright">EQ Logic</h2>
                    <span
                        className="text-[9px] font-mono px-2 py-0.5 rounded border"
                        style={{
                            color: isPlaying ? '#c3f400' : '#555',
                            borderColor: isPlaying ? 'rgba(195,244,0,0.3)' : '#333',
                            transition: 'all 0.4s ease',
                        }}
                    >
                        {isPlaying ? '● LIVE' : '◌ IDLE'}
                    </span>
                </div>

                {/* Album art — flex-1 để fill phần còn lại của card */}
                <div
                    className="relative rounded-xl overflow-hidden mb-4 flex-1 min-h-0"
                >
                    <img
                        src={currentTrack?.imgSrc || fallbackImg}
                        alt="album cover"
                        className="w-full h-full object-cover"
                        style={{
                            filter: isPlaying ? 'none' : 'grayscale(0.5) brightness(0.7)',
                            transition: 'filter 0.6s ease',
                        }}
                    />
                </div>

                {/* Track info */}
                <div className="flex-shrink-0">
                    <div
                        className="flex items-center gap-3 p-3 rounded-lg border"
                        style={{
                            backgroundColor: isPlaying ? 'rgba(195,244,0,0.04)' : 'rgba(255,255,255,0.02)',
                            borderColor: isPlaying ? 'rgba(195,244,0,0.12)' : 'rgba(255,255,255,0.05)',
                            transition: 'all 0.5s ease',
                        }}
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-surface-bright truncate">
                                {currentTrack?.title || 'No song playing'}
                            </p>
                            <p className="text-[10px] text-on-tertiary-container truncate mt-0.5">
                                {currentTrack?.subtitle || '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EqualizerCard;