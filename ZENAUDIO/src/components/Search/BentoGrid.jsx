// src/components/Search/BentoGrid.jsx
import React from 'react';

const BentoGrid = ({ onPlayTrack }) => {
    // Thao tác phát nhạc tương tác đồng bộ với footer
    const handlePlayCategory = (title, subtitle, imgSrc) => {
        if (onPlayTrack) {
            onPlayTrack(title, subtitle, imgSrc);
        }
        console.log(`[AUDIOPHILE] Connecting frequency stream: ${title.toUpperCase()}`);
    };

    return (
        <div className="grid grid-cols-12 gap-6 select-none">
            {/* 1. Large Card: Classical */}
            <div className="col-span-12 lg:col-span-8 group relative rounded-xl overflow-hidden shadow-lg h-80 bg-inverse-surface border border-surface-variant/20">
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 opacity-60 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8E4TUrfC2qfEu6aefq3IWngmUNg3NGUpF4hjlCXfwsXrApgDVYOzHqQTuKn3LzCmiJCZht5Thbo1aH0chygQUHf_pV8Sq3z8jG2gPzGv6RayZMwDqkfWfihaBvI3vFPK6pUOQkgAwoI-v-7faU-muj1imrKfHkz6_-uQAKBLFg2sv0revTd-ohC0rQIjszPxcmK6B200zVU_bxPHkc7tibxqNxNueKYuJsivvAbFtJvqp2hh00ZebFnj73j90vpWfm9_ABuakQw8" 
                    alt="Classical"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Status Tags */}
                <div className="absolute top-6 left-6 flex flex-col gap-1.5 z-10">
                    <span className="font-label-pixel text-[10px] text-primary-fixed bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded border border-white/5">
                        BITRATE: 24-BIT / 192KHZ
                    </span>
                    <span className="font-label-pixel text-[9px] text-white/60 tracking-wider">
                        TAG: ORCHESTRAL_CORE
                    </span>
                </div>

                {/* Card Title & Desc */}
                <div className="absolute bottom-8 left-8 z-10">
                    <h3 className="font-headline text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-none mb-2">Classical</h3>
                    <p className="text-white/60 font-body text-xs sm:text-sm">Precision mastered timeless arrangements.</p>
                </div>

                {/* Play Button */}
                <div className="absolute right-6 bottom-8 flex items-center z-10">
                    <button 
                        onClick={() => handlePlayCategory(
                            'Classical', 
                            'Orchestral Core', 
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuB8E4TUrfC2qfEu6aefq3IWngmUNg3NGUpF4hjlCXfwsXrApgDVYOzHqQTuKn3LzCmiJCZht5Thbo1aH0chygQUHf_pV8Sq3z8jG2gPzGv6RayZMwDqkfWfihaBvI3vFPK6pUOQkgAwoI-v-7faU-muj1imrKfHkz6_-uQAKBLFg2sv0revTd-ohC0rQIjszPxcmK6B200zVU_bxPHkc7tibxqNxNueKYuJsivvAbFtJvqp2hh00ZebFnj73j90vpWfm9_ABuakQw8'
                        )}
                        className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer border-none"
                    >
                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                        </span>
                    </button>
                </div>
            </div>

            {/* 2. Small Card: Jazz */}
            <div 
                onClick={() => handlePlayCategory(
                    'Jazz', 
                    'Improvisational Flux', 
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRdk3JPoNmA7BMh3vQh-NKQpZ-9C0BlRhADXT3IFCCTbBMTVDKbL6XvUi73KwLMbvwEPAwzkE0Rqq7rnsD6uGWVUD5qne9ly8LDMOyJRrYp4-nRYc_g5QzQ83LWDALEseCmVhx1rkujcIEdKM5TumFiz_ZsdaAkUxV8JdaxqVci9GXr2wDjmPJ-_qnZTAxjQYWgiMHOAeN6MO5QkQ-ibWGwubxMiZzInB8GytACHprKmZJDkm0prgGFpGye7_bW7jNMzUcY8HicCI'
                )}
                className="col-span-12 md:col-span-6 lg:col-span-4 group relative rounded-xl overflow-hidden shadow-lg h-80 bg-surface-container border border-surface-variant/20 cursor-pointer"
            >
                {/* Hiệu ứng Scanline Cyberpunk */}
                <div className="absolute inset-0 scanline opacity-25 pointer-events-none z-10"></div>
                
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRdk3JPoNmA7BMh3vQh-NKQpZ-9C0BlRhADXT3IFCCTbBMTVDKbL6XvUi73KwLMbvwEPAwzkE0Rqq7rnsD6uGWVUD5qne9ly8LDMOyJRrYp4-nRYc_g5QzQ83LWDALEseCmVhx1rkujcIEdKM5TumFiz_ZsdaAkUxV8JdaxqVci9GXr2wDjmPJ-_qnZTAxjQYWgiMHOAeN6MO5QkQ-ibWGwubxMiZzInB8GytACHprKmZJDkm0prgGFpGye7_bW7jNMzUcY8HicCI" 
                    alt="Jazz"
                />
                {/* Lớp phủ màu trộn rêu */}
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity group-hover:opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 right-4 z-10">
                    <span className="font-label-pixel text-[9px] text-primary-fixed bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5 font-bold">
                        FREQ_RANGE: 20-20K
                    </span>
                </div>

                <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="font-headline text-white text-2xl font-bold">Jazz</h3>
                    <p className="font-label-pixel text-[9px] text-[#ccff00] mt-1 tracking-widest">IMPROVISATIONAL_FLUX</p>
                </div>
            </div>

            {/* 3. Medium Card: Lo-Fi */}
            <div 
                onClick={() => handlePlayCategory(
                    'Lo-Fi', 
                    'Lo-Fi Sessions', 
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA-IjtG-qmQVZRDtQrsd6FpqNqobCMWdJCCuO3YoCMe65gQZC8ZCJ-gfseG3ac5KnIsQY52B2tvtkpwIln7AKRfOZu1qLNFppJ-L_6xpA5IXcPvtWpFMPBPwhsWWTXdZpNJuHJ2GvCtHoowtM472kddvT7lTcq8IsyEn3e6U8xcOJlbzlRZnOvMOIYzufaBE6m0cLSJ4fM3oxbHgHp_AAtIYnhvGPVSOCFpYV3oZkApZSfB65TJoo_Su0weCKtNYsWto2hkapZ5TRg'
                )}
                className="col-span-12 md:col-span-6 lg:col-span-4 group relative rounded-xl overflow-hidden shadow-lg h-64 bg-surface-container-high border border-surface-variant/20 cursor-pointer"
            >
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-IjtG-qmQVZRDtQrsd6FpqNqobCMWdJCCuO3YoCMe65gQZC8ZCJ-gfseG3ac5KnIsQY52B2tvtkpwIln7AKRfOZu1qLNFppJ-L_6xpA5IXcPvtWpFMPBPwhsWWTXdZpNJuHJ2GvCtHoowtM472kddvT7lTcq8IsyEn3e6U8xcOJlbzlRZnOvMOIYzufaBE6m0cLSJ4fM3oxbHgHp_AAtIYnhvGPVSOCFpYV3oZkApZSfB65TJoo_Su0weCKtNYsWto2hkapZ5TRg" 
                    alt="Lo-Fi"
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] group-hover:bg-white/20 transition-all"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center z-10">
                    <span className="font-label-pixel text-[10px] text-primary font-bold mb-2 tracking-widest">LO_FI_SESSIONS.exe</span>
                    <h3 className="font-headline text-on-surface text-3xl font-bold">Lo-Fi</h3>
                    <div className="w-12 h-1 bg-primary mt-4 group-hover:w-20 transition-all duration-300"></div>
                </div>
            </div>

            {/* 4. Medium Card: Electronic */}
            <div 
                onClick={() => handlePlayCategory(
                    'Electronic', 
                    'Synth Wave Buffer', 
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjdLBVfXFUoXa5aFC0a8Yq5DAepyf1wLKkFu2q7T92CXt1k3v8XWeLhWCK3F_6AvTe9lJmAv9eeqNX8XECDcOb_90_HluRLcm1IjBWP2yWV2IScex2mE89_zQfttTwZko8_RH9n1wz4usS2lFqBVWRSpwOKJPbbH2ux-TwHGIP1S5alF6Y-65iDbh-K4QMTk6ggnETpm5v6wha8pyTYKUzfQeSqU1bwUXoqPq_kP8wlx3vXeqmITzqg4lsk4DrDLk7p5qJaO_yp6I'
                )}
                className="col-span-12 md:col-span-6 lg:col-span-4 group relative rounded-xl overflow-hidden shadow-lg h-64 bg-black border border-surface-variant/20 cursor-pointer"
            >
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 opacity-80 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjdLBVfXFUoXa5aFC0a8Yq5DAepyf1wLKkFu2q7T92CXt1k3v8XWeLhWCK3F_6AvTe9lJmAv9eeqNX8XECDcOb_90_HluRLcm1IjBWP2yWV2IScex2mE89_zQfttTwZko8_RH9n1wz4usS2lFqBVWRSpwOKJPbbH2ux-TwHGIP1S5alF6Y-65iDbh-K4QMTk6ggnETpm5v6wha8pyTYKUzfQeSqU1bwUXoqPq_kP8wlx3vXeqmITzqg4lsk4DrDLk7p5qJaO_yp6I" 
                    alt="Electronic"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Mô phỏng vạch EQ nhảy */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex gap-1 items-end h-6">
                        <div className="w-1 h-3 bg-primary-container rounded-sm animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-5 bg-primary-container rounded-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-1 h-2 bg-primary-container rounded-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-1 h-4 bg-primary-container rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="font-headline text-white text-2xl font-bold drop-shadow-md">Electronic</h3>
                    <p className="font-label-pixel text-[9px] text-primary-container mt-1 tracking-wider">SYNTH_WAVE_BUFFER</p>
                </div>
            </div>

            {/* 5. Medium Card: 90s Revival */}
            <div 
                onClick={() => handlePlayCategory(
                    '90s Revival', 
                    'Analog Heritage', 
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDS6mbrQudUHww12IZcix5pFBX4VmWoG2MrZqifZVJnF3HRtaNYCeDaemx7BLqj1r8xH5JbRicUrOwocoONMb_I7HbW3GF801smaqJgCNtEyD7zariv0Tc7J1MbC2aAqNy2pQwbH-WmiT60B6VBhHBnXyF4NE71qSMdJ8NNSQPDj86HXdIC_e8K14zHKmVCwQQfNQsXgjhiooP9hUm2aHF_7T_mGdzx6V7_giG2b0TMgQrKfqJFVXaHBYXYgSbOFOYV6TYNe5C2NiA'
                )}
                className="col-span-12 md:col-span-6 lg:col-span-4 group relative rounded-xl overflow-hidden shadow-lg h-64 bg-inverse-surface border border-surface-variant/20 cursor-pointer"
            >
                <img 
                    className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS6mbrQudUHww12IZcix5pFBX4VmWoG2MrZqifZVJnF3HRtaNYCeDaemx7BLqj1r8xH5JbRicUrOwocoONMb_I7HbW3GF801smaqJgCNtEyD7zariv0Tc7J1MbC2aAqNy2pQwbH-WmiT60B6VBhHBnXyF4NE71qSMdJ8NNSQPDj86HXdIC_e8K14zHKmVCwQQfNQsXgjhiooP9hUm2aHF_7T_mGdzx6V7_giG2b0TMgQrKfqJFVXaHBYXYgSbOFOYV6TYNe5C2NiA" 
                    alt="90s Revival"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>

                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 z-10">
                    <h3 className="font-headline text-white text-2xl font-bold">90s Revival</h3>
                    <p className="font-label-pixel text-[9px] text-primary-fixed mt-1 tracking-wider">ANALOG_HERITAGE_v0.9</p>
                </div>
            </div>

            {/* 6. Long Card: Instrumental */}
            <div className="col-span-12 group relative rounded-xl overflow-hidden shadow-lg h-48 mt-4 border border-surface-variant/20">
                {/* Lưới oled chấm chìm ngầm */}
                <div className="absolute inset-0 pixel-grid pointer-events-none z-10 opacity-30"></div>
                
                <img 
                    className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0 group-hover:scale-102" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb8hmy1ocyALAQ_nGnApZLAj2dZ30WbsyV3P9pFYG4AAkNJe6Q6Dd3Ub2pkDYih_5cuxpC5j2Hk0ghXxySW4ZLB_DbS8RJIORXggbZOzRpGhdq3VTq9rS3unFPDzi2P_EPF8iegHtM5xDA36P4bRjSAlVOpYDEvsxryZ7mFKW0Z-TJDgA-ftVGqkN_3OB2cvxk7zenORnU0IYZwydGjjyRq1IsTGD0mDeoICOkvE_JjNk9zYblq8FldTsiAqll6bBtNW3-Fuo1o9s" 
                    alt="Instrumental"
                />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] group-hover:bg-white/10 transition-all"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>

                {/* Content Layout */}
                <div className="absolute inset-0 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:px-12 z-20">
                    <div className="flex flex-col gap-1 max-w-md">
                        <h3 className="font-headline text-on-surface text-2xl md:text-3xl font-bold">Instrumental</h3>
                        <p className="font-body text-xs md:text-sm text-secondary">Pure sonics without vocal interference.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-3 md:mt-0 select-none">
                        <div className="text-left sm:text-right flex flex-col gap-0.5">
                            <p className="font-label-pixel text-[10px] font-bold text-primary">SAMP_RATE: 384KHZ</p>
                            <p className="font-label-pixel text-[9px] text-secondary">DYNAMIC_RANGE: 120DB</p>
                        </div>
                        <button 
                            onClick={() => handlePlayCategory(
                                'Instrumental', 
                                'Pure Sonics', 
                                'https://lh3.googleusercontent.com/aida-public/AB6AXuCb8hmy1ocyALAQ_nGnApZLAj2dZ30WbsyV3P9pFYG4AAkNJe6Q6Dd3Ub2pkDYih_5cuxpC5j2Hk0ghXxySW4ZLB_DbS8RJIORXggbZOzRpGhdq3VTq9rS3unFPDzi2P_EPF8iegHtM5xDA36P4bRjSAlVOpYDEvsxryZ7mFKW0Z-TJDgA-ftVGqkN_3OB2cvxk7zenORnU0IYZwydGjjyRq1IsTJDgA-ftVGqkN_3OB2cvxk7zenORnU0IYZwydGjjyRq1IsTGD0mDeoICOkvE_JjNk9zYblq8FldTsiAqll6bBtNW3-Fuo1o9s'
                            )}
                            className="px-5 py-2 border-2 border-primary text-primary font-label-pixel text-[10px] uppercase font-bold hover:bg-primary hover:text-white active:scale-95 transition-all cursor-pointer bg-transparent"
                        >
                            CONNECT_STREAM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BentoGrid;