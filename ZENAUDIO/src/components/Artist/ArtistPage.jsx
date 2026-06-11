// src/components/Artist/ArtistPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import ArtistHero from './ArtistHero';
import PopularTracks from './PopularTracks';
import AlbumGrid from './AlbumGrid';
import ArtistSidebarInfo from './ArtistSidebarInfo';
import Sidebar from '../Layout/Sidebar'; // REMOVED
import PlayerBarStudio from '../Layout/PlayerBarStudio'; // REMOVED

const ArtistPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currentTrack } = usePlayer();
    
    // Get artist ID from query params
    const artistId = searchParams.get('id');

    // Single artist states
    const [artist, setArtist] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    // Top artists states (when no specific artistId)
    const [topArtists, setTopArtists] = useState([]);
    const [loadingTop, setLoadingTop] = useState(true);

    // Fetch data for a specific artist
    useEffect(() => {
        if (!artistId) return;

        const fetchArtistData = async () => {
            setLoading(true);
            const token = localStorage.getItem('spotify_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            try {
                const [artistRes, tracksRes, albumsRes] = await Promise.all([
                    fetch(`http://127.0.0.1:5000/api/spotify/artist/${artistId}`, { headers }),
                    fetch(`http://127.0.0.1:5000/api/spotify/artist/${artistId}/top-tracks`, { headers }),
                    fetch(`http://127.0.0.1:5000/api/spotify/artist/${artistId}/albums?limit=8`, { headers })
                ]);

                if (artistRes.ok) {
                    const artistData = await artistRes.json();
                    setArtist(artistData);
                }
                if (tracksRes.ok) {
                    const tracksData = await tracksRes.json();
                    setTopTracks(tracksData.tracks || []);
                }
                if (albumsRes.ok) {
                    const albumsData = await albumsRes.json();
                    setAlbums(albumsData.items || []);
                }
            } catch (err) {
                console.error("Error fetching artist details from Spotify:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [artistId]);

    // Fetch user's top artists if no ID is specified
    useEffect(() => {
        if (artistId) return;

        const fetchTopArtists = async () => {
            setLoadingTop(true);
            const token = localStorage.getItem('spotify_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            try {
                const res = await fetch('http://127.0.0.1:5000/api/spotify/me/top/artists?limit=12', { headers });
                if (res.ok) {
                    const data = await res.json();
                    if (data.items && data.items.length > 0) {
                        setTopArtists(data.items);
                        setLoadingTop(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch top artists from Spotify:", err);
            }

            // Fallback: Curated popular artists
            const fallbackCurated = [
                { id: "7g2md4m4K2tP4G3W14GE9z", name: "Guns N' Roses", images: [{ url: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=300" }], popularity: 80, followers: { total: 11482901 } },
                { id: "4sc8gUOI1mNypt2zp7iySp", name: "Coheed and Cambria", images: [{ url: "https://images.unsplash.com/photo-1571330735066-03aaa9330d80?q=80&w=300" }], popularity: 58, followers: { total: 680012 } },
                { id: "1o9Z0154P5Aea6GkY5A9zX", name: "Miles Davis", images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300" }], popularity: 65, followers: { total: 1202553 } },
                { id: "4K6i31awLZ66qwp4jKptq1", name: "Daft Punk", images: [{ url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300" }], popularity: 82, followers: { total: 8102553 } }
            ];
            setTopArtists(fallbackCurated);
            setLoadingTop(false);
        };

        fetchTopArtists();
    }, [artistId]);

    // Case 1: Display user's top artists grid if no specific artistId is loaded
    if (!artistId) {
        return (
            <div className="flex-1 w-full">
                    <main className="flex-grow p-6 md:p-10 pb-32">
                        {/* Header Section */}
                        <div className="flex justify-between items-end mb-8 border-b border-dotted border-primary/20 pb-4">
                            <div>
                                <h2 className="font-display-lg text-4xl font-bold text-on-surface mb-2">Artists Console</h2>
                                <p className="font-label-pixel text-secondary opacity-70 uppercase tracking-[0.2em] text-[10px]">Đồng bộ danh sách nghệ sĩ</p>
                            </div>
                            <span className="font-label-pixel text-[9px] text-[#ccff00] bg-black/40 px-2.5 py-1 rounded border border-white/5 uppercase tracking-widest">[UPLINK_STABLE]</span>
                        </div>

                        {loadingTop ? (
                            <div className="flex flex-col gap-3 justify-center items-center py-20 font-pixel text-xs text-primary">
                                <div className="flex gap-1.5 items-end h-8">
                                    <div className="w-1.5 bg-primary animate-[bounce_0.6s_infinite] h-6" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1.5 bg-primary animate-[bounce_0.6s_infinite] h-4" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 bg-primary animate-[bounce_0.6s_infinite] h-5" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                                <div className="tracking-widest animate-pulse mt-2">SCANNING_NEURAL_UPLINK...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {topArtists.map((art) => {
                                    const artImg = art.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                                    return (
                                        <div 
                                            key={art.id}
                                            onClick={() => navigate(`/artist?id=${art.id}`)}
                                            className="group cursor-pointer bg-[#1b1c1c]/10 border border-white/5 hover:border-primary/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(204,255,0,0.05)] flex flex-col h-full bg-zinc-950"
                                        >
                                            <div className="aspect-square rounded-xl overflow-hidden mb-4 relative p-0.5 bg-zinc-900 border border-white/5">
                                                <img src={artImg} alt={art.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-2 left-2 z-10 font-label-pixel text-[8px] bg-black/70 text-[#ccff00] px-1.5 py-0.5 rounded border border-white/5 uppercase">
                                                    SYNC_{art.popularity || 50}%
                                                </div>
                                            </div>
                                            <h3 className="font-body-md font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors text-center uppercase tracking-tight">
                                                {art.name}
                                            </h3>
                                            <p className="font-pixel text-[9px] text-secondary text-center mt-1 uppercase tracking-wider">
                                                {art.followers?.total?.toLocaleString() || 0} syncs
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
            </div>
        );
    }

    // Case 2: Display loading state for specific artist details
    if (loading) {
        return (
            <div className="bg-[#161e00] text-[#ccff00] h-full flex-1 flex items-center justify-center font-pixel text-xs">
                <div className="text-center space-y-4">
                    <div className="flex gap-2 justify-center items-end h-8">
                        <div className="w-1.5 bg-[#ccff00] animate-[pulse_0.8s_infinite] h-8" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 bg-[#ccff00] animate-[pulse_0.8s_infinite] h-5" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 bg-[#ccff00] animate-[pulse_0.8s_infinite] h-7" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-1.5 bg-[#ccff00] animate-[pulse_0.8s_infinite] h-4" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <div className="tracking-widest animate-pulse">SCANNING_NEURAL_UPLINK...</div>
                    <div className="text-[#ccff00]/60 text-[10px]">[ESTABLISHING SECURE PROTOCOL]</div>
                </div>
            </div>
        );
    }

    // Case 3: Display loaded specific artist details
    return (
        <div className="flex-1 w-full pb-32">
            <main className="flex-grow">
                    <ArtistHero artist={artist} />

                    {/* Content Grid */}
                    <div className="px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
                        <div className="lg:col-span-8 space-y-12">
                            <PopularTracks tracks={topTracks} />
                            <AlbumGrid albums={albums} />
                        </div>
                        <div className="lg:col-span-4">
                            <ArtistSidebarInfo artist={artist} />
                        </div>
                    </div>
            </main>
        </div>
    );
};

export default ArtistPage;