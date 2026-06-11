// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';

import Sidebar from './components/Layout/Sidebar';
import MainContent from './components/Layout/MainContent';
import RightPanel from './components/Layout/RightPanel';
import PlayerBarStudio from './components/Layout/PlayerBarStudio';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import LibraryMain from './components/Library/LibraryMain';
import SearchMain from './components/Search/SearchMain';
import StudioPage from './components/Studio/StudioPage';
import ArtistPage from './components/Artist/ArtistPage';
import ArtistList from './components/Artist/ArtistList'; // 🌟 ĐÃ THÊM
import Callback from './components/Callback';

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import PageTransition from './components/Layout/PageTransition';

// 🎵 1. GIAO DIỆN CỦA TRANG CHỦ NGHE NHẠC (Dashboard Layout)
const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = usePlayer();
  const userAvatar = userProfile?.images?.[0]?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150";
  const displayName = userProfile?.display_name || "User";

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  return (
    <>
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
            <span className="font-pixel text-[10px] text-primary tracking-wider uppercase hidden sm:block">{displayName}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ccff00] shadow-sm shadow-[#ccff00]/10">
              <img alt={displayName} className="w-full h-full object-cover" src={userAvatar} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <MainContent />
          <RightPanel />
        </div>
      </main>
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/search" element={<PageTransition><SearchMain /></PageTransition>} />
        <Route path="/artist" element={<PageTransition><ArtistPage /></PageTransition>} />
        <Route path="/studio" element={<PageTransition><StudioPage /></PageTransition>} />
        <Route path="/library" element={<PageTransition><LibraryMain /></PageTransition>} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/callback" element={<Callback />} />
          
          {/* Main Layout Wraps Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/*" element={<AnimatedRoutes />} />
          </Route>
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;