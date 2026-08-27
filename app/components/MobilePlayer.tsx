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

interface MobilePlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
}

export function MobilePlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
}: MobilePlayerProps) {
  return (
    <div className="sm:hidden flex flex-col gap-3 rounded-[26px] p-4 glass-panel select-none w-full max-w-sm mx-auto shadow-2xl">
      {/* Row 1: 64px vinyl + title/artist */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="cursor-pointer flex-shrink-0" onClick={onTogglePlay} title="Click to Play / Pause">
          <VinylDisc isPlaying={isPlaying} size="mobile" title={currentTrack.title} />
        </div>
        <div className="flex flex-col min-w-0 justify-center">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[15px] font-semibold text-white truncate tracking-tight">
              {currentTrack.title}
            </h3>
            {currentTrack.year && (
              <span className="text-[10px] font-mono text-amber-300/80 px-1 py-0.2 rounded bg-white/10 flex-shrink-0">
                {currentTrack.year}
              </span>
            )}
          </div>
          <span className="text-[12.5px] text-white/70 truncate">
            {currentTrack.artist}
          </span>
          {currentTrack.film && (
            <span className="text-[11px] text-white/40 truncate">
              {currentTrack.film}
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Full-width Seek Bar */}
      <div className="w-full my-[-2px]">
        <SeekBar
          currentTime={currentTime}
          duration={duration || currentTrack.duration}
          onSeek={onSeek}
        />
      </div>

      {/* Row 3: Elapsed/duration on the left, Transport centred, 44px min targets */}
      <div className="flex items-center justify-between pt-0.5">
        {/* Elapsed / Duration */}
        <div className="flex flex-col text-[10.5px] font-mono text-white/60 tabular-nums min-w-[50px]">
          <span>{formatTime(currentTime)}</span>
          <span className="text-white/40">{formatTime(duration || currentTrack.duration)}</span>
        </div>

        {/* Centred Transport Controls (44px min targets) */}
        <div className="flex items-center gap-3">
          {/* Previous Track */}
          <button
            onClick={onPrev}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 active:scale-90 cursor-pointer"
            aria-label="Previous Track"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* 52px Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="flex h-[52px] w-[52px] min-h-[52px] min-w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-neutral-950 ring-1 ring-white/25 shadow-[0_4px_20px_rgba(245,158,11,0.5)] transition-all active:scale-95 cursor-pointer flex-shrink-0"
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
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 active:scale-90 cursor-pointer"
            aria-label="Next Track"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <div className="min-w-[50px]"></div>
      </div>
    </div>
  );
}
