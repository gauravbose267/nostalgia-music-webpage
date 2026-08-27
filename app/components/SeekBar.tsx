'use client';

import { useRef, useCallback } from 'react';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
}

export function SeekBar({ currentTime, duration, onSeek, className = '' }: SeekBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const calculateProgressFromPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      if (!barRef.current || duration <= 0) return 0;
      const rect = barRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      return percentage * duration;
    },
    [duration]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const newTime = calculateProgressFromPointer(e);
    onSeek(newTime);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const newTime = calculateProgressFromPointer(e);
    onSeek(newTime);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release safety
      }
    }
  };

  const percentage = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div
      ref={barRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`group relative flex h-6 w-full cursor-pointer items-center touch-none select-none ${className}`}
      role="slider"
      aria-label="Audio Seek Bar"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
    >
      {/* 3px Visible Rail */}
      <div className="relative h-[3px] w-full rounded-full bg-white/15 overflow-hidden group-hover:h-[4px] transition-all duration-150">
        {/* Accent Filled Progress with soft glow */}
        <div
          className="h-full bg-amber-400 transition-[width] duration-75 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Knob visible on hover / dragging only */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(245,158,11,0.9)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none -translate-x-1/2"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}
