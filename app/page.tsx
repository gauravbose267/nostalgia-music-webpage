import { NostalgiaApp } from './components/NostalgiaApp';

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 
        1. Fixed background div, -z-20, class hero-bg, bg-cover bg-center.
        In CSS, set to scene-wide.png, and swap to scene-tall.png inside @media (orientation: portrait).
        Overlay a bg-gradient-to-b from-black/35 via-transparent to-black/80.
      */}
      <div className="fixed inset-0 -z-20 hero-bg bg-cover bg-center bg-no-repeat transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* 
        2. Fixed grain overlay, -z-10: inline SVG feTurbulence data-URI, mix-blend-mode: overlay, opacity: 0.3.
      */}
      <div className="fixed inset-0 -z-10 grain-overlay pointer-events-none" />

      {/* 
        3. Main interactive content: Fixed top row and bottom-anchored player
      */}
      <NostalgiaApp />
    </main>
  );
}
