'use client';

import { useState } from 'react';
import { Clock } from './Clock';
import { ListenerCount } from './ListenerCount';
import { Playlist } from '../types/music';

interface TopNavProps {
  playlists: Playlist[];
  currentPlaylistId: string;
  onSelectPlaylist: (id: string) => void;
}

export function TopNav({ playlists, currentPlaylistId, onSelectPlaylist }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId) || playlists[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between pointer-events-none safe-p-top safe-p-left safe-p-right">
      {/* Top Left: Clock */}
      <div className="pointer-events-auto">
        <Clock />
      </div>

      {/* Top Centre: Station Status & Listener Count */}
      <div className="pointer-events-auto hidden md:block">
        <ListenerCount currentPlaylistName={currentPlaylist.name} />
      </div>

      {/* Top Right: Playlist Selector & Links */}
      <div className="pointer-events-auto relative flex items-center gap-2">
        {/* Playlist Switcher Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-b from-white/15 to-white/5 px-3.5 py-1.5 backdrop-blur-xl shadow-lg text-xs font-medium text-white/90 transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
            aria-label="Select Playlist"
          >
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="hidden sm:inline text-white/80">Station:</span>
            <span className="font-semibold text-white">{currentPlaylist.name}</span>
            <svg className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-zinc-900/90 p-2 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10.5px] font-semibold tracking-wider text-white/40 uppercase">
                  Select Cassette / Channel
                </div>
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      onSelectPlaylist(pl.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left transition-all cursor-pointer ${
                      pl.id === currentPlaylistId
                        ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold">{pl.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/60">
                        {pl.tracks.length} tracks
                      </span>
                    </div>
                    <span className="text-[11px] text-white/50 line-clamp-1">{pl.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Social / Info Button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/15 to-white/5 text-white/80 backdrop-blur-xl shadow-lg transition-all hover:bg-white/20 hover:text-white active:scale-95"
          aria-label="GitHub"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
