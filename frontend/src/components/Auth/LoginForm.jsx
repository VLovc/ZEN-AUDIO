// src/components/Auth/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [timestamp, setTimestamp] = useState('');
    const errorParam = searchParams.get('error');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTimestamp(`${year}.${month}.${day} // ${hours}:${minutes}:${seconds}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSpotifyLogin = () => {
        // Điều hướng trình duyệt đến endpoint backend để bắt đầu luồng OAuth
        window.location.href = "http://127.0.0.1:5000/api/auth/login";
    };

    return (
        <div className="bg-surface font-body text-on-surface overflow-hidden h-screen w-screen relative flex flex-col">

            {/* Main view container */}
            <main className="flex w-full h-[calc(100vh-2rem)] overflow-hidden">

                {/* ================= LEFT SIDE (VISUAL ART) ================= */}
                <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-black items-center justify-center border-r border-zinc-900 select-none">
                    <div
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    ></div>

                    <div className="relative z-10 w-4/5 aspect-square max-w-2xl flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-[pulse_8s_infinite]"></div>
                        <div className="absolute inset-8 rounded-full border border-primary/40 animate-[pulse_6s_infinite]"></div>
                        <div className="absolute inset-16 rounded-full border border-primary/60 animate-[pulse_4s_infinite]"></div>
                        <img
                            className="w-full h-full object-cover rounded-xl pixel-border z-20 grayscale hover:grayscale-0 transition-all duration-700"
                            src="https://i.pinimg.com/736x/7f/e9/3c/7fe93cfbf9519f9850034918d3a1d5d8.jpg"
                            alt="Turntable Needle Vinyl"
                        />
                    </div>

                    {/* Technical Detail Overlays */}
                    <div className="absolute top-10 left-10 font-pixel text-primary uppercase flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                            <span className="text-xs font-bold">System Status: Optimal</span>
                        </div>
                        <div className="text-[10px] text-zinc-500">Frequency: 44.1kHz / 24bit</div>
                    </div>
                    <div className="absolute bottom-10 right-10 flex flex-col items-end">
                        <span className="font-pixel text-6xl text-white opacity-5 font-bold">01</span>
                        <span className="font-pixel text-primary uppercase tracking-widest text-[10px]">Reference Audio Engine</span>
                    </div>
                </div>

                {/* ================= RIGHT SIDE: SPOTIFY OAUTH ================= */}
                <div className="w-full lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 md:p-12 bg-black relative">
                    {/* Retro background details */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#444933 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}
                    ></div>

                    <div className="max-w-md w-full flex flex-col gap-8 my-auto relative z-10">

                        {/* Top Logo branding */}
                        <div className="flex justify-between items-center select-none border-b border-zinc-900 pb-4">
                            <div className="flex items-center gap-2">
                                <svg className="size-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.332 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                                <h1 className="font-headline text-lg uppercase font-bold tracking-tight text-white">ZEN AUDIO</h1>
                            </div>
                            <span className="font-pixel text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">v1.2.0</span>
                        </div>

                        {/* Title and Descriptions */}
                        <div className="flex flex-col gap-2 font-body">
                            <h2 className="font-headline text-3xl font-bold text-white tracking-tight leading-tight">ỦY QUYỀN SPOTIFY</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                ZEN AUDIO kết nối trực tiếp với Spotify API để đồng bộ hóa danh sách phát, quản lý thư viện và truyền phát nhạc lossless thông qua máy chủ của chúng tôi.
                            </p>
                        </div>

                        {errorParam && (
                            <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-4 flex gap-3 text-red-200 text-xs">
                                <span className="material-symbols-outlined text-red-400">warning</span>
                                <div>
                                    <strong className="block font-bold mb-0.5">Lỗi Ủy quyền:</strong>
                                    Có lỗi xảy ra trong quá trình đồng bộ hóa tài khoản Spotify. Vui lòng thử lại.
                                </div>
                            </div>
                        )}

                        {/* Authorization Feature Grid */}
                        <div className="grid grid-cols-2 gap-4 my-2">
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col gap-2 hover:border-zinc-700/80 transition-colors">
                                <span className="material-symbols-outlined text-primary text-xl">wifi_tethering</span>
                                <div className="font-headline text-xs font-semibold text-white">STREAMING</div>
                                <div className="text-[10px] text-zinc-500 leading-normal">Đồng bộ và phát sóng chất lượng 320kbps Ogg.</div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col gap-2 hover:border-zinc-700/80 transition-colors">
                                <span className="material-symbols-outlined text-primary text-xl">library_music</span>
                                <div className="font-headline text-xs font-semibold text-white">PLAYLIST SYNC</div>
                                <div className="text-[10px] text-zinc-500 leading-normal">Tự động nhận diện thư viện & Album yêu thích.</div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col gap-2 hover:border-zinc-700/80 transition-colors">
                                <span className="material-symbols-outlined text-primary text-xl">settings_remote</span>
                                <div className="font-headline text-xs font-semibold text-white">REMOTE CONTROL</div>
                                <div className="text-[10px] text-zinc-500 leading-normal">Chuyển bài, tạm dừng trên mọi thiết bị liên kết.</div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col gap-2 hover:border-zinc-700/80 transition-colors">
                                <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
                                <div className="font-headline text-xs font-semibold text-white">AUDIO ENGINE</div>
                                <div className="text-[10px] text-zinc-500 leading-normal">Tối ưu hóa DAC, nâng cấp EQ đồ họa 11 băng tần.</div>
                            </div>
                        </div>

                        {/* Connection Spotify CTA Button */}
                        <div className="flex flex-col gap-4 mt-2">
                            <button
                                type="button"
                                onClick={handleSpotifyLogin}
                                className="w-full h-14 bg-[#1DB954] hover:bg-[#1ed760] text-black font-headline font-bold text-base rounded-full shadow-[0_0_30px_rgba(29,185,84,0.3)] hover:shadow-[0_0_40px_rgba(29,185,84,0.5)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer group"
                            >
                                <svg className="w-6 h-6 text-black group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.075-.668-.135-.744-.47-.076-.336.135-.668.47-.744 3.856-.88 7.15-.5 9.822 1.137.295.18.387.563.206.852zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.66-1.11 8.225-.573 11.35 1.348.367.227.487.707.26 1.074zm.107-2.846C14.238 8.613 8.163 8.413 4.636 9.484c-.54.163-1.112-.147-1.275-.687-.163-.54.147-1.112.687-1.275 4.056-1.23 10.77-1.004 14.996 1.503.486.289.645.912.356 1.398-.29.487-.913.646-1.4.357z"/>
                                </svg>
                                Kết nối với Spotify
                            </button>

                            <p className="text-center font-pixel text-[9px] text-zinc-500 tracking-wider uppercase select-none mt-2">
                                * ZEN AUDIO DOES NOT ACCESS OR STORE YOUR PASSWORD.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* ================= RETRO BOTTOM STATUS BAR ================= */}
            <div className="h-8 bg-[#09090b] flex items-center px-4 justify-between font-label-pixel text-[9px] text-zinc-500 uppercase tracking-[0.2em] border-t border-zinc-900 z-50 select-none">
                <div className="flex gap-4">
                    <span className="text-primary font-bold">Live: Server_HCMC_01</span>
                    <span id="timestamp" className="text-zinc-500">{timestamp}</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-primary/20 animate-pulse"></div>
                        <div className="w-1 h-3 bg-primary/40 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span>Secure Spotify API Tunnel</span>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;