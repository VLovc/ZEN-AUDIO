import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryChips from './CategoryChips';
import RecentCard from './RecentCard';
import CollectionCard from './CollectionCard';
import Sidebar from '../Layout/Sidebar';
import PlayerBarStudio from '../Layout/PlayerBarStudio'; 
import { usePlayer } from '../../context/PlayerContext';

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

    const [recents, setRecents] = useState([
        { id: 1, title: "Midnight Vinyl", subtitle: "Curated Mood • 12 Tracks", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPs_daCVjDZR5CZePv1f-6sUarGDo-a6E8AWdFYFSCWYmlHGk9r15yEH5nM4GJmnO7VK5L8Ut1P48AD4IXIShZfqaFsRGvfAlGDvyelA_b0TaU36s_rS2vgc9doHFYpVN9zZAvU3EL-CtuumkDXmQ0Ll_ZvnihL3d5fxK0VCGpnT_1BbD0RyIlU0Ordp41LoWSs7RDzgT_7qWEI6rHrMHjeQw5_VpOaB-P9d5U5iOEcK1A-TLDWU0WYTr_JPlPBEmJRpaAC4cLXZk" },
        { id: 2, title: "Studio Sessions", subtitle: "Recording Room • Vol. 04", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9bs8zebTIfC-4Pv7ygxGk5CAS9sB9vckuuP7xuBJSQyHtCCGlduUSKmFezkJdRJtQEz4VslYSwTu4TzWsV0vZG4agj6fHTqEXoYU-hPJYwriKVhtrkSx9rXnZ8FcmW8NcOu1Pp5ksWkC-fzflVyY-OO1djEWXdsmADveqXtRF-lNrCv-Yp4iO_IKmuXZHyr40gl0geOG_5Xqu7SSfn59sWU_1gf2-tmbVgJjAhMNzw6J8BGiEiYHfaS-CFMyM66aJELBeEn9yFr4" },
        { id: 3, title: "Analog Soul", subtitle: "Vocal Jazz • Artist Mix", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_zt70F_0102P18X4pLVHfsyq9WdIOiKe9bkM7VquCv6XyaoegrKlAFL-zWpHdZzv_DiDjU80b2XgVx4-dx-AILXT5vp8u_y7R8aOuIS05f0AVf8afUgDSZZt05hZ_kF3nktL_hqgZKpEy7lyztMtqyqNgM8OgUG8f6ot_WHTSYxr12hZlusPNcQNc1YJ3ylBxOd3TkVGJ38OUMd9RbY3CF-ZBEu8NJDE97jKJkt_buIYvMeg0asuZzpIBCutYlL83X0okC3U1Ps" }
    ]);

    const [collections, setCollections] = useState([
        { id: 4, title: "Frequency Blue", subtitle: "32 songs", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxuFCTPMIWl_0lOj5rGcCirrJ03xvJolcor0yz3xJmWwPKug9FMTj5Xsqux5KtqvM9YfX3Mk3eC9_ZIJud-6awVLJmQdIXu4w8vWTMzaLgvCMkb0T6BLkZAOpNeiqvgBnXZTOM_HCjPxRIBd8jddHzbjeWqqTAdkBjUgbGSsnqXHyGX4k84PSFhcHoOFaJn2azujDmo-auVuMb8xCTrG3o54gydJd9HNkjEeeE0weh3xuMcOLrcDTcNe3UdvrwSsNTU1ylC24JOE0" },
        { id: 5, title: "Echoes of Tape", subtitle: "Lo-Fi Master", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf6TOef8Jp1M892KV69mCZ5-3iKvH48dSV5iNUj_SgsTlyUgjLmNHy8R0fyIYDjNMippK6LYMukBSdta29xgWH5co51MiLc_8-UjllrSUnY7Bh5j6t3aTRzs2g7-RFMolvthBf8VZksH0nSkGjxd0boNqDuw_M7RcnX6WhCwuD1ohv1Ggojn8ntXTahe_ZmiDSF2rAbNxQUWEbnf6V3_-WkRMze0yan_bR0r5gcEGKMOXDopq2cAw76GrlbHNfuQ7itROU_D0anPs" },
        { id: 6, title: "Night Drive", subtitle: "18 songs", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi9FYd0pbWG9aazN4OMgn_tgNSC-oCXgqQY0iYzjxarPO5aSRzQNQSsD5JZVn6POjXz0pg12xkfArQxlaK-ng_ieBAu66MI-OxEW8pu4YEoh4PUTladwOLd99TDo7ErjE29OYMCrZaf-3aqlv0IwIf7RJSY9uH2DFFAL16raCJv5XvBBcYGRBlUyBTqOKSmJbB6qRHonVf9t00qXEs95_uiGXr4qQ6c6EqGg8f2KS5USgZiOg_mObO3TkknEHCXPxuhEF52MkPhTk" },
        { id: 7, title: "Club Classics", subtitle: "Various Artists", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOIaSgLwMoiHXzrM0QdR4Vfletv5bCKyhdyYL9R1PZesOOGuuGJcxuW9KfU3VMDVLs-9JrrombcFdyXZLuOGjTafBdT1RLU7qS2kcODrcSoDYCwxRWBN-295gCiov8FgUgZR0rd0djuvNokBhDObO0SzhaDgZZhdIORe8XliFYhDAt3HEP6HDyoWKw8Z_jrlVXG8x4GKM9y1A-7h4ktID8YlbDIPA9kGVWcCgcYjx9PecPuyuyhykGIGdPeWfypJdADnF4w4uxx-c" },
        { id: 8, title: "Zen Garden", subtitle: "Ambient Collective", imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvWKYY1V-8FrG9IvUiNK8s8d7u2JNe-dEA0URNyWU6pm6Sqe4cDZYStQQzui70rWOaFzBU42k3KnoueDECph7fEnqrWTnjuE1IeYgFYxglvL9WDy8zYx19N7-PjGFRyIjQA_vEBSQ5eyN7au2I8gz2fil74FD6L8CxMYNe1xByyydG5MvCPfc9nwEpeptGXQVJpczwlmsvT-G723U6Qzhujle6BeVEDrSxSS_nzz8n15FFPc3NgIZ0rghfMnYNEUvMbzbwJg1VFCw" }
    ]);

    useEffect(() => {
        const fetchLibraryData = async () => {
            const spotifyToken = localStorage.getItem('spotify_token');
            if (!spotifyToken) return;

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
                            subtitle: `${item.tracks?.total || 0} songs`,
                            imgSrc: item.images[0]?.url || "./img/music.png",
                            uri: item.uri
                        }));
                        setCollections(formattedPlaylists);
                    }
                }
            } catch (err) {
                console.error("Lỗi lấy Playlists từ Spotify:", err);
            }
        };

        fetchLibraryData();
    }, []);

    return (
        <div className="bg-background text-on-surface font-body-md min-h-screen flex">
            <Sidebar />

            <div className="flex-1 w-full flex flex-col relative">
                <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] flex justify-between items-center px-6 md:px-10 py-4 z-30 bg-background/80 backdrop-blur-md border-b border-surface-variant/20">
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

                <main className="pt-24 pb-32 ml-0 md:ml-64 min-h-screen overflow-y-auto max-h-screen px-6 md:px-10">
                    <section className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h2 className="font-display-lg text-4xl font-bold text-on-surface mb-2">My Library</h2>
                                <p className="font-label-pixel text-secondary opacity-70 uppercase tracking-[0.2em] text-[10px]">Thư viện của tôi</p>
                            </div>
                            <CategoryChips />
                        </div>

                        <div className="mb-16">
                            <h3 className="font-label-pixel text-secondary opacity-50 uppercase tracking-[0.3em] text-[10px] mb-8">Recently Played</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recents.map(item => (
                                    <RecentCard
                                        key={item.id}
                                        {...item}
                                        onClick={() => handlePlayTrack(item)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-20">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-label-pixel text-secondary opacity-50 uppercase tracking-[0.3em] text-[10px]">Your Collections</h3>
                                <a className="font-label-pixel text-[11px] text-primary border-b border-primary/30 hover:border-primary transition-all uppercase" href="#">View all</a>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-8">
                                {collections.map(col => (
                                    <CollectionCard
                                        key={col.id}
                                        {...col}
                                        onClick={() => handlePlayCollection(col)}
                                    />
                                ))}
                                <CollectionCard isCreateNew={true} />
                            </div>
                        </div>
                    </section>
                </main>

                {/* Tích hợp PlayerBar vào đây */}
                <PlayerBarStudio currentTrack={currentTrack} />

            </div>
        </div>
    );
};

export default LibraryMain;