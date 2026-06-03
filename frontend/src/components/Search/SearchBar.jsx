import React from 'react';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="relative flex items-center bg-surface-container-low px-4 py-2 rounded-full w-64 mb-10 border border-transparent focus-within:border-primary transition-all">
            {/* Icon Search */}
            <span className="material-symbols-outlined text-secondary text-[20px] mr-2 select-none">
                search
            </span>

            {/* Input Field */}
            <input
                className="bg-transparent border-none focus:ring-0 font-label-pixel text-[12px] w-full placeholder:text-secondary-fixed-dim outline-none text-on-surface"
                placeholder="Search Frequency..."
                type="text"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar;