// src/components/Artist/ArtistHero.jsx
import React, { useState, useEffect } from 'react';

const ArtistHero = ({ artist }) => {
    // Logic for small variations in stats to make it "alive"
    const popularity = artist?.popularity || 78;
    const [neuralLink, setNeuralLink] = useState(Math.round(popularity * 0.8));
    const [syncRate, setSyncRate] = useState(popularity);

    useEffect(() => {
        const interval = setInterval(() => {
            // Small random fluctuation to simulate cyberpunk neural HUD
            setNeuralLink(prev => Math.min(Math.max(prev + (Math.random() > 0.5 ? 1 : -1), Math.round(popularity * 0.7)), Math.round(popularity * 0.9)));
            setSyncRate(prev => Math.min(Math.max(prev + (Math.random() > 0.5 ? 1 : -1), Math.max(0, popularity - 5)), Math.min(100, popularity + 5)));
        }, 2000);
        return () => clearInterval(interval);
    }, [popularity]);

    const artistName = artist?.name || "ECHO VOYAGER";
    const artistImage = artist?.images?.[0]?.url || "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=300";
    const followerCount = artist?.followers?.total?.toLocaleString() || "12,482,901";

    return (
        <section className="relative w-full h-[400px] overflow-hidden">
            {/* 1. Background Layers */}
            <div className="absolute inset-0 z-0">
                <img
                    alt={artistName}
                    className="w-full h-full object-cover contrast-125 saturate-50 brightness-50 sharp-image"
                    src={artistImage}
                />
                <div className="absolute inset-0 bg-[#1b1c1c]/40 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/50 to-transparent"></div>
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(171, 214, 0, 0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* 2. Top-Left: Unit Info */}
            <div className="absolute top-8 left-8 z-20">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-[#161e00] font-label-pixel text-[9px] px-2 py-0.5 tracking-widest font-bold shadow-[0_0_8px_rgba(204,255,0,0.3)]">UNIT 01</div>
                        <div className="font-label-pixel text-[9px] text-primary/80 border-l border-primary/30 pl-3">SYNCED_DATABASE // SPOTIFY_API</div>
                    </div>
                    <div className="font-label-pixel text-[8px] text-secondary/60 uppercase tracking-widest">SYSTEM_STATUS: STABLE</div>
                </div>
            </div>

            {/* 3. Top-Right: Neural Link Box */}
            <div className="absolute top-8 right-8 z-25 w-56 bg-zinc-950/65 backdrop-blur-md border border-primary/20 p-3 rounded shadow-[0_0_15px_rgba(171,214,0,0.05)]">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between font-label-pixel text-[9px] text-primary tracking-widest">
                        <span>NEURAL_LINK</span>
                        <span className="font-bold text-white transition-all duration-300">{neuralLink}%</span>
                    </div>
                    <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-700 ease-out" 
                            style={{ width: `${neuralLink}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between font-label-pixel text-[9px] text-primary tracking-widest">
                        <span>SYNC_RATE</span>
                        <span className="font-bold text-white transition-all duration-300">{syncRate}%</span>
                    </div>
                    <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-700 ease-out" 
                            style={{ width: `${syncRate}%` }}
                        ></div>
                    </div>
                    <div className="text-[7px] text-primary/50 uppercase tracking-tighter">Status: Uplink_Optimal</div>
                </div>
            </div>

            {/* 4. Center-Left: Avatar & Name */}
            <div className="absolute bottom-8 left-8 z-30 flex items-end gap-6 md:gap-8 w-[calc(100%-16px)]">
                <div className="relative w-36 h-36 border border-primary/30 p-1 bg-[#1b1c1c]/40 backdrop-blur-sm flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-1 w-full animate-[scan_3s_linear_infinite] z-20 pointer-events-none"></div>
                    <img className="w-full h-full object-cover grayscale-[0.2] contrast-125" src={artistImage} alt={artistName} />
                </div>
                <div className="mb-2 min-w-0 pr-6 flex-grow">
                    <h2 className="font-display-lg text-3xl md:text-5xl text-white uppercase tracking-tight mb-4 truncate">{artistName}</h2>
                    <div className="bg-[#1b1c1c]/50 backdrop-blur-md border-l-2 border-primary/40 p-3.5 flex gap-8 max-w-fit rounded-r">
                        <div>
                            <p className="font-pixel text-[8px] text-primary/70 uppercase">Followers</p>
                            <p className="font-pixel text-primary text-xs md:text-sm">{followerCount}</p>
                        </div>
                        <div>
                            <p className="font-pixel text-[8px] text-primary/70 uppercase">Popularity</p>
                            <p className="font-pixel text-white text-xs md:text-sm">{popularity}/100</p>
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-pixel text-[8px] text-primary/70 uppercase">Format</p>
                            <p className="font-pixel text-white text-xs md:text-sm">FLAC 24-BIT</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArtistHero;