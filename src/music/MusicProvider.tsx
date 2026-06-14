// src/music/MusicProvider.tsx
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { MusicContext, MusicTrack } from "./MusicContext";

const CURRENT_TRACK_KEY = "rdm-current-track";
const PLAYING_KEY = "rdm-playing";

interface Props {
  children: ReactNode;
}

export const MusicProvider: React.FC<Props> = ({ children }) => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cargar estado desde localStorage
  useEffect(() => {
    const storedId = localStorage.getItem(CURRENT_TRACK_KEY);
    const storedPlaying = localStorage.getItem(PLAYING_KEY) === "true";
    setIsPlaying(storedPlaying);

    // No podemos resolver el track hasta que tengamos la lista desde el backend.
    // Eso se hará en la página ArchivoSonoro.
  }, []);

  // Sincronizar reproducción con audio element
  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentTrack) return;

    audioRef.current.src = currentTrack.audioUrl;
    if (isPlaying) {
      void audioRef.current.play().catch(() => {
        // Autoplay bloqueado, el usuario tendrá que dar play manual
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    localStorage.setItem(CURRENT_TRACK_KEY, track.id);
    localStorage.setItem(PLAYING_KEY, "true");
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying((prev) => {
      const next = !prev;
      localStorage.setItem(PLAYING_KEY, next ? "true" : "false");
      return next;
    });
  };

  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const next = tracks[(idx + 1) % tracks.length];
    playTrack(next);
  };

  const prevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    playTrack(prev);
  };

  const value = {
    tracks,
    currentTrack,
    isPlaying,
    setTracks,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  );
};
