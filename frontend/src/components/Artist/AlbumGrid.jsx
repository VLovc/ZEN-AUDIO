// src/components/Artist/AlbumGrid.jsx
import React from 'react';
import { usePlayer } from '../../context/PlayerContext';

const AlbumGrid = ({ albums }) => {
    const { playTrack } = usePlayer();

    const displayAlbums = (albums && albums.length > 0) ? albums : [
        { id: "mock-a1", name: "Synthetic Dreams", release_date: "2023", total_tracks: 12, images: [{ url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150" }], uri: "spotify:album:37i9dQZF1DXcBWIGsyNa7T" },
        { id: "mock-a2", name: "Core Strata", release_date: "2022", total_tracks: 10, images: [{ url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150" }], uri: "spotify:album:37i9dQZF1DXcBWIGsyNa7T" },
    ];

    return (
        <div className="text-on-surface">
            {/* Header + Nav Buttons */}
            <div className="flex items-center justify-between mb-4 border-b border-dotted border-primary/20 pb-3">
                <h3 className="font-headline text-2xl text-on-surface">Albums</h3>
                <span className="font-label-pixel text-[9px] text-[#ccff00]/60 uppercase">{displayAlbums.length} releases logged</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {displayAlbums.slice(0, 8).map((album) => {
                    const albumYear = album.release_date ? album.release_date.split('-')[0] : 'N/A';
                    const albumImg = album.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";

                    return (
                        <div 
                            key={album.id} 
                            onClick={() => playTrack({ context_uri: album.uri, title: album.name, subtitle: "Spotify Album", imgSrc: albumImg })}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-square rounded-xl bg-surface-container-high overflow-hidden mb-3 shadow-md hover:shadow-lg transition-transform group-hover:scale-[1.02] border border-white/5 hover:border-primary/20 p-1 relative bg-zinc-950">
                                <img
                                    alt={album.name}
                                    className="w-full h-full object-cover rounded-lg"
                                    src={albumImg}
                                />
                                {/* Corner Brackets */}
                                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-primary/40"></div>
                                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-primary/40"></div>
                            </div>
                            <h4 className="font-body-md font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{album.name}</h4>
                            <p className="font-label-pixel text-[9px] text-secondary mt-0.5">{albumYear} • {album.total_tracks} TRACKS</p>
                        </div>
                    );
                })}
            </div>

            {/* Status Footer Line */}
            <div className="mt-8 flex justify-between items-center border-t border-dotted border-outline-variant/30 pt-3">
                <span className="font-label-pixel text-[8px] text-primary/30 uppercase tracking-[0.2em]">Absolute Terror Field: Active</span>
                <span className="font-label-pixel text-[8px] text-primary/30 uppercase tracking-[0.2em]">Uplink_Signal: Lossless_Stereo</span>
            </div>
        </div>
    );
};

export default AlbumGrid;