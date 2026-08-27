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
    setTimeout(() => {
      engineRef.current?.play();
    }, 100);
  }, [currentPlaylist.tracks.length]);

  const handlePrev = useCallback(() => {
    setCurrentTime(0);
    setTrackIndex((prev) => (prev - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length);
    setIsPlaying(true);
    setTimeout(() => {
      engineRef.current?.play();
    }, 100);
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
      console.warn(`[Track Error] Code: ${code} on VideoId: ${videoId}. Skipping to next track...`);
      handleNext();
    },
    [handleNext]
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* Invisible YouTube Audio Engine */}
      <YouTubeEngine
        ref={engineRef}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onStateChange={handleStateChange}
        onTimeUpdate={handleTimeUpdate}
        onTrackEnded={handleTrackEnded}
        onTrackError={handleTrackError}
      />

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
      />
    </div>
  );
}
