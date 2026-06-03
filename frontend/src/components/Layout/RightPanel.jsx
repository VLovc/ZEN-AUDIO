// src/components/Layout/RightPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

const MOCK_PLAYLISTS = [
    { id: 'mock-1', name: "Best of Eren", tracks: { total: 32 }, uri: "spotify:playlist:37i9dQZF1DXcBWIGsyNa7T", images: [{ url: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150" }] },
    { id: 'mock-2', name: "Midnight Vinyl", tracks: { total: 18 }, uri: "spotify:playlist:37i9dQZF1DXcBWIGsyNa7T", images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150" }] }
];

const MOCK_RELEASES = [
    { id: 'mock-r1', name: "Daily Chaos", artists: [{ name: "Emily Bryan" }], images: [{ url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300" }] },
    { id: 'mock-r2', name: "Simple Things", artists: [{ name: "Ryan Poppin" }], images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300" }] }
];

const MOCK_RECOMMENDATIONS = [
    { id: 'mock-rec1', name: "Welcome Home", artists: [{ name: "Coheed and Cambria" }], duration_ms: 260000 },
    { id: 'mock-rec2', name: "Ten Speed", artists: [{ name: "Coheed and Cambria" }], duration_ms: 226000 },
    { id: 'mock-rec3', name: "Crossing the Frame", artists: [{ name: "Coheed and Cambria" }], duration_ms: 207000 }
];

const RightPanel = () => {
    const navigate = useNavigate();
    const { currentTrack, playTrack, isPlaying } = usePlayer();
    
    const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
    const [newReleases, setNewReleases] = useState(MOCK_RELEASES);
    const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);
    const [recsKey, setRecsKey] = useState(0); // trigger re-animation

    // Fetch playlists & new releases on mount
    useEffect(() => {
        const fetchStaticData = async () => {
            const token = localStorage.getItem('spotify_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            try {
                // 1. Fetch user playlists
                const playlistsRes = await fetch('http://127.0.0.1:5000/api/spotify/playlists/me?limit=4', { headers });
                if (playlistsRes.ok) {
                    const playlistsData = await playlistsRes.json();
                    if (playlistsData.items && playlistsData.items.length > 0) {
                        setPlaylists(playlistsData.items);
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch playlists:", err);
            }

            try {
                // 2. Fetch new releases
                const releasesRes = await fetch('http://127.0.0.1:5000/api/spotify/new-releases?limit=2', { headers });
                if (releasesRes.ok) {
                    const releasesData = await releasesRes.json();
                    if (releasesData.albums && releasesData.albums.items && releasesData.albums.items.length > 0) {
                        setNewReleases(releasesData.albums.items);
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch new releases:", err);
            }
        };

        fetchStaticData();
    }, []);

    // Fetch recommendations dynamically when currentTrack changes
    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('spotify_token');
            if (!token) return;
            setIsLoadingRecs(true);
            try {
                const seedParam = currentTrack?.id 
                    ? `seed_tracks=${currentTrack.id}` 
                    : `seed_genres=electronic,rock,chill`;

                const res = await fetch(`http://127.0.0.1:5000/api/spotify/recommendations?${seedParam}&limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.tracks && data.tracks.length > 0) {
                        setRecommendations(data.tracks);
                        setRecsKey(k => k + 1); // trigger slide-in animation
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch recommendations:", err);
            } finally {
                setIsLoadingRecs(false);
            }
        };

        fetchRecommendations();
    }, [currentTrack?.id]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <section className="lg:col-span-5 space-y-8 text-on-surface">
            {/* 1. New Releases (Music Categories) */}
            <div>
                <div className="flex justify-between items-end mb-4 select-none">
                    <h3 className="font-headline text-xl font-bold text-on-surface tracking-tight">New Releases</h3>
                    <span className="font-label-pixel text-[9px] text-primary uppercase tracking-[0.2em]">[ACTIVE_DECODING]</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {newReleases.slice(0, 2).map((album) => {
                        const artistName = album.artists?.[0]?.name || "Unknown Artist";
                        const albumImg = album.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                        return (
                            <div 
                                key={album.id} 
                                onClick={() => playTrack({ context_uri: album.uri, title: album.name, subtitle: artistName, imgSrc: albumImg })}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[3/3.7] rounded-xl overflow-hidden mb-2 border border-white/5 shadow-md hover:shadow-lg hover:border-primary/20 transition-all p-0.5 bg-zinc-950">
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        src={albumImg} 
                                        alt={album.name} 
                                    />
                                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors"></div>
                                    <div className="absolute top-2 left-2 z-10 font-label-pixel text-[8px] bg-black/70 text-[#ccff00] px-1.5 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        CONNECT_STREAM
                                    </div>
                                </div>
                                <h4 className="font-body font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{album.name}</h4>
                                <p className="font-pixel text-[10px] text-secondary truncate">{artistName}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Favorite Playlists */}
            <div>
                <div className="flex justify-between items-end mb-4 select-none">
                    <h3 className="font-headline text-xl font-bold text-on-surface">Favorite Playlists</h3>
                    <span className="font-label-pixel text-[9px] text-[#ccff00]/60 uppercase">{playlists.length} playlists found</span>
                </div>

                <div className="space-y-3">
                    {playlists.slice(0, 4).map((playlist) => {
                        const playlistImg = playlist.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                        const isCurrentContext = currentTrack?.context_uri === playlist.uri;

                        return (
                            <div 
                                key={playlist.id}
                                onClick={() => playTrack({ context_uri: playlist.uri, title: playlist.name, subtitle: "Spotify Playlist", imgSrc: playlistImg })}
                                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all group cursor-pointer border ${
                                    isCurrentContext 
                                        ? 'bg-surface-container-high border-primary/40 shadow-[0_0_12px_rgba(204,255,0,0.05)]' 
                                        : 'bg-surface-container-low border-transparent hover:bg-surface-container hover:border-primary/20'
                                }`}
                            >
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 bg-neutral-900">
                                    <img src={playlistImg} alt={playlist.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-body font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{playlist.name}</h4>
                                    <p className="font-pixel text-[10px] text-secondary uppercase tracking-wider">{playlist.tracks?.total || 0} tracks</p>
                                </div>

                                <button 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                                        isCurrentContext && isPlaying
                                            ? 'bg-primary text-[#161e00] border-primary'
                                            : 'bg-transparent text-secondary border-surface-variant group-hover:opacity-100 group-hover:text-primary group-hover:border-primary opacity-0'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {isCurrentContext && isPlaying ? 'pause' : 'play_arrow'}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Up Next (Dynamic Recommendations) */}
            <div className="bg-[#1b1c1c]/40 backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary/10 transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 select-none px-1">
                    <div className="flex items-center gap-2">
                        <p className="font-pixel text-[9px] text-primary font-bold tracking-widest uppercase">UP NEXT // RECOMMENDATIONS</p>
                        {isLoadingRecs && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                    </div>
                    <span className="font-pixel text-[8px] text-secondary tracking-widest uppercase">[UPLINK: ACTIVE]</span>
                </div>

                {/* Skeleton loading */}
                {isLoadingRecs ? (
                    <div className="space-y-2">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                                <div className="w-9 h-9 rounded-md bg-white/5 shrink-0 animate-pulse" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-2.5 rounded bg-white/5 animate-pulse" style={{ width: `${55 + i * 8}%` }} />
                                    <div className="h-2 rounded bg-white/5 animate-pulse" style={{ width: `${30 + i * 5}%` }} />
                                </div>
                                <div className="w-8 h-2 rounded bg-white/5 animate-pulse shrink-0" />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* List with slide-in animation keyed to recsKey */
                    <div key={recsKey} className="space-y-1.5 text-xs select-none">
                        {recommendations.slice(0, 5).map((track, idx) => {
                            const trackTitle = track.name;
                            const artistName = track.artists?.[0]?.name || "Unknown Artist";
                            const albumImg = track.album?.images?.[2]?.url || track.album?.images?.[0]?.url;
                            const isCurrentTrack = currentTrack?.id === track.id;

                            return (
                                <div 
                                    key={track.id}
                                    onClick={() => playTrack(track)}
                                    className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all rec-slide-in ${
                                        isCurrentTrack 
                                            ? 'bg-primary/10 border-l-2 border-primary' 
                                            : 'hover:bg-white/5 border-l-2 border-transparent'
                                    }`}
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                >
                                    {/* Album thumbnail */}
                                    <div className="relative w-9 h-9 rounded-md overflow-hidden shrink-0 bg-white/5">
                                        {albumImg && (
                                            <img src={albumImg} alt={trackTitle} className="w-full h-full object-cover" />
                                        )}
                                        {/* Playing indicator overlay */}
                                        {isCurrentTrack && isPlaying && (
                                            <div className="absolute inset-0 bg-black/50 flex items-end justify-center gap-px pb-1">
                                                {[0.7, 1.0, 0.8].map((h, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 rounded-t-sm bg-primary"
                                                        style={{
                                                            height: `${h * 14}px`,
                                                            animationName: 'sound-wave',
                                                            animationDuration: `${0.5 + i * 0.15}s`,
                                                            animationTimingFunction: 'ease-in-out',
                                                            animationIterationCount: 'infinite',
                                                            animationDirection: 'alternate',
                                                            animationPlayState: 'running',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Track info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`truncate text-[11px] font-semibold leading-tight ${
                                            isCurrentTrack ? 'text-primary' : 'text-zinc-300 group-hover:text-white'
                                        }`}>{trackTitle}</p>
                                        <p className="truncate text-[9px] text-zinc-500 group-hover:text-zinc-400 font-pixel mt-0.5">
                                            {artistName}
                                        </p>
                                    </div>

                                    {/* Duration */}
                                    <span className="font-pixel text-[9px] text-zinc-500 group-hover:text-zinc-400 shrink-0">
                                        {formatTime(track.duration_ms || 240000)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default RightPanel;