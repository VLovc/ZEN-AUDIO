import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistList = () => {
    const navigate = useNavigate();

    // Giả lập dữ liệu nghệ sĩ
    const artists = [
        { id: 'echo-voyager', name: 'ECHO VOYAGER', avatar: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150' },
        { id: 'ozone-bender', name: 'OZONE BENDER', avatar: 'https://images.unsplash.com/photo-1571330735066-03aaa9330d80?q=80&w=150' },
    ];

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-8">Artists</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {artists.map(artist => (
                    <div
                        key={artist.id}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        className="cursor-pointer bg-surface-container p-4 rounded-xl hover:bg-surface-variant transition-all"
                    >
                        <img src={artist.avatar} alt={artist.name} className="w-full aspect-square object-cover rounded-lg mb-4" />
                        <h3 className="font-bold">{artist.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistList;