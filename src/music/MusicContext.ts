// src/music/MusicContext.ts
import { createContext, useContext } from "react";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  description?: string | null;
  coverUrl: string;
  audioUrl: string;
  active: boolean;
  createdAt?: string;
}

export interface MusicContextValue {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  setTracks: (tracks: MusicTrack[]) => void;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

export const MusicContext = createContext<MusicContextValue | undefined>(
  undefined,
);

export const useMusic = (): MusicContextValue => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
};
