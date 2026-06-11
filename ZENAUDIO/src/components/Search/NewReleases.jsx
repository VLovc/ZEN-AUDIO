import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionVariants, UI } from '../../theme';

const NewReleases = ({ onPlayTrack }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopAlbums = async () => {
            const spotifyToken = localStorage.getItem('spotify_token');
            if (!spotifyToken) {
                setLoading(false);
                return;
            }

            try {
                // Sử dụng API Search của Spotify thay vì browse/new-releases
                const res = await fetch(`http://127.0.0.1:5000/api/spotify/search?q=${encodeURIComponent('V-Pop')}&type=album&limit=5`, {
                    headers: { 'Authorization': `Bearer ${spotifyToken}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.albums && data.albums.items && data.albums.items.length > 0) {
                        setAlbums(data.albums.items);
                        return;
                    } else {
                        console.warn("Không tìm thấy dữ liệu album trả về từ Spotify.");
                    }
                } else {
                    console.error("Lỗi HTTP khi gọi API Spotify:", res.status);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách Top Album:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopAlbums();
    }, []);

    const handlePlayAlbum = (album) => {
        if (onPlayTrack) {
            onPlayTrack({
                context_uri: album.uri,
                title: album.name,
                subtitle: album.artists[0]?.name,
                imgSrc: album.images[0]?.url
            });
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="w-full aspect-square bg-surface-variant/20 rounded-xl animate-pulse"></div>
                        <div className="h-4 bg-surface-variant/20 w-3/4 rounded animate-pulse"></div>
                        <div className="h-3 bg-surface-variant/20 w-1/2 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!loading && albums.length === 0) {
        return (
            <div className="col-span-full flex justify-center items-center h-32 border border-surface-variant/20 rounded-xl bg-surface-container/50">
                <span className="font-pixel text-xs text-secondary opacity-70 uppercase tracking-widest">
                    [Không tìm thấy dữ liệu]
                </span>
            </div>
        );
    }

    return (
        <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[250px]"
            variants={motionVariants.listContainer}
            initial="hidden"
            animate="visible"
        >
            {albums.map((album) => {
                const imgSrc = album.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150";
                
                return (
                    <motion.div 
                        key={album.id}
                        variants={motionVariants.listItem}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handlePlayAlbum(album)}
                        className="group bg-surface-container hover:bg-surface-container-high border border-surface-variant/20 hover:border-primary/30 rounded-xl p-4 transition-colors duration-300 hover:shadow-[0_4px_20px_rgba(204,255,0,0.1)] cursor-pointer flex flex-col relative"
                    >
                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 relative shadow-md">
                            <img 
                                src={imgSrc} 
                                alt={album.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            {/* Nút Play hiển thị khi hover */}
                            <div className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            </div>
                        </div>
                        
                        <h3 className="font-headline font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                            {album.name}
                        </h3>
                        <p className="font-body text-xs text-secondary mt-1 truncate">
                            {album.artists?.map(a => a.name).join(', ')}
                        </p>
                        
                        {/* Tag Release Type */}
                        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[#ccff00] font-label-pixel text-[8px] uppercase px-1.5 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            {album.album_type}
                        </span>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default NewReleases;
