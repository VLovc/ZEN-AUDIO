// src/components/Search/SearchMain.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import SearchHeader from './SearchHeader';
import SearchBar from './SearchBar';
import BentoGrid from './BentoGrid';
import PlayerBarStudio from '../Layout/PlayerBarStudio';
import { usePlayer } from '../../context/PlayerContext';

const SearchMain = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { playTrack, currentTrack, userProfile } = usePlayer();

    // Sync URL search param to state
    useEffect(() => {
        const q = searchParams.get('q');
        if (q !== null && q !== searchQuery) {
            setSearchQuery(q);
        }
    }, [searchParams]);

    // Sync state to URL search param
    useEffect(() => {
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }, [searchQuery]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                // Giới hạn 5 kết quả cho môi trường sandbox Spotify
                const res = await fetch(`http://127.0.0.1:5000/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.tracks && data.tracks.items) {
                        setSearchResults(data.tracks.items);
                    }
                }
            } catch (err) {
                console.error("Lỗi tìm kiếm bài hát:", err);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <div className="bg-background text-on-surface font-body-md min-h-screen flex selection:bg-primary-container">
            {/* Sidebar Cố định */}
            <Sidebar />

            {/* Vùng nội dung chính bên phải */}
            <div className="flex-1 w-full flex flex-col">
                {/* TopNavBar */}
                <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] flex justify-between items-center px-6 md:px-10 py-4 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant/20">
                    <div className="relative w-96 hidden sm:block">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary select-none">search</span>
                        <input 
                            className="w-full bg-surface-container border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none text-on-surface" 
                            placeholder="Search for songs, artists" 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-secondary hover:opacity-70 transition-opacity"><span className="material-symbols-outlined">notifications</span></button>
                        <button className="text-secondary hover:opacity-70 transition-opacity"><span className="material-symbols-outlined">settings</span></button>
                        <div className="flex items-center gap-3">
                            <span className="font-pixel text-[10px] text-primary tracking-wider uppercase hidden sm:block">
                                {userProfile?.display_name || "User"}
                            </span>
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ccff00] shadow-sm shadow-[#ccff00]/10">
                                <img alt="User profile" className="w-full h-full object-cover" src={userProfile?.images?.[0]?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scroll Content */}
                <main className="pt-24 pb-32 ml-0 md:ml-64 min-h-screen overflow-y-auto max-h-screen px-6 md:px-10">
                    <section className="max-w-[1440px] mx-auto">
                        <SearchHeader />
                        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        
                        {searchQuery.trim() ? (
                            <div className="space-y-4 mb-10">
                                <h3 className="font-headline text-lg font-bold text-on-surface select-none">
                                    {loading ? "Đang quét tần số..." : `Kết quả tìm kiếm cho "${searchQuery}"`}
                                </h3>
                                
                                {loading && (
                                    <div className="flex gap-2 items-center py-12 justify-center">
                                        <div className="w-1.5 h-6 bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1.5 h-6 bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-6 bg-primary animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                    </div>
                                )}

                                {!loading && searchResults.length === 0 && (
                                    <div className="text-zinc-500 font-pixel text-xs py-12 text-center select-none">
                                        [NO_FREQUENCY_FOUND // 404]
                                    </div>
                                )}

                                {!loading && searchResults.length > 0 && (
                                    <div className="space-y-2.5 max-w-4xl">
                                        {searchResults.map((track) => {
                                            const durationMin = Math.floor(track.duration_ms / 60000);
                                            const durationSec = String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0');
                                            return (
                                                <div 
                                                    key={track.id}
                                                    onClick={() => playTrack(track)}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group cursor-pointer border border-transparent hover:border-primary/20"
                                                >
                                                    <img 
                                                        src={track.album?.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150"} 
                                                        alt={track.name} 
                                                        className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                         <h4 className="font-body font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{track.name}</h4>
                                                         <p className="font-pixel text-[10px] text-secondary truncate">
                                                             <span 
                                                                 className="hover:text-primary hover:underline cursor-pointer"
                                                                 onClick={(e) => {
                                                                     e.stopPropagation();
                                                                     navigate(`/artist?id=${track.artists[0]?.id}`);
                                                                 }}
                                                             >
                                                                 {track.artists[0]?.name}
                                                             </span>
                                                             {` • ${track.album?.name}`}
                                                         </p>
                                                     </div>
                                                    <span className="font-pixel text-xs text-secondary mr-2">{durationMin}:{durationSec}</span>
                                                    <button className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-105 cursor-pointer border-none">
                                                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <BentoGrid onPlayTrack={playTrack} />
                        )}
                    </section>
                </main>

                {/* Bottom Playback Console (Footer) */}
                <PlayerBarStudio currentTrack={currentTrack} />
            </div>
        </div>
    );
};

export default SearchMain;
