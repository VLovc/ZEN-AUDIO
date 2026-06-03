import React from 'react';

const PlayerBar = () => {
    return (
        <nav className="fixed bottom-0 left-0 md:left-64 right-0 h-20 bg-surface-container/90 backdrop-blur-xl border-t border-white/10 flex justify-between items-center px-10 z-50 md:w-[calc(100%-16rem)] text-on-surface">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-on-background rounded-lg flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>album</span>
                </div>
                <div className="hidden sm:block">
                    <p className="font-pixel text-xs leading-tight font-bold">Now Playing</p>
                    <p className="font-pixel text-[10px] text-secondary">THE SUFFERING</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <button className="text-on-secondary-container hover:text-primary transition-all active:scale-90 flex flex-col items-center">
                    <span className="material-symbols-outlined">queue_music</span>
                    <span className="font-pixel text-[8px] mt-1 font-bold">QUEUE</span>
                </button>
                <button className="text-on-secondary-container hover:text-primary transition-all active:scale-90 flex flex-col items-center">
                    <span className="material-symbols-outlined">lyrics</span>
                    <span className="font-pixel text-[8px] mt-1 font-bold">LYRICS</span>
                </button>
            </div>

            <div className="flex items-center gap-4 w-32">
                <span className="material-symbols-outlined text-secondary text-sm">volume_down</span>
                <div className="flex-1 h-1 bg-surface-variant rounded-full relative">
                    <div className="absolute inset-0 bg-primary w-[70%] rounded-full shadow-[0_0_5px_rgba(80,102,0,0.4)]"></div>
                </div>
                <span className="material-symbols-outlined text-secondary text-sm">volume_up</span>
            </div>
        </nav>
    );
};

export default PlayerBar;