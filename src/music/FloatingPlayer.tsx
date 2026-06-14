// src/music/FloatingPlayer.tsx
import React from "react";
import { useMusic } from "./MusicContext";
import { Link } from "react-router-dom";

export const FloatingPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } =
    useMusic();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-40">
      <div className="flex items-center gap-3 bg-zinc-900/95 border border-zinc-700/70 rounded-2xl px-3 py-2 shadow-lg">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="text-xs text-zinc-400 font-mono uppercase tracking-[0.2em]">
            Archivo Sonoro · Real del Monte
          </div>
          <div className="text-sm text-zinc-100 truncate">
            {currentTrack.title}
          </div>
          <div className="text-[11px] text-zinc-400 truncate">
            {currentTrack.artist}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            onClick={prevTrack}
          >
            ◀
          </button>
          <button
            className="text-xs px-2 py-1 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
            onClick={togglePlay}
          >
            {isPlaying ? "Pausa" : "Play"}
          </button>
          <button
            className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            onClick={nextTrack}
          >
            ▶
          </button>
        </div>
        <Link
          to="/archivo-sonoro"
          className="ml-2 text-[10px] text-cyan-300 hover:underline"
        >
          Ver Archivo
        </Link>
      </div>
    </div>
  );
};
