// src/components/Artist/ArtistSidebarInfo.jsx
import React from 'react';

const ArtistSidebarInfo = ({ artist }) => {
    const popularity = artist?.popularity || 78;
    const syncRate = popularity;
    const neuralLink = Math.round(popularity * 0.8);
    const pilotStress = Math.max(10, 100 - popularity);

    const getDynamicBio = () => {
        if (!artist) return "Establishing database uplink for target entity...";
        const genresStr = artist.genres && artist.genres.length > 0
            ? artist.genres.slice(0, 3).join(', ')
            : 'electronic soundscapes';
        return `Uplink established for ${artist.name.toUpperCase()}. Recognized in the audio grid for advanced sonic modulations in ${genresStr}. Data tracks indicate optimal decryption with pure lossless output.`;
    };

    const influences = artist?.genres && artist.genres.length > 0
        ? artist.genres.slice(0, 4).map(g => g.toUpperCase().replace(/\s+/g, '_'))
        : ["ELECTRONIC", "AMBIENT", "SYNTHWAVE", "MODULAR"];

    return (
        <div className="bg-surface-container-low p-6 rounded-2xl h-full border border-outline-variant/30 text-on-surface">
            {/* 1. TECHNICAL_BIO */}
            <h3 className="font-pixel text-[15px] text-primary uppercase mb-3 border-b border-primary/20 pb-2">Technical_Bio</h3>
            <p className="font-pixel text-zinc-400 mb-6 leading-relaxed text-xs">
                {getDynamicBio()}
            </p>

            {/* 2. SYSTEM_SYNC_STATUS */}
            <div className="mb-6 pt-4 border-t border-dotted border-primary/30">
                <h4 className="font-pixel text-[10px] text-secondary uppercase tracking-widest mb-3">SYSTEM_SYNC_STATUS</h4>
                <div className="space-y-3">
                    {[
                        { label: "NEURAL_LINK", val: neuralLink },
                        { label: "PILOT_STRESS", val: pilotStress },
                        { label: "SYNC_RATE", val: syncRate }
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1">
                            <div className="flex justify-between font-label-pixel text-[9px] uppercase tracking-widest">
                                <span className="text-secondary">{item.label}</span>
                                <span className="text-primary font-bold">{item.val}%</span>
                            </div>
                            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${item.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. SYSTEM_HARDWARE */}
            <div className="space-y-6">
                <div>
                    <h4 className="font-label-pixel text-[9px] text-secondary uppercase mb-2">SYSTEM_HARDWARE</h4>
                    <ul className="font-pixel text-[10px] text-zinc-400 space-y-1.5">
                        {["MODULAR_RACK_01", "MPC_X_VINTAGE", "RE-201_SPACE_ECHO", "MOOG_ONE_16V"].map((item) => (
                            <li key={item} className="flex justify-between">
                                <span>{item}</span> <span className="text-primary font-bold text-[9px]">ONLINE</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 4. CORE_INFLUENCES */}
                <div>
                    <h4 className="font-label-pixel text-[9px] text-secondary uppercase mb-2">CORE_INFLUENCES // GENRES</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {influences.map((inf) => (
                            <span key={inf} className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant/30 font-label-pixel text-[8px] text-zinc-300">
                                {inf}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 5. LIVE_STATUS */}
                <div className="p-4 bg-surface-container-highest rounded-lg border border-primary/10 flex justify-between items-center gap-4">
                     <div className="flex-shrink-0">
                        <p className="font-pixel text-[10px] text-on-surface">UPLINK_01</p>
                        <p className="font-pixel text-[8px] text-primary mt-0.5">ESTABLISHED</p>
                    </div>
                    {/* Equalizer animation bars */}
                    <div className="w-full h-8 flex items-end justify-center gap-0.5 pb-1">
                        <div className="w-0.5 h-3 bg-primary eq-bar-1"></div>
                        <div className="w-0.5 h-5 bg-primary eq-bar-2"></div>
                        <div className="w-0.5 h-3 bg-primary eq-bar-3"></div>
                        <div className="w-0.5 h-5 bg-primary eq-bar-1"></div>
                        <div className="w-0.5 h-4 bg-primary eq-bar-2"></div>
                        <div className="w-0.5 h-6 bg-primary eq-bar-3"></div>
                        <div className="w-0.5 h-5 bg-primary eq-bar-2"></div>
                        <div className="w-0.5 h-3 bg-primary eq-bar-1"></div>
                        <div className="w-0.5 h-5 bg-primary eq-bar-3"></div>
                        <div className="w-0.5 h-4 bg-primary eq-bar-2"></div>
                        <div className="w-0.5 h-6 bg-primary eq-bar-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistSidebarInfo;