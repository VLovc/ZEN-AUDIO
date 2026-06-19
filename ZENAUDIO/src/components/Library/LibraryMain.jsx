import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContent from '../AnimatedContent/AnimatedContent';
import CategoryChips from './CategoryChips';
import RecentCard from './RecentCard';
import CollectionCard from './CollectionCard';
import { usePlayer } from '../../context/PlayerContext';

const LibrarySkeleton = () => (
    <motion.div 
        key="skeleton"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
    >
        <div className="mb-16">
            <h3 className="font-label-pixel text-secondary opacity-50 uppercase tracking-[0.3em] text-[10px] mb-8">Recently Played</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-[104px] bg-surface-container/50 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
        <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-label-pixel text-secondary opacity-50 uppercase tracking-[0.3em] text-[10px]">Your Collections</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col gap-4">
                        <div className="w-full aspect-square bg-surface-container/50 rounded-2xl animate-pulse"></div>
                        <div className="h-4 bg-surface-container/50 w-3/4 rounded animate-pulse mt-2"></div>
                        <div className="h-3 bg-surface-container/50 w-1/2 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

const LibraryMain = () => {
    const navigate = useNavigate();
    const { playTrack, currentTrack, userProfile } = usePlayer();

    const handlePlayTrack = (track) => {
        playTrack(track);
    };

    const handlePlayCollection = (col) => {
        playTrack({ context_uri: col.uri, title: col.title, subtitle: col.subtitle, imgSrc: col.imgSrc });
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
        }
    };

    const [recents, setRecents] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibraryData = async () => {
            const spotifyToken = localStorage.getItem('spotify_token');
            if (!spotifyToken) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setRecents([]);
            setCollections([]);

            try {
                // 1. Lấy danh sách bài hát đã lưu (Saved Tracks)
                const tracksRes = await fetch('http://127.0.0.1:5000/api/spotify/library/tracks?limit=5', {
                    headers: { 'Authorization': `Bearer ${spotifyToken}` }
                });
                if (tracksRes.ok) {
                    const tracksData = await tracksRes.json();
                    if (tracksData && tracksData.items && tracksData.items.length > 0) {
                        const formattedTracks = tracksData.items.map((item, idx) => ({
                            id: item.track.id || idx,
                            name: item.track.name,
                            title: item.track.name,
                            artist: item.track.artists[0]?.name || "Unknown Artist",
                            subtitle: `${item.track.artists[0]?.name || "Unknown"} • Saved Song`,
                            imgSrc: item.track.album?.images[0]?.url || "./img/music.png",
                            uri: item.track.uri,
                            preview_url: item.track.preview_url
                        }));
                        setRecents(formattedTracks);
                    }
                }
            } catch (err) {
                console.error("Lỗi lấy Saved Tracks từ Spotify:", err);
            }

            try {
                // 2. Lấy danh sách Playlists cá nhân
                const playlistsRes = await fetch('http://127.0.0.1:5000/api/spotify/playlists/me?limit=5', {
                    headers: { 'Authorization': `Bearer ${spotifyToken}` }
                });
                if (playlistsRes.ok) {
                    const playlistsData = await playlistsRes.json();
                    if (playlistsData && playlistsData.items && playlistsData.items.length > 0) {
                        const formattedPlaylists = playlistsData.items.map((item) => ({
                            id: item.id,
                            title: item.name,
                            subtitle: typeof item.tracks === 'number'
                                ? `${item.tracks} songs`
                                : Array.isArray(item.tracks)
                                    ? `${item.tracks.length} songs`
                                    : typeof item.tracks?.total === 'number'
                                        ? `${item.tracks.total} songs`
                                        : 'Spotify Playlist',
                            imgSrc: item.images[0]?.url || "./img/music.png",
                            uri: item.uri
                        }));
                        setCollections(formattedPlaylists);
                    }
                }
            } catch (err) {
                console.error("Lỗi lấy Playlists từ Spotify:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLibraryData();
    }, []);

    return (
        <div className="flex-1 w-full">
            <header className="sticky top-0 flex justify-between items-center px-6 md:px-10 py-4 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant/20">
                <div className="relative w-96 hidden sm:block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary">search</span>
                    <input 
                        className="w-full bg-surface-container border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" 
                        placeholder="Search for songs, artists" 
                        type="text" 
                        onKeyDown={handleSearchKeyPress}
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

            <main className="flex-1 p-6 md:p-10 pb-32">
                <section className="max-w-[1440px] mx-auto min-h-[800px]">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="font-display-lg text-4xl font-bold text-on-surface mb-2">My Library</h2>
                            <p className="font-label-pixel text-secondary opacity-70 uppercase tracking-[0.2em] text-[10px]">Thư viện của tôi</p>
                        </div>
                        <CategoryChips />
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <LibrarySkeleton />
                        ) : (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="mb-16">
                                    <h3 className="font-label-pixel text-secondary opacity-50 uppercase tracking-[0.3em] text-[10px] mb-8">Recently Played</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[104px]">
                                        {recents.map((item, idx) => (
                                            <AnimatedContent
                                                key={item.id}
                                                distance={40}
                                                direction="vertical"
                                                delay={idx * 0.08}
                                                duration={0.6}
                                                initialOpacity={0}
                                                animateOpacity
                                            >
                                                <RecentCard
                                                    {...item}
                                                    onClick={() => handlePlayTrack(item)}
                                                />
                                            </AnimatedContent>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-20">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-label-pixel text-secondary opacity-50 uppercase tracking-[0.3em] text-[10px]">Your Collections</h3>
                                        <a className="font-label-pixel text-[11px] text-primary border-b border-primary/30 hover:border-primary transition-all uppercase" href="#">View all</a>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-8 min-h-[300px]">
                                        {collections.map((col, idx) => (
                                            <AnimatedContent
                                                key={col.id}
                                                distance={40}
                                                direction="vertical"
                                                delay={idx * 0.08}
                                                duration={0.6}
                                                scale={0.9}
                                                initialOpacity={0}
                                                animateOpacity
                                            >
                                                <CollectionCard
                                                    {...col}
                                                    onClick={() => handlePlayCollection(col)}
                                                />
                                            </AnimatedContent>
                                        ))}
                                        <AnimatedContent 
                                            distance={40} 
                                            direction="vertical" 
                                            delay={collections.length * 0.08} 
                                            duration={0.6} 
                                            scale={0.9}
                                        >
                                            <CollectionCard isCreateNew={true} />
                                        </AnimatedContent>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>
        </div>
    );
};

export default LibraryMain;