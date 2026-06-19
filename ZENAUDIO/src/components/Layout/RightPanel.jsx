// src/components/Layout/RightPanel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import AnimatedList from '../AnimatedList/AnimatedList';



const MOCK_RECOMMENDATIONS = [
    { id: 'mock-rec1', name: "Welcome Home", artists: [{ name: "Coheed and Cambria" }], duration_ms: 260000 },
    { id: 'mock-rec2', name: "Ten Speed", artists: [{ name: "Coheed and Cambria" }], duration_ms: 226000 },
    { id: 'mock-rec3', name: "Crossing the Frame", artists: [{ name: "Coheed and Cambria" }], duration_ms: 207000 }
];

// Helper to strictly match tracks by ID or URI (No name/artist matching)
const isSameTrack = (t, ct) => {
    if (!t || !ct) return false;
    if (t.id && ct.id && t.id === ct.id) return true;
    if (t.uri && ct.uri && t.uri === ct.uri) return true;
    return false;
};

// Filter out duplicates directly at source using Map
const getUniquePlaylistTracks = (tracks) => {
    if (!tracks || !Array.isArray(tracks)) return [];
    const uniqueMap = new Map();
    for (const track of tracks) {
        if (!track || !track.id) continue;
        if (!uniqueMap.has(track.id)) {
            uniqueMap.set(track.id, track);
        }
    }
    return Array.from(uniqueMap.values());
};

// Helper to deduplicate tracks and filter out history (except the currently playing track)
const sanitizeTracks = (tracks, historyTracks = [], currentTrack = null, isPlaylist = false) => {
    if (!tracks || !Array.isArray(tracks)) return [];

    const uniqueTracks = [];
    const seenMap = new Set();

    // 1. Deduplication based strictly on ID
    for (const track of tracks) {
        if (!track || !track.id) continue;

        if (!seenMap.has(track.id)) {
            seenMap.add(track.id);
            uniqueTracks.push(track);
        }
    }

    // 2. Filter out history for playlists (Source of Truth optimization)
    if (isPlaylist && historyTracks.length > 0) {
        return uniqueTracks.filter(track => {
            // Protect the currently playing track from being removed
            if (currentTrack && isSameTrack(track, currentTrack)) {
                return true;
            }

            // Check if track is strictly in history
            const isInHistory = historyTracks.some(hTrack => isSameTrack(track, hTrack));

            return !isInHistory;
        });
    }

    return uniqueTracks;
};

const RightPanel = () => {
    const { currentTrack, playTrack, isPlaying, sdkPreviousTrack, sdkNextTrack, history, nextTrack: skipNext, previousTrack: skipPrev } = usePlayer();

    const [playlists, setPlaylists] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [recommendedTracks, setRecommendedTracks] = useState([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);
    const [recsKey, setRecsKey] = useState(0); // trigger re-animation
    const lastFetchedContextUriRef = React.useRef(null);

    const hasActiveTrack = currentTrack && currentTrack.id !== null;
    const isPlaylistContext = currentTrack?.context_uri && (currentTrack.context_uri.includes(':playlist:') || currentTrack.context_uri.startsWith('spotify:playlist:'));

    // Fetch playlists & new releases on mount
    useEffect(() => {
        const fetchStaticData = async () => {
            const token = localStorage.getItem('spotify_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            try {
                // 1. Fetch user playlists
                const playlistsRes = await fetch('http://127.0.0.1:5000/api/spotify/playlists/me?limit=15', { headers });
                if (playlistsRes.ok) {
                    const playlistsData = await playlistsRes.json();
                    if (playlistsData.items && playlistsData.items.length > 0) {
                        setPlaylists(playlistsData.items);
                        return;
                    }
                }

                // 2. Fallback to featured playlists if /playlists/me fails (e.g., 401 unauthenticated or expired) or empty
                // IMPORTANT: Do NOT send the user token (headers) here. If the user token is expired, sending it will cause this endpoint to fail too.
                // Omitting headers forces the backend to use its own server-to-server Client Credentials token which is always valid.
                const featuredRes = await fetch('http://127.0.0.1:5000/api/spotify/featured-playlists?limit=15');
                if (featuredRes.ok) {
                    const featuredData = await featuredRes.json();
                    if (featuredData.playlists && featuredData.playlists.items) {
                        setPlaylists(featuredData.playlists.items.filter(item => item !== null));
                    } else {
                        setPlaylists([]);
                    }
                } else {
                    setPlaylists([]);
                }
            } catch (err) {
                console.warn("Failed to fetch playlists:", err);
                setPlaylists([]);
            }
        };

        fetchStaticData();
    }, []);

    // Fetch recommendations or playlist tracks dynamically when currentTrack or context changes
    useEffect(() => {
        const fetchUpNext = async () => {
            const token = localStorage.getItem('spotify_token');
            if (!token || !currentTrack || !currentTrack.id) return;

            const contextUri = currentTrack?.context_uri;

            if (isPlaylistContext) {
                // 1. Fetch Playlist Tracks if context is a playlist
                if (lastFetchedContextUriRef.current === contextUri) {
                    return; // Already fetched for this context
                }

                setIsLoadingRecs(true);
                try {
                    const parts = contextUri.split(':');
                    const playlistId = parts[parts.indexOf('playlist') + 1];

                    const res = await fetch(`http://127.0.0.1:5000/api/spotify/playlists/${playlistId}/tracks?limit=100`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.items && data.items.length > 0) {
                            const rawTracks = data.items.map(item => item.track).filter(Boolean);
                            const uniqueTracks = getUniquePlaylistTracks(rawTracks);
                            setPlaylistTracks(uniqueTracks);
                            lastFetchedContextUriRef.current = contextUri;
                            setRecsKey(k => k + 1);
                        }
                    }
                } catch (err) {
                    console.warn("Failed to fetch playlist tracks:", err);
                } finally {
                    setIsLoadingRecs(false);
                }
            } else {
                // 2. Fetch Recommendations if NO playlist context
                lastFetchedContextUriRef.current = null; // Clear context ref
                setIsLoadingRecs(true);
                try {
                    let tracksFetched = [];
                    const seedParam = currentTrack?.id
                        ? `seed_tracks=${currentTrack.id}`
                        : `seed_genres=electronic,rock,chill`;

                    const res = await fetch(`http://127.0.0.1:5000/api/spotify/recommendations?${seedParam}&limit=5`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.tracks && data.tracks.length > 0) {
                            tracksFetched = data.tracks;
                        }
                    }

                    // Fallback: search tracks by the current track's artist if recommendations/playlist API failed
                    if (tracksFetched.length === 0 && currentTrack?.subtitle && currentTrack.subtitle !== 'Select a song') {
                        const artist = currentTrack.subtitle.split(',')[0].trim();
                        const searchRes = await fetch(`http://127.0.0.1:5000/api/spotify/search?q=artist:${encodeURIComponent(artist)}&type=track&limit=5`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (searchRes.ok) {
                            const searchData = await searchRes.json();
                            if (searchData.tracks && searchData.tracks.items && searchData.tracks.items.length > 0) {
                                tracksFetched = searchData.tracks.items;
                            }
                        }
                    }

                    // Final fallback if Spotify APIs fail (e.g. 403 or 404)
                    if (tracksFetched.length === 0) {
                        tracksFetched = MOCK_RECOMMENDATIONS;
                    }

                    setRecommendedTracks(tracksFetched);
                    setRecsKey(k => k + 1);
                } catch (err) {
                    console.warn("Failed to fetch Up Next / Recommendations:", err);
                    setRecommendedTracks(MOCK_RECOMMENDATIONS);
                } finally {
                    setIsLoadingRecs(false);
                }
            }
        };

        fetchUpNext();
    }, [currentTrack?.id, currentTrack?.context_uri, isPlaylistContext]);

    // useMemo for deterministic navigation calculation
    const { prevTrack, nextTrack, activeTracks, activeIndex } = useMemo(() => {
        let pTrack = null;
        let nTrack = null;
        let currentIdx = -1;
        let activeList = [];

        if (isPlaylistContext) {
            activeList = sanitizeTracks(playlistTracks, history, currentTrack, true);
            currentIdx = activeList.findIndex(t => isSameTrack(t, currentTrack));

            if (currentIdx > 0) {
                // Find first prior track that is NOT a duplicate
                for (let i = currentIdx - 1; i >= 0; i--) {
                    if (!isSameTrack(activeList[i], currentTrack)) {
                        pTrack = activeList[i];
                        break;
                    }
                }
            } else if (currentIdx === -1) {
                pTrack = sdkPreviousTrack;
                if (!pTrack && history && history.length > 1) {
                    for (let i = history.length - 2; i >= 0; i--) {
                        if (!isSameTrack(history[i], currentTrack)) {
                            pTrack = history[i];
                            break;
                        }
                    }
                }
            }
            if (isSameTrack(pTrack, currentTrack)) pTrack = null;

            if (currentIdx !== -1) {
                // Find first subsequent track that is NOT a duplicate
                for (let i = currentIdx + 1; i < activeList.length; i++) {
                    if (!isSameTrack(activeList[i], currentTrack)) {
                        nTrack = activeList[i];
                        break;
                    }
                }
            } else {
                nTrack = sdkNextTrack;
                if (!nTrack && activeList.length > 0 && currentTrack?.id) {
                    nTrack = activeList.find(t => !isSameTrack(t, currentTrack));
                }
            }
            if (isSameTrack(nTrack, currentTrack)) nTrack = null;

        } else {
            // Not in a playlist context: Use SDK tracking or recommendations fallback
            activeList = sanitizeTracks(recommendedTracks, history, currentTrack, false);

            // Previous falls back to SDK/History since recommendations is purely forward-looking
            pTrack = sdkPreviousTrack;
            if (!pTrack && history && history.length > 1) {
                for (let i = history.length - 2; i >= 0; i--) {
                    if (!isSameTrack(history[i], currentTrack)) {
                        pTrack = history[i];
                        break;
                    }
                }
            }
            if (isSameTrack(pTrack, currentTrack)) pTrack = null;

            // Next falls back to SDK or first valid recommendation
            nTrack = sdkNextTrack;
            if (!nTrack && activeList.length > 0 && currentTrack?.id) {
                nTrack = activeList.find(t => !isSameTrack(t, currentTrack));
            }
            if (isSameTrack(nTrack, currentTrack)) nTrack = null;
        }

        return { prevTrack: pTrack, nextTrack: nTrack, activeTracks: activeList, activeIndex: currentIdx };
    }, [currentTrack, playlistTracks, recommendedTracks, isPlaylistContext, history, sdkPreviousTrack, sdkNextTrack]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <section className="lg:col-span-5 space-y-8 text-on-surface">
            {/* 1.5. Previous & Next Track Grid */}
            {hasActiveTrack && (prevTrack || nextTrack) && (
                <div>
                    <div className="flex justify-between items-end mb-4 select-none">
                        <h3 className="font-headline text-xl font-bold text-on-surface">Previous Track</h3>
                        <span className="font-label-pixel text-[9px] text-[#ccff00]/60 uppercase">Playback Queue</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Previous Track - Ambient Design */}
                        {prevTrack && (
                            <div
                                onClick={skipPrev}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/5 ${!nextTrack ? 'col-span-2 aspect-[2.5/1]' : 'col-span-1 aspect-square'}`}
                            >
                                {/* Ambient Blurred Background Image */}
                                <div className="absolute inset-0 z-0 bg-neutral-900">
                                    <img
                                        src={prevTrack.imgSrc || prevTrack.album?.images?.[0]?.url || './img/music.png'}
                                        alt=""
                                        className="w-full h-full object-cover opacity-60 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                                    />
                                    {/* Vignette & Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#121212] opacity-90 group-hover:opacity-80 transition-opacity duration-700"></div>
                                </div>

                                {/* Minimalist Content */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-between p-4">
                                    <span className="font-pixel text-[8px] text-white/50 tracking-[0.2em] uppercase drop-shadow-md">Previous</span>
                                    
                                    <div className="flex justify-between items-end">
                                        <div className="min-w-0 flex-1 pr-3">
                                            <h4 className="font-body font-bold text-[13px] text-white truncate drop-shadow-lg group-hover:text-primary transition-colors">
                                                {prevTrack.title || prevTrack.name}
                                            </h4>
                                            <p className="font-pixel text-[9px] text-white/70 truncate mt-1.5 drop-shadow-md">
                                                {prevTrack.subtitle || prevTrack.artists?.[0]?.name}
                                            </p>
                                        </div>
                                        {/* Subtle Playback Icon */}
                                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0 transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>fast_rewind</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next Track - Ambient Design */}
                        {nextTrack && (
                            <div
                                onClick={skipNext}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/5 ${!prevTrack ? 'col-span-2 aspect-[2.5/1]' : 'col-span-1 aspect-square'}`}
                            >
                                {/* Ambient Blurred Background Image */}
                                <div className="absolute inset-0 z-0 bg-neutral-900">
                                    <img
                                        src={nextTrack.imgSrc || nextTrack.album?.images?.[0]?.url || './img/music.png'}
                                        alt=""
                                        className="w-full h-full object-cover opacity-60 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                                    />
                                    {/* Vignette & Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#121212] opacity-90 group-hover:opacity-80 transition-opacity duration-700"></div>
                                </div>

                                {/* Minimalist Content */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-between p-4">
                                    <span className="font-pixel text-[8px] text-white/50 tracking-[0.2em] uppercase text-right drop-shadow-md">Up Next</span>
                                    
                                    <div className="flex justify-between items-end">
                                        {/* Subtle Playback Icon */}
                                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0 transform opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>fast_forward</span>
                                        </div>
                                        <div className="min-w-0 flex-1 pl-3 text-right">
                                            <h4 className="font-body font-bold text-[13px] text-white truncate drop-shadow-lg group-hover:text-primary transition-colors">
                                                {nextTrack.title || nextTrack.name}
                                            </h4>
                                            <p className="font-pixel text-[9px] text-white/70 truncate mt-1.5 drop-shadow-md">
                                                {nextTrack.subtitle || nextTrack.artists?.[0]?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 2. Favorite Playlists */}
            <div>
                <div className="flex justify-between items-end mb-4 select-none">
                    <h3 className="font-headline text-xl font-bold text-on-surface">Favorite Playlists</h3>
                    <span className="font-label-pixel text-[9px] text-[#ccff00]/60 uppercase">{playlists.length} playlists found</span>
                </div>

                <AnimatedList
                    items={playlists}
                    className="custom-scrollbar pr-1.5"
                    showGradients={false}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                    onItemSelect={(playlist) => {
                        const playlistImg = playlist.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                        playTrack({ context_uri: playlist.uri, title: playlist.name, subtitle: "Spotify Playlist", imgSrc: playlistImg });
                    }}
                    renderItem={(playlist, isSelected) => {
                        const playlistImg = playlist.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                        const isCurrentContext = currentTrack?.context_uri === playlist.uri;

                        return (
                            <div
                                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all group cursor-pointer border ${isCurrentContext
                                    ? 'bg-surface-container-high border-primary/40 shadow-[0_0_12px_rgba(204,255,0,0.05)]'
                                    : 'bg-surface-container-low border-transparent hover:bg-surface-container hover:border-primary/20'
                                    } ${isSelected ? 'ring-1 ring-primary/50' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 bg-neutral-900">
                                    <img src={playlistImg} alt={playlist.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-body font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{playlist.name}</h4>
                                    <p className="font-pixel text-[10px] text-secondary uppercase tracking-wider">
                                        {typeof playlist.tracks === 'number'
                                            ? `${playlist.tracks} tracks`
                                            : Array.isArray(playlist.tracks)
                                                ? `${playlist.tracks.length} tracks`
                                                : typeof playlist.tracks?.total === 'number'
                                                    ? `${playlist.tracks.total} tracks`
                                                    : 'Spotify Playlist'}
                                    </p>
                                </div>

                                <button
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${isCurrentContext && isPlaying
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
                    }}
                />
            </div>


        </section>
    );
};

export default RightPanel;