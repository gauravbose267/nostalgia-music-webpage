'use client';

import { Track } from '../types/music';
import { VinylDisc } from './VinylDisc';
import { SeekBar } from './SeekBar';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface DesktopPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
}

export function DesktopPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
}: DesktopPlayerProps) {
  return (
    <div className="hidden sm:flex items-center gap-4.5 rounded-full p-3 pr-5 glass-panel select-none transition-all duration-300 hover:border-white/20 w-full max-w-xl shadow-2xl">
      {/* 1. Spinning Vinyl: 80px */}
      <div className="relative flex-shrink-0 cursor-pointer" onClick={onTogglePlay} title="Click to Play / Pause">
        <VinylDisc isPlaying={isPlaying} size="desktop" title={currentTrack.title} />
      </div>

      {/* 2. Middle Column: Title/Artist + Seek bar + Elapsed/Duration */}
      <div className="flex flex-1 flex-col justify-center min-w-0 pr-1">
        {/* Title and Artist */}
        <div className="flex items-baseline justify-between gap-2 overflow-hidden">
          <div className="flex items-baseline gap-2 min-w-0">
            <h3 className="text-[15px] font-semibold text-white truncate tracking-tight">
              {currentTrack.title}
            </h3>
            <span className="text-[12.5px] text-white/70 truncate font-normal">
              {currentTrack.artist}
            </span>
          </div>
          {currentTrack.year && (
            <span className="text-[10.5px] font-mono text-amber-300/80 px-1.5 py-0.5 rounded bg-white/10 flex-shrink-0">
              {currentTrack.year}
            </span>
          )}
        </div>

        {/* Seek Bar: 24px invisible hit area, 3px visible rail */}
        <div className="my-[-2px]">
          <SeekBar
            currentTime={currentTime}
            duration={duration || currentTrack.duration}
            onSeek={onSeek}
          />
        </div>

        {/* Elapsed / Duration */}
        <div className="flex items-center justify-between text-[10.5px] font-mono text-white/60 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || currentTrack.duration)}</span>
        </div>
      </div>

      {/* 3. Transport on the right: Prev, Play/Pause, Next */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Previous Track */}
        <button
          onClick={onPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-all hover:bg-white/10 hover:text-white active:scale-90 cursor-pointer"
          aria-label="Previous Track"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* 52px Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-neutral-950 ring-1 ring-white/25 shadow-[0_4px_20px_rgba(245,158,11,0.5)] transition-all hover:brightness-110 active:scale-95 cursor-pointer flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={onNext}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-all hover:bg-white/10 hover:text-white active:scale-90 cursor-pointer"
          aria-label="Next Track"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
