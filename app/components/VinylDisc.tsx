'use client';

interface VinylDiscProps {
  isPlaying: boolean;
  size?: 'desktop' | 'mobile';
  title?: string;
}

export function VinylDisc({ isPlaying, size = 'desktop', title }: VinylDiscProps) {
  const sizeClasses = size === 'desktop' ? 'h-20 w-20' : 'h-16 w-16';

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses} select-none`}>
      {/* Outer vinyl disc */}
      <div
        className={`relative h-full w-full rounded-full bg-zinc-950 p-1.5 shadow-2xl transition-all duration-300 ring-1 ring-white/20 animate-spin-slow`}
        style={{
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        {/* Vinyl Grooves Texture */}
        <div className="relative h-full w-full rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-800 p-2 flex items-center justify-center overflow-hidden border border-white/5">
          {/* Subtle concentric groove rings */}
          <div className="absolute inset-1 rounded-full border border-white/[0.07]"></div>
          <div className="absolute inset-2.5 rounded-full border border-white/[0.05]"></div>
          <div className="absolute inset-4 rounded-full border border-white/[0.07]"></div>

          {/* Vinyl Light Sheen / Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none"></div>

          {/* Centre Label Artwork */}
          <div className="relative h-full w-full rounded-full bg-gradient-to-br from-amber-600 to-amber-950 flex items-center justify-center shadow-inner border border-amber-400/30 overflow-hidden">
            <span className="text-[7px] font-bold tracking-widest text-amber-200/80 uppercase px-1 text-center truncate max-w-[90%]">
              {title ? title.slice(0, 8) : 'SWARALIPI'}
            </span>
          </div>
        </div>

        {/* Spindle Hole: 12px bg-black/70 ring-2 ring-white/40 */}
        <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black/80 ring-2 ring-white/40 shadow-inner z-10"></div>
      </div>
    </div>
  );
}
