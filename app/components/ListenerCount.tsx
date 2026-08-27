'use client';

import { useState, useEffect } from 'react';

export function ListenerCount({ currentPlaylistName }: { currentPlaylistName: string }) {
  const [listeners, setListeners] = useState(128);

  useEffect(() => {
    const interval = setInterval(() => {
      // Gentle jitter +/- 1 or 2
      setListeners((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 80 ? 85 : next > 250 ? 240 : next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-gradient-to-b from-white/15 to-white/5 px-4 py-1.5 backdrop-blur-xl shadow-lg text-xs text-white/90 select-none">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="font-semibold tabular-nums text-[12px] text-white">
          {listeners}
        </span>
        <span className="text-white/60 text-[11px] hidden xs:inline">tuning in</span>
      </div>
      <span className="h-3 w-[1px] bg-white/20"></span>
      <span className="text-[11px] font-medium text-amber-300/90 truncate max-w-[120px] sm:max-w-[200px]">
        {currentPlaylistName}
      </span>
    </div>
  );
}
