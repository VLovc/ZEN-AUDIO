// src/components/Library/RecentCard.jsx
import React from 'react';

const RecentCard = ({ title, subtitle, imgSrc, onClick }) => {
    return (
        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl bg-surface-container shadow-sm transition-transform duration-500 hover:-translate-y-1 select-none">
            <img
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={imgSrc}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent opacity-60"></div>

            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                <div>
                    <h4 className="font-headline-lg text-white mb-1 text-lg font-bold">{title}</h4>
                    <p className="font-label-pixel text-white/70 text-[11px]">{subtitle}</p>
                </div>
                <button
                    onClick={onClick}
                    className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-pointer"
                >
                    <span className="material-symbols-outlined active-fill text-[32px]">play_arrow</span>
                </button>
            </div>
        </div>
    );
};

export default RecentCard;