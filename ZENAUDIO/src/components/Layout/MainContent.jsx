// src/components/Layout/MainContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';

const ScrollingTitle = ({ text, isPlaying }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                let textWidth = textRef.current.scrollWidth;
                if (isOverflowing) {
                    textWidth -= 64; // subtract pr-16 (64px)
                }
                setIsOverflowing(textWidth > containerRef.current.clientWidth);
            }
        };

        checkOverflow();
        // Set a small timeout to re-check after font load or render
        const timeout = setTimeout(checkOverflow, 100);
        window.addEventListener('resize', checkOverflow);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [text, isOverflowing]);

    return (
        <div 
            ref={containerRef} 
            className="w-full overflow-hidden whitespace-nowrap mb-2 relative"
            style={{ WebkitMaskImage: isOverflowing ? 'linear-gradient(to right, black 85%, transparent 100%)' : 'none', maskImage: isOverflowing ? 'linear-gradient(to right, black 85%, transparent 100%)' : 'none' }}
        >
            <div className={`flex w-max ${isOverflowing && isPlaying ? 'animate-title-scroll' : ''}`}>
                <div 
                    ref={textRef}
                    className={`font-headline text-5xl font-bold tracking-tight text-on-surface ${isOverflowing ? 'pr-16' : ''}`}
                >
                    {text}
                </div>
                {isOverflowing && (
                    <div className="font-headline text-5xl font-bold tracking-tight text-on-surface pr-16">
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
};

const MainContent = () => {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        progress,
        currentTime,
        duration,
        seek,
        nextTrack,
        previousTrack,
        isShuffle,
        repeatMode,
        toggleShuffle,
        toggleRepeat,
        volume,
        changeVolume
    } = usePlayer();

    const [waveformBars, setWaveformBars] = useState([20, 40, 60, 80, 100, 90, 70, 50, 30, 45, 65, 85, 95, 75, 55]);
    const [colorOffset, setColorOffset] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setWaveformBars(prevBars => prevBars.map(() => Math.random() * 80 + 20));
                setColorOffset(prev => prev + 1);
            }, 150);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = clickX / width;
        seek(ratio);
    };

    const track = currentTrack || {
        title: "No song playing",
        subtitle: "Select a song",
        imgSrc: "./img/music.png",
        album: "Unknown Album"
    };

    const [extractedColor, setExtractedColor] = useState('var(--color-primary)');
    const [extractedColorMuted, setExtractedColorMuted] = useState('var(--color-primary)');

    useEffect(() => {
        if (!track.imgSrc || track.imgSrc === "./img/music.png") {
            setExtractedColor('var(--color-primary)');
            setExtractedColorMuted('var(--color-primary)');
            return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = track.imgSrc;
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = 1;
                canvas.height = 1;
                ctx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                
                // Convert RGB to HSL to boost saturation and brightness
                let rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
                let max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
                let h, s, l = (max + min) / 2;

                if (max === min) {
                    h = s = 0; // achromatic
                } else {
                    let d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                        case gNorm: h = (bNorm - rNorm) / d + 2; break;
                        case bNorm: h = (rNorm - gNorm) / d + 4; break;
                    }
                    h /= 6;
                }
                
                h = Math.round(h * 360);
                s = Math.round(s * 100);
                l = Math.round(l * 100);
                
                // Boost saturation and lightness for a better neon pop
                if (s > 5) {
                    s = Math.max(s, 85); // Đảm bảo độ bão hòa cao để màu rực rỡ
                    l = Math.max(Math.min(l, 65), 55); // Cân bằng độ sáng ở mức lý tưởng (không quá trắng, không quá đen)
                } else {
                    l = Math.max(l, 55); // Với màu xám/đen thì chỉ cần tăng độ sáng
                }

                setExtractedColor(`hsl(${h}, ${s}%, ${l}%)`);
                // Màu nhạt hơn cho đĩa than (giảm bão hòa và hơi giảm sáng để dịu mắt)
                setExtractedColorMuted(`hsl(${h}, ${Math.max(s - 35, 20)}%, ${Math.max(l - 15, 35)}%)`);
            } catch (e) {
                setExtractedColor('var(--color-primary)');
                setExtractedColorMuted('var(--color-primary)');
            }
        };
        img.onerror = () => {
            setExtractedColor('var(--color-primary)');
            setExtractedColorMuted('var(--color-primary)');
        };
    }, [track.imgSrc]);

    const activeColor = isPlaying ? extractedColor : 'var(--color-surface-variant)';
    const activeColorMuted = isPlaying ? extractedColorMuted : 'var(--color-surface-variant)';
    const activeColorDim = isPlaying ? extractedColor : 'var(--color-surface-dim)';

    return (
        <section className="lg:col-span-7 flex flex-col w-full pb-24">
            {/* Turntable Plinth */}
            <div className="relative aspect-square max-w-[500px] mx-auto w-full group">
                <div className="absolute inset-0 bg-surface-dim rounded-[40px] shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.8),inset_5px_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center p-8">

                    {/* 💿 Rotating Vinyl */}
                    <div
                        onClick={togglePlay}
                        className="relative w-full h-full rounded-full shadow-2xl flex items-center justify-center cursor-pointer select-none overflow-hidden border-2 border-surface-variant"
                        style={{
                            animation: 'spin 20s linear infinite',
                            animationPlayState: isPlaying ? 'running' : 'paused'
                        }}
                    >
                        {/* Dynamic Transparent Background */}
                        <div
                            className="absolute inset-0 transition-colors duration-700"
                            style={{ backgroundColor: activeColorMuted, opacity: 0.8 }}
                        ></div>
                        {/* Outer black rim */}
                        <div className="absolute inset-0 rounded-full border-[16px] border-on-surface flex items-center justify-center"></div>

                        {/* Black Organic Shapes (SVG) */}
                        <svg className="absolute inset-0 w-full h-full text-on-surface drop-shadow-xl" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ zIndex: 1 }}>
                            <defs>
                                <mask id="vinyl-mask">
                                    <path fill="white" d="M100,0 C130,10 140,50 170,40 C190,30 200,60 200,100 C200,130 180,180 150,160 C120,140 110,190 100,200 C70,190 60,150 30,160 C10,170 0,140 0,100 C0,70 20,20 50,40 C80,60 90,10 100,0 Z" />
                                    <path fill="black" d="M100,20 C120,25 130,55 150,45 C165,35 180,55 180,100 C180,120 165,160 140,145 C115,130 110,170 100,180 C80,175 70,145 45,155 C25,165 20,130 20,100 C20,70 40,40 60,50 C80,60 85,25 100,20 Z" />
                                    <path fill="white" d="M100,45 C110,50 115,70 130,65 C140,60 150,75 150,100 C150,115 140,135 125,125 C110,115 105,135 100,145 C85,140 80,120 65,130 C50,140 45,115 45,100 C45,80 60,60 75,70 C90,80 90,50 100,45 Z" />
                                </mask>
                            </defs>
                            <rect width="200" height="200" fill="currentColor" mask="url(#vinyl-mask)" />
                        </svg>


                        {/* Concentric rings (vinyl grooves) */}
                        <div className="absolute inset-12 rounded-full border border-primary/20 pointer-events-none" style={{ zIndex: 3 }}></div>
                        <div className="absolute inset-20 rounded-full border border-primary/10 pointer-events-none" style={{ zIndex: 3 }}></div>
                        <div className="absolute inset-[6.5rem] rounded-full border border-primary/10 pointer-events-none" style={{ zIndex: 3 }}></div>

                        {/* Center Label */}
                        <div className="w-40 h-40 rounded-full bg-on-surface relative shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-surface flex items-center justify-center p-1 overflow-hidden group" style={{ zIndex: 10 }}>
                            {/* Inner colored ring mimicking the blue ring in the image */}
                            <div className="absolute inset-0 rounded-full border-[8px] transition-colors duration-700" style={{ borderColor: activeColorDim, opacity: 0.3 }}></div>

                            {/* Album Artwork */}
                            <div className="w-full h-full rounded-full overflow-hidden transition-all duration-700 z-10" style={{ opacity: isPlaying ? 0.9 : 0.3, mixBlendMode: isPlaying ? 'normal' : 'luminosity' }}>
                                <img
                                    src={track.imgSrc || "./img/music.png"}
                                    alt="Album Cover"
                                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                                />
                            </div>

                            {/* Center hole pin */}
                            <div className="absolute w-3 h-3 rounded-full bg-surface shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-40"></div>
                        </div>
                    </div>

                    {/* 🕹️ Tonearm Assembly */}
                    <div
                        className="absolute top-8 right-8 w-16 h-48 origin-top-right transition-transform duration-1000 ease-in-out pointer-events-none z-20"
                        style={{ transform: isPlaying ? 'rotate(10deg)' : 'rotate(-30deg)' }}
                    >
                        <div className="w-4 h-4 bg-secondary-fixed-dim rounded-full shadow-md ml-auto"></div>
                        <div className="w-1.5 h-full bg-surface-variant mx-auto rounded-full shadow-inner border border-white/20"></div>
                        <div className="w-6 h-10 bg-on-surface-variant rounded-sm mt-[-10px] mx-auto shadow-md"></div>
                    </div>

                    <div className="absolute bottom-8 left-8 flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface shadow-md flex items-center justify-center border border-white/55">
                            <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isPlaying ? 'bg-error shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-neutral-400'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Track Info & Controls */}
            <div className="mt-12 flex flex-col items-center lg:items-start w-full">
                <div className="flex items-center gap-4 mb-2 select-none">
                    <span className="px-3 py-1 bg-on-background text-primary-fixed font-pixel text-[10px] rounded">CLASSIC</span>
                    <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">forum</span>
                        <span className="font-pixel text-sm font-bold">392</span>
                    </div>
                </div>

                {/* 🌟 Tên bài hát & Nghệ sĩ từ Spotify */}
                <ScrollingTitle text={track.title} isPlaying={isPlaying} />
                <p className="font-body text-base text-on-surface-variant mb-8 line-clamp-1">{track.subtitle} • {track.album}</p>

                {/* Waveform Visualizer */}
                <div className="w-full flex items-end justify-between h-16 gap-1 mb-6 px-4">
                    {waveformBars.map((height, i) => {
                        const totalBars = waveformBars.length;
                        const virtualIndex = (i - colorOffset % totalBars + totalBars) % totalBars;
                        // Thay thế HSL lightness bằng Opacity để áp dụng được cho bất kỳ màu nào
                        const opacityValue = 0.2 + (1 - (virtualIndex / (totalBars - 1))) * 0.8;
                        return (
                            <div
                                key={i}
                                style={{
                                    height: isPlaying ? `${height}%` : '15%',
                                    backgroundColor: activeColor,
                                    opacity: opacityValue
                                }}
                                className="flex-1 rounded-full transition-all duration-250"
                            ></div>
                        );
                    })}
                </div>

                {/* Progress Bar & Volume */}
                <div className="w-full flex justify-between items-center mb-10 relative">
                    <span className="font-pixel text-xs text-secondary w-16 text-right select-none">{formatTime(currentTime)}</span>

                    <div
                        onClick={handleProgressClick}
                        className="flex-1 mx-6 h-1.5 bg-surface-variant rounded-full relative cursor-pointer"
                    >
                        <div
                            className="absolute left-0 top-0 h-full rounded-full transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress * 100}%`,
                                backgroundColor: activeColor,
                                boxShadow: isPlaying ? `0 0 10px ${activeColor}` : 'none'
                            }}
                        ></div>
                    </div>

                    {/* Duration & Volume Container */}
                    <div className="w-16 flex items-center justify-start gap-2 relative">
                        <span className="font-pixel text-xs text-secondary select-none">{formatTime(duration)}</span>

                        {/* Unified Container */}
                        <div className="relative group flex flex-col items-center">

                            {/* Popover Vertical Slider (Appears on Hover, Absolute Positioned Upwards) */}
                            <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 flex flex-col items-center bg-surface-container-highest border border-white/5 rounded-lg shadow-2xl py-3 w-8 pointer-events-none group-hover:pointer-events-auto">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                    className="appearance-none w-1.5 h-24 bg-surface-variant rounded-full outline-none cursor-pointer accent-primary"
                                    style={{ WebkitAppearance: 'slider-vertical', writingMode: 'vertical-bt' }}
                                />
                            </div>

                            {/* Speaker Icon (Always visible) */}
                            <button
                                onClick={() => changeVolume(volume > 0 ? 0 : 0.5)}
                                className="cursor-pointer text-secondary group-hover:text-primary transition-colors flex items-center active:scale-90 p-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-10 w-full select-none">
                    <button
                        onClick={toggleShuffle}
                        className={`transition-all active:scale-90 cursor-pointer ${isShuffle ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        <span className="material-symbols-outlined text-2xl">shuffle</span>
                    </button>
                    <button
                        onClick={previousTrack}
                        className="text-on-surface hover:text-primary transition-all active:scale-90 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-4xl">skip_previous</span>
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-on-surface text-surface flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>
                    <button
                        onClick={nextTrack}
                        className="text-on-surface hover:text-primary transition-all active:scale-90 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-4xl">skip_next</span>
                    </button>
                    <button
                        onClick={toggleRepeat}
                        className={`transition-all active:scale-90 cursor-pointer relative ${repeatMode !== 'off' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {repeatMode === 'track' ? 'repeat_one' : 'repeat'}
                        </span>
                        {repeatMode !== 'off' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MainContent;