'use client';

import { useState, useRef, useCallback } from 'react';
import { Playlist, Track } from '../types/music';
import { YouTubeEngine, YouTubeEngineHandle } from './YouTubeEngine';
import { DesktopPlayer } from './DesktopPlayer';
import { MobilePlayer } from './MobilePlayer';

interface PlayerProps {
  playlists: Playlist[];
  currentPlaylistId: string;
  onSelectPlaylist: (id: string) => void;
}

export function Player({ playlists, currentPlaylistId }: PlayerProps) {
  const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId) || playlists[0];
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const engineRef = useRef<YouTubeEngineHandle>(null);

  const currentTrack: Track = currentPlaylist.tracks[trackIndex] || currentPlaylist.tracks[0];

  // Playback handlers
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        engineRef.current?.play();
      } else {
        engineRef.current?.pause();
      }
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTime(0);
    setTrackIndex((prev) => (prev + 1) % currentPlaylist.tracks.length);
    setIsPlaying(true);
  }, [currentPlaylist.tracks.length]);

  const handlePrev = useCallback(() => {
    setCurrentTime(0);
    setTrackIndex((prev) => (prev - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length);
    setIsPlaying(true);
  }, [currentPlaylist.tracks.length]);

  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    engineRef.current?.seekTo(seconds);
  }, []);

  const handleStateChange = useCallback((state: 'PLAYING' | 'PAUSED' | 'ENDED' | 'BUFFERING') => {
    if (state === 'PLAYING') {
      setIsPlaying(true);
    } else if (state === 'PAUSED') {
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback((current: number, dur: number) => {
    setCurrentTime(current);
    if (dur && dur > 0) {
      setDuration(dur);
    }
  }, []);

  const handleTrackEnded = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleTrackError = useCallback(
    (code: number, videoId: string) => {
      console.warn(`[Track Error] Code: ${code} on VideoId: ${videoId}. Advancing track automatically...`);
      // Skip to next track automatically
      handleNext();
    },
    [handleNext]
  );

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* 
        Visible YouTube Player Dock / Modal:
        YouTube IFrame is visibly rendered in aspect-video, ensuring full compliance 
        with YouTube's developer policies (no 1px/0 opacity hidden player, skip ad button is accessible).
      */}
      <div
        className={`transition-all duration-300 w-full max-w-xl mx-auto ${
          showVideoModal ? 'opacity-100 scale-100 block mb-2' : 'opacity-95 scale-100 block sm:max-w-md'
        }`}
      >
        <div className="rounded-2xl border border-white/15 bg-zinc-950/70 p-2.5 backdrop-blur-2xl shadow-2xl">
          {/* Header strip with vintage cassette details */}
          <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-mono text-white/60">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="uppercase tracking-wider font-semibold text-white/80">
                SWARALIPI VISUAL DECK • {currentPlaylist.name}
              </span>
            </div>
            <button
              onClick={() => setShowVideoModal(!showVideoModal)}
              className="text-[10px] text-amber-300/80 hover:text-amber-200 transition-colors uppercase font-mono tracking-widest cursor-pointer"
            >
              {showVideoModal ? '[- Compact]' : '[+ Focus]'}
            </button>
          </div>

          {/* Visible YouTube Player Engine */}
          <YouTubeEngine
            ref={engineRef}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onStateChange={handleStateChange}
            onTimeUpdate={handleTimeUpdate}
            onTrackEnded={handleTrackEnded}
            onTrackError={handleTrackError}
          />
        </div>
      </div>

      {/* Desktop Floating Glass Pill (hidden sm:flex) */}
      <DesktopPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration || currentTrack.duration}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
        onToggleVideoModal={() => setShowVideoModal(!showVideoModal)}
        isVideoVisible={showVideoModal}
      />

      {/* Mobile Stacked Glass Card (sm:hidden) */}
      <MobilePlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration || currentTrack.duration}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
        onToggleVideoModal={() => setShowVideoModal(!showVideoModal)}
      />
    </div>
  );
}
