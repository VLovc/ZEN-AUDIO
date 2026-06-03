// src/hooks/useAudioVisualizer.js
// Generates pseudo-realistic frequency data driven by isPlaying + currentTime.
// Since Spotify's DRM stream is not accessible via Web Audio API, we simulate
// a multi-band EQ that evolves smoothly in time while the track plays.
import { useState, useEffect, useRef } from 'react';

const NUM_BANDS = 24;
const BASE_HEIGHTS = [
  0.4, 0.55, 0.7, 0.85, 0.9, 0.8, 0.65, 0.75,
  0.6, 0.5, 0.7, 0.85, 0.95, 0.8, 0.6, 0.5,
  0.65, 0.75, 0.8, 0.7, 0.55, 0.45, 0.35, 0.25
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function useAudioVisualizer(isPlaying, currentTime) {
  const [bands, setBands] = useState(() => Array(NUM_BANDS).fill(0.1));
  const targetRef = useRef(Array(NUM_BANDS).fill(0.1));
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!isPlaying) {
      // Smoothly decay bars to near-zero when paused
      const decay = () => {
        setBands(prev => {
          const next = prev.map(v => Math.max(0.04, v * 0.85));
          if (next.some(v => v > 0.05)) {
            animFrameRef.current = requestAnimationFrame(decay);
          }
          return next;
        });
      };
      animFrameRef.current = requestAnimationFrame(decay);
      return () => cancelAnimationFrame(animFrameRef.current);
    }

    // Randomise targets every ~120ms
    const targetInterval = setInterval(() => {
      const phase = (currentTime % 8) / 8; // 0-1 cycle
      targetRef.current = BASE_HEIGHTS.map((base, i) => {
        const wave = Math.sin(phase * Math.PI * 2 + i * 0.5) * 0.25;
        const noise = (Math.random() - 0.5) * 0.35;
        return Math.min(1, Math.max(0.06, base + wave + noise));
      });
    }, 120);

    // Smooth interpolation on every animation frame
    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      const speed = 8; // lerp speed

      setBands(prev =>
        prev.map((v, i) => lerp(v, targetRef.current[i], Math.min(1, speed * dt)))
      );
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(targetInterval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentTime]);

  return bands;
}
