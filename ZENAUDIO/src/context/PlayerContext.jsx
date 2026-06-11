// src/context/PlayerContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const PlayerContext = createContext(null);

const DEFAULT_TRACK = {
  id: null,
  title: 'No song playing',
  subtitle: 'Select a song',
  imgSrc: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150',
  src: null,
  uri: null,
  duration: 0,
  album: 'Unknown Album'
};

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('zen_volume');
    return saved !== null ? parseFloat(saved) : 0.5;
  });
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [sdkPreviousTrack, setSdkPreviousTrack] = useState(null);
  const [sdkNextTrack, setSdkNextTrack] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'context', 'track'

  // Track history of loaded tracks
  useEffect(() => {
    if (currentTrack && currentTrack.id) {
      setHistory(prev => {
        // Avoid adding duplicate entries consecutively
        if (prev.length > 0 && prev[prev.length - 1].id === currentTrack.id) {
          return prev;
        }
        return [...prev.slice(-9), currentTrack];
      });
    }
  }, [currentTrack?.id]);

  // References
  const audioRef = useRef(new Audio());
  const playerRef = useRef(null); // Spotify Player Instance
  const lastRequestedTrackRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isSpotifyActive, setIsSpotifyActive] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const spotifyToken = localStorage.getItem('spotify_token');
      if (spotifyToken) {
        try {
          const res = await fetch('http://127.0.0.1:5000/api/spotify/me', {
            headers: { 'Authorization': `Bearer ${spotifyToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          }
        } catch (err) {
          console.warn("Failed to fetch user profile:", err);
        }
      }
    };
    fetchUserProfile();
  }, []);

  // Auto token refresh every minute
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const expiresAt = localStorage.getItem('expires_at');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (expiresAt && refreshToken) {
        const threshold = Date.now() + 5 * 60 * 1000; // 5 minutes before expiration
        
        if (threshold >= parseInt(expiresAt)) {
          console.log("Spotify token expiring soon, automatically refreshing...");
          try {
            const res = await fetch(`http://127.0.0.1:5000/api/auth/refresh_token?refresh_token=${refreshToken}`);
            if (res.ok) {
              const data = await res.json();
              if (data.access_token) {
                localStorage.setItem('spotify_token', data.access_token);
                if (data.expires_in) {
                   localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000);
                }
                if (data.refresh_token) {
                   localStorage.setItem('refresh_token', data.refresh_token);
                }
                console.log("Token refreshed successfully!");
              }
            } else {
               console.warn("Failed to refresh token", res.status);
            }
          } catch (err) {
            console.error("Error refreshing token", err);
          }
        }
      }
    }, 60 * 1000); // Check every 60 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Helper to play HTML5 Preview
  const playHtml5Preview = useCallback((track) => {
    const previewUrl = track.preview_url || track.src;
    if (previewUrl) {
      setIsSpotifyActive(false);
      
      // Pause Spotify SDK playback
      if (playerRef.current) {
        playerRef.current.pause().catch(() => {});
      }

      setCurrentTrack({
        id: track.id,
        title: track.name || track.title || 'Unknown Track',
        subtitle: track.artist || track.subtitle || (track.artists && track.artists[0]?.name) || 'Unknown Artist',
        imgSrc: track.image || track.imgSrc || (track.album && track.album.images && track.album.images[0]?.url) || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150',
        src: previewUrl,
        uri: track.uri,
        album: track.album?.name || track.album || 'Unknown Album',
        artistId: track.artists?.[0]?.id || track.artistId || null,
        context_uri: track.context_uri || null
      });

      audioRef.current.src = previewUrl;
      setIsPlaying(true);
      audioRef.current.play().catch(console.error);
    } else {
      console.warn("No playable preview URL available for this track.");
    }
  }, []);

  // Time tracker interval for Spotify SDK
  const spotifyProgressIntervalRef = useRef(null);

  // 1. Setup local HTML5 Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isSpotifyActive) {
        setCurrentTime(audio.currentTime);
        setProgress(audio.duration ? (audio.currentTime / audio.duration) : 0);
      }
    };

    const handleLoadedMetadata = () => {
      if (!isSpotifyActive) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (!isSpotifyActive) {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isSpotifyActive]);

  // 2. Load Spotify Web Playback SDK
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    const initializePlayer = () => {
      if (playerRef.current) return; // Prevent duplicate initialization

      const player = new window.Spotify.Player({
        name: 'Zen Audio Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: volume
      });

      player.addListener('initialization_error', ({ message }) => { console.error('Spotify SDK Init Error:', message); });
      player.addListener('authentication_error', ({ message }) => { console.error('Spotify SDK Auth Error:', message); });
      player.addListener('account_error', ({ message }) => { 
        console.warn('Spotify SDK Account Error (likely Free account):', message); 
      });
      player.addListener('playback_error', ({ message }) => { 
        console.error('Spotify SDK Playback Error:', message); 
        // DRM / playback fallback: if playback fails, play the preview
        if (lastRequestedTrackRef.current) {
          console.warn("Spotify DRM playback failed. Falling back to HTML5 preview...");
          playHtml5Preview(lastRequestedTrackRef.current);
        }
      });

      player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID:', device_id);
        setDeviceId(device_id);
        
        // Transfer playback to our Web Player device so it becomes the active output
        try {
          await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              device_ids: [device_id],
              play: false
            })
          });
          console.log('Playback successfully transferred to Zen Audio Web Player');
        } catch (err) {
          console.warn('Could not transfer playback automatically:', err);
        }
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline:', device_id);
        setDeviceId(null);
      });

      player.addListener('player_state_changed', state => {
        if (!state) return;

        const currentTrackFromSDK = state.track_window.current_track;
        if (currentTrackFromSDK) {
          setIsSpotifyActive(true);
          setCurrentTrack(prev => ({
            id: currentTrackFromSDK.id,
            title: currentTrackFromSDK.name,
            subtitle: currentTrackFromSDK.artists.map(a => a.name).join(', '),
            imgSrc: currentTrackFromSDK.album.images[0]?.url || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150',
            uri: currentTrackFromSDK.uri,
            src: null,
            album: currentTrackFromSDK.album.name || 'Unknown Album',
            artistId: currentTrackFromSDK.artists[0]?.id || null,
            context_uri: state.context?.uri || lastRequestedTrackRef.current?.context_uri || prev.context_uri || null
          }));
          setIsPlaying(!state.paused);
          setDuration(state.duration / 1000);
          setCurrentTime(state.position / 1000);
          setProgress(state.duration ? (state.position / state.duration) : 0);

          // Get previous and next tracks from the track window
          const prevTrackSDK = state.track_window.previous_tracks?.[state.track_window.previous_tracks.length - 1];
          const nextTrackSDK = state.track_window.next_tracks?.[0];

          if (prevTrackSDK) {
            setSdkPreviousTrack({
              id: prevTrackSDK.id,
              title: prevTrackSDK.name,
              subtitle: prevTrackSDK.artists.map(a => a.name).join(', '),
              imgSrc: prevTrackSDK.album.images[0]?.url || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150',
              uri: prevTrackSDK.uri,
              album: prevTrackSDK.album.name || 'Unknown Album'
            });
          } else {
            setSdkPreviousTrack(null);
          }

          if (nextTrackSDK) {
            setSdkNextTrack({
              id: nextTrackSDK.id,
              title: nextTrackSDK.name,
              subtitle: nextTrackSDK.artists.map(a => a.name).join(', '),
              imgSrc: nextTrackSDK.album.images[0]?.url || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150',
              uri: nextTrackSDK.uri,
              album: nextTrackSDK.album.name || 'Unknown Album'
            });
          } else {
            setSdkNextTrack(null);
          }
        }
      });

      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });

      playerRef.current = player;
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
      
      // Load Spotify SDK Script
      const scriptId = 'spotify-web-player-sdk';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, []);

  // 3. Keep progress updated smoothly for Spotify SDK
  useEffect(() => {
    if (isSpotifyActive && isPlaying) {
      spotifyProgressIntervalRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const nextTime = prevTime + 0.5;
          if (duration && nextTime >= duration) {
            clearInterval(spotifyProgressIntervalRef.current);
            return duration;
          }
          setProgress(duration ? (nextTime / duration) : 0);
          return nextTime;
        });
      }, 500);
    } else {
      if (spotifyProgressIntervalRef.current) {
        clearInterval(spotifyProgressIntervalRef.current);
      }
    }

    return () => {
      if (spotifyProgressIntervalRef.current) {
        clearInterval(spotifyProgressIntervalRef.current);
      }
    };
  }, [isSpotifyActive, isPlaying, duration]);

  // 4. Play track action
  const playTrack = useCallback(async (track) => {
    const spotifyToken = localStorage.getItem('spotify_token');
    
    // Always preserve context to prevent Spotify from escaping the current playlist
    const activeContext = track.context_uri !== undefined ? track.context_uri : currentTrack?.context_uri;
    
    // Cache last requested track for fallback
    lastRequestedTrackRef.current = { ...track, context_uri: activeContext };

    // Check if it is a Spotify track and we have the Web Player active
    if (deviceId && spotifyToken && (track.uri || track.id || activeContext)) {
      try {
        // Pause local HTML5 audio
        audioRef.current.pause();

        const requestBody = (activeContext && (track.uri || track.id))
          ? { 
              context_uri: activeContext, 
              offset: { uri: track.uri || `spotify:track:${track.id}` }
            }
          : activeContext
            ? { context_uri: activeContext }
            : { uris: [track.uri || `spotify:track:${track.id}`] };
        
        // Call backend proxy player play
        const res = await fetch(`http://127.0.0.1:5000/api/spotify/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${spotifyToken}`
          },
          body: JSON.stringify(requestBody)
        });

        if (res.ok) {
          setIsSpotifyActive(true);
          setIsPlaying(true);
          // Spotify player state change listener will update track metadata
          return;
        } else {
          console.warn("Failed to play via Spotify SDK. Falling back to preview...");
        }
      } catch (err) {
        console.error("Error playing via Spotify SDK proxy:", err);
      }
    }

    // Fallback: Play preview using HTML5 Audio
    playHtml5Preview(track);
  }, [deviceId, playHtml5Preview]);

  // 5. Toggle Play Action
  const togglePlay = useCallback(() => {
    if (isSpotifyActive && playerRef.current) {
      playerRef.current.togglePlay().then(() => {
        setIsPlaying(prev => !prev);
      }).catch(console.error);
    } else {
      const audio = audioRef.current;
      if (!audio.src) return;
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      setIsPlaying(prev => !prev);
    }
  }, [isPlaying, isSpotifyActive]);

  // 6. Seek action
  const seek = useCallback((ratio) => {
    if (isSpotifyActive && playerRef.current && duration) {
      const positionMs = ratio * duration * 1000;
      playerRef.current.seek(positionMs).then(() => {
        setCurrentTime(positionMs / 1000);
        setProgress(ratio);
      }).catch(console.error);
    } else {
      const audio = audioRef.current;
      if (!audio.duration) return;
      const time = ratio * audio.duration;
      audio.currentTime = time;
      setCurrentTime(time);
      setProgress(ratio);
    }
  }, [isSpotifyActive, duration]);

  // 7. Volume action
  const changeVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    localStorage.setItem('zen_volume', clamped);
    
    if (playerRef.current) {
      playerRef.current.setVolume(clamped).catch(console.error);
    }
    
    audioRef.current.volume = clamped;
  }, []);

  // 8. Next track action
  const nextTrack = useCallback(async () => {
    const spotifyToken = localStorage.getItem('spotify_token');
    if (isSpotifyActive && playerRef.current) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/spotify/player/next${deviceId ? `?device_id=${deviceId}` : ''}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${spotifyToken}`
          }
        });
        if (!res.ok) {
          console.error("Failed to skip next");
        }
      } catch (err) {
        console.error("Error skipping next:", err);
      }
    } else {
      console.warn("Skip next is only supported for active Spotify Premium sessions.");
    }
  }, [isSpotifyActive, deviceId]);

  // 9. Previous track action
  const previousTrack = useCallback(async () => {
    const spotifyToken = localStorage.getItem('spotify_token');
    if (isSpotifyActive && playerRef.current) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/spotify/player/previous${deviceId ? `?device_id=${deviceId}` : ''}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${spotifyToken}`
          }
        });
        if (!res.ok) {
          console.error("Failed to skip previous");
        }
      } catch (err) {
        console.error("Error skipping previous:", err);
      }
    } else {
      console.warn("Skip previous is only supported for active Spotify Premium sessions.");
    }
  }, [isSpotifyActive, deviceId]);

  // 9a. Toggle Shuffle action
  const toggleShuffle = useCallback(async () => {
    const spotifyToken = localStorage.getItem('spotify_token');
    if (isSpotifyActive && playerRef.current) {
      const newState = !isShuffle;
      try {
        const res = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${newState}${deviceId ? `&device_id=${deviceId}` : ''}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${spotifyToken}` }
        });
        if (res.ok || res.status === 204) {
          setIsShuffle(newState);
        } else {
          console.error("Failed to toggle shuffle");
        }
      } catch (err) { console.error("Error toggling shuffle:", err); }
    }
  }, [isSpotifyActive, isShuffle, deviceId]);

  // 9b. Toggle Repeat action
  const toggleRepeat = useCallback(async () => {
    const spotifyToken = localStorage.getItem('spotify_token');
    if (isSpotifyActive && playerRef.current) {
      const nextMode = repeatMode === 'off' ? 'context' : repeatMode === 'context' ? 'track' : 'off';
      try {
        const res = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextMode}${deviceId ? `&device_id=${deviceId}` : ''}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${spotifyToken}` }
        });
        if (res.ok || res.status === 204) {
          setRepeatMode(nextMode);
        } else {
          console.error("Failed to toggle repeat");
        }
      } catch (err) { console.error("Error toggling repeat:", err); }
    }
  }, [isSpotifyActive, repeatMode, deviceId]);

  // 9b. Global Logout
  const logout = useCallback(() => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    setUserProfile(null);
    setCurrentTrack(DEFAULT_TRACK);
    setIsPlaying(false);
    setIsSpotifyActive(false);
    setSdkPreviousTrack(null);
    setSdkNextTrack(null);
    setHistory([]);
    if (playerRef.current) {
      playerRef.current.disconnect();
      playerRef.current = null;
    }
  }, []);

  // 10. Load initial playback state or fallback track on mount
  useEffect(() => {
    const initializePlaybackState = async () => {
      const spotifyToken = localStorage.getItem('spotify_token');
      const DEFAULT_TRACK_ID = "3n3Ppam7vgaVa1iaQUc9Lp";
      
      if (spotifyToken) {
        try {
          const stateRes = await fetch('http://127.0.0.1:5000/api/spotify/player/state', {
            headers: { 'Authorization': `Bearer ${spotifyToken}` }
          });
          if (stateRes.ok) {
            const stateData = await stateRes.json();
            if (stateData && stateData.item) {
              const item = stateData.item;
              setIsSpotifyActive(true);
              setCurrentTrack({
                id: item.id,
                title: item.name,
                subtitle: item.artists.map(a => a.name).join(', '),
                imgSrc: item.album?.images[0]?.url || 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=150',
                uri: item.uri,
                src: null,
                album: item.album?.name || 'Unknown Album',
                artistId: item.artists?.[0]?.id || null,
                context_uri: stateData.context?.uri || null
              });
              setIsPlaying(stateData.is_playing);
              setDuration(item.duration_ms / 1000);
              setIsShuffle(stateData.shuffle_state || false);
              setRepeatMode(stateData.repeat_state || 'off');
              setCurrentTime(stateData.progress_ms / 1000);
              setProgress(item.duration_ms ? (stateData.progress_ms / item.duration_ms) : 0);
              return;
            }
          }
        } catch (err) {
          console.warn("Failed to fetch initial player state:", err);
        }
      }
    };

    initializePlaybackState();
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    progress,
    currentTime,
    duration,
    playTrack,
    togglePlay,
    seek,
    changeVolume,
    nextTrack,
    previousTrack,
    userProfile,
    logout,
    sdkPreviousTrack,
    sdkNextTrack,
    history,
    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
};

export default PlayerContext;