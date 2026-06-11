// src/components/Search/SearchMain.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionVariants } from '../../theme';
import SearchHeader from './SearchHeader';
import SearchBar from './SearchBar';
import NewReleases from './NewReleases';
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
        <>
            {/* TopNavBar */}
            <header className="sticky top-0 flex justify-between items-center px-6 md:px-10 py-4 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant/20">
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
            <main className="flex-1 p-6 md:p-10 pb-32">
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
                                <motion.ul 
                                    className="flex flex-col gap-3 w-full"
                                    initial="hidden"
                                    animate="visible"
                                    variants={motionVariants.listContainer}
                                >
                                    {searchResults.map((track) => {
                                        const durationMin = Math.floor(track.duration_ms / 60000);
                                        const durationSec = String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0');
                                        return (
                                            <motion.li 
                                                key={track.id}
                                                layout
                                                variants={motionVariants.listItem}
                                                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => playTrack(track)}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors duration-300 ease-in-out group cursor-pointer ${
                                                    currentTrack && currentTrack.id === track.id
                                                        ? 'bg-zinc-900 dark:bg-black border-white/10 shadow-sm text-white'
                                                        : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/10 dark:hover:border-white/10 hover:shadow-sm'
                                                }`}
                                            >
                                                <img 
                                                    src={track.album?.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150"} 
                                                    alt={track.name} 
                                                    className={`w-12 h-12 rounded-lg object-cover transition-all shadow-sm ${currentTrack && currentTrack.id === track.id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                                                />
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                     <h4 className={`font-body font-bold text-base truncate transition-colors ${currentTrack && currentTrack.id === track.id ? 'text-[#ccff00]' : 'text-on-surface group-hover:text-[#ccff00]'}`}>{track.name}</h4>
                                                     <p className={`font-pixel text-[10px] truncate mt-0.5 opacity-80 transition-colors ${currentTrack && currentTrack.id === track.id ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`}>
                                                         <span 
                                                             className="hover:text-[#ccff00] hover:underline cursor-pointer"
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
                                                <span className={`font-pixel text-xs mr-4 transition-colors ${currentTrack && currentTrack.id === track.id ? 'text-zinc-300' : 'text-secondary group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`}>{durationMin}:{durationSec}</span>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${currentTrack && currentTrack.id === track.id ? 'bg-[#ccff00] text-black opacity-100' : 'bg-[#ccff00] text-black opacity-0 group-hover:opacity-100'}`}>
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{currentTrack && currentTrack.id === track.id ? 'pause' : 'play_arrow'}</span>
                                                </div>
                                            </motion.li>
                                        );
                                    })}
                                </motion.ul>
                            )}
                        </div>
                    ) : (
                        <div className="mt-8">
                            <h3 className="font-headline text-2xl font-bold text-on-surface mb-6 select-none">
                                Top Albums & New Releases
                            </h3>
                            <NewReleases onPlayTrack={playTrack} />
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};

export default SearchMain;
