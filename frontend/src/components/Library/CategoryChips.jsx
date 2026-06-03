// src/components/Library/CategoryChips.jsx
import React, { useState } from 'react';

const CategoryChips = () => {
    const categories = ['Playlists', 'Albums', 'Artists', 'Podcasts'];
    const [activeTab, setActiveTab] = useState('Playlists');

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar select-none">
            {categories.map((cat) => {
                const isActive = activeTab === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-6 py-2 rounded-full border font-label-pixel text-[11px] whitespace-nowrap transition-all duration-200 cursor-pointer
                            ${isActive 
                                ? 'border-on-surface bg-on-surface text-primary-container shadow-sm' 
                                : 'border-outline hover:bg-surface-container-highest text-secondary'
                            }`}
                    >
                        {cat}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryChips;