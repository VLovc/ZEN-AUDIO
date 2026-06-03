// src/components/Library/CollectionCard.jsx
import React from 'react';

const CollectionCard = ({ title, subtitle, imgSrc, isCreateNew, onClick }) => {
    if (isCreateNew) {
        return (
            <div className="group cursor-pointer select-none">
                <div className="aspect-square bg-surface-container mb-4 overflow-hidden rounded-lg relative shadow-sm">
                    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-outline-variant bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline text-[48px]">add</span>
                        <span className="font-label-pixel text-[10px] text-outline mt-2 uppercase tracking-widest">New Collection</span>
                    </div>
                </div>
                <h5 className="font-body-md font-semibold text-on-surface truncate">Create New</h5>
                <p className="font-label-pixel text-[10px] text-secondary opacity-60 mt-1">Custom Mix</p>
            </div>
        );
    }

    return (
        <div className="group cursor-pointer select-none" onClick={onClick}>
            <div className="aspect-square bg-surface-container mb-4 overflow-hidden rounded-lg relative shadow-sm">
                <img 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={imgSrc} 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        <span className="material-symbols-outlined active-fill text-[36px]">play_arrow</span>
                    </div>
                </div>
            </div>
            <h5 className="font-body-md font-semibold text-on-surface truncate">{title}</h5>
            <p className="font-label-pixel text-[10px] text-secondary opacity-60 mt-1">{subtitle}</p>
        </div>
    );
};

export default CollectionCard;