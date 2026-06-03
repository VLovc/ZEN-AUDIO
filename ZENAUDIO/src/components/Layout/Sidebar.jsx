// src/components/Layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = usePlayer();

    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            setDate(`${day}-${month}-${year}`);

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    // Danh sách menu để render động
    const menuItems = [
        { name: 'Home', icon: 'home', path: '/home' },
        { name: 'Library', icon: 'library_music', path: '/library' },
        { name: 'Artist', icon: 'person', path: '/artist' },
        { name: 'Search', icon: 'search', path: '/search' },
        { name: 'Studio', icon: 'graphic_eq', path: '/studio' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-zinc-900 flex flex-col p-8 z-40 hidden md:flex overflow-hidden text-zinc-400">

            {/* LƯỚI CHẤM NEON CHÌM */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            ></div>

            {/* Bọc nội dung */}
            <div className="relative z-10 flex flex-col h-full w-full">

                {/* Header Brand */}
                <div className="mb-12 cursor-pointer" onClick={() => navigate('/home')}>
                    <h1 className="font-headline text-3xl font-bold tracking-tighter text-white">ZEN AUDIO</h1>
                    <p className="font-pixel text-[12px] text-zinc-400 mt-1 flex items-center gap-2 select-none">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00] shadow-[0_0_10px_#ccff00]"></span>
                        </span>
                        Hi-Fi Console
                    </p>
                </div>

                {/* Navigation Menu - RENDER ĐỘNG */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path; // Kiểm tra xem tab nào đang active
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)} // Điều hướng không tải lại trang
                                className={`w-full flex items-center gap-4 px-4 py-2 font-body text-base transition-colors duration-200 cursor-pointer border-r-2 
                                    ${isActive
                                        ? 'text-[#ccff00] font-bold border-[#ccff00] bg-zinc-900/80'
                                        : 'text-zinc-400 font-semibold border-transparent hover:bg-zinc-900 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto pt-8 border-t border-zinc-900 flex flex-col gap-4">
                    <div className="bg-[#ccff00] p-4 rounded-xl mb-2 text-[#161e00] text-center select-none shadow-[0_0_12px_rgba(204,255,0,0.15)]">
                        <p className="font-pixel text-[10px] mb-1.5 font-black tracking-wider">{date}</p>
                        <button className="w-full bg-[#161e00] text-[#ccff00] py-1.5 rounded-lg font-pixel font-bold text-xs hover:opacity-90 transition-opacity cursor-default border-none">
                            {time}
                        </button>
                    </div>

                    <button className="flex items-center gap-4 px-4 py-2 text-zinc-400 font-medium hover:bg-zinc-900 hover:text-white transition-colors duration-200 w-full text-left cursor-pointer">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-body text-base">Settings</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-2 text-red-400 font-medium hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 w-full text-left cursor-pointer"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-body text-base">Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;