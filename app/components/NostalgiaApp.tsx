'use client';

import { useState } from 'react';
import { PLAYLISTS } from '../data/playlists';
import { TopNav } from './TopNav';
import { Player } from './Player';

export function NostalgiaApp() {
  const [currentPlaylistId, setCurrentPlaylistId] = useState(PLAYLISTS[0].id);

  const handleSelectPlaylist = (id: string) => {
    setCurrentPlaylistId(id);
  };

  return (
    <>
      {/* Fixed Top Row: Clock, Listener Count, Station Selector */}
      <TopNav
        playlists={PLAYLISTS}
        currentPlaylistId={currentPlaylistId}
        onSelectPlaylist={handleSelectPlaylist}
      />

      {/* Middle Decorative / Nostalgia Ambient Shop Banner */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-4 my-auto pointer-events-none select-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md mb-3 shadow-lg">
          <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
            ESTD. 1984 • PANBAZAR, GUWAHATI-1
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-2xl font-serif">
          স্বৰলিপি সংগীত ভৱন
        </h1>
        <p className="mt-1 text-sm sm:text-base text-amber-100/80 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Swaralipi Sangeet Bhavan — Vintage Cassettes & Acoustic Memories
        </p>
      </div>

      {/* Bottom Anchored Player */}
      <div className="z-20 w-full max-w-xl pb-safe px-4 safe-p-bottom safe-p-left safe-p-right">
        <Player
          playlists={PLAYLISTS}
          currentPlaylistId={currentPlaylistId}
          onSelectPlaylist={handleSelectPlaylist}
        />
      </div>
    </>
  );
}
