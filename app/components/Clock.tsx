'use client';

import { useState, useEffect } from 'react';

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export function Clock() {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setTimeStr(timeFormatter.format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !timeStr) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md text-xs font-medium text-white/80 tabular-nums">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"></span>
        <span>IST --:-- --</span>
      </div>
    );
  }

  // Split into components for blinking colon
  // Formats like "9:05 pm" or "09:05 PM"
  const parts = timeStr.split(':');
  const hour = parts[0] || '12';
  const rest = parts[1] || '00 PM';
  const [minute, period] = rest.trim().split(' ');

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-b from-white/15 to-white/5 px-3.5 py-1.5 backdrop-blur-xl shadow-lg text-xs font-semibold text-white/90 tabular-nums tracking-wide select-none">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
      </span>
      <span className="text-white/60 font-mono text-[11px] uppercase tracking-wider">IST</span>
      <span className="font-mono text-[13px] text-white">
        {hour}
        <span className="inline-block animate-colon-blink text-amber-400 mx-[1px] font-bold">:</span>
        {minute}
      </span>
      {period && (
        <span className="text-[10.5px] uppercase font-semibold text-amber-300/90">{period}</span>
      )}
    </div>
  );
}
