'use client';

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Track } from '../types/music';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubeEngineHandle {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

interface YouTubeEngineProps {
  currentTrack: Track;
  isPlaying: boolean;
  onStateChange: (state: 'PLAYING' | 'PAUSED' | 'ENDED' | 'BUFFERING') => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onTrackEnded: () => void;
  onTrackError: (code: number, videoId: string) => void;
}

export const YouTubeEngine = forwardRef<YouTubeEngineHandle, YouTubeEngineProps>(
  function YouTubeEngine(
    { currentTrack, isPlaying, onStateChange, onTimeUpdate, onTrackEnded, onTrackError },
    ref
  ) {
    const playerRef = useRef<any>(null);
    const containerId = useRef('yt-audio-player-host');
    const [isApiReady, setIsApiReady] = useState(false);
    const pendingPlayRef = useRef(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stop progress timer
    const stopProgress = useCallback(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, []);

    // Start progress timer
    const startProgress = useCallback(() => {
      stopProgress();
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const current = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || currentTrack.duration || 0;
            onTimeUpdate(current, dur);
          } catch {
            // Ignore
          }
        }
      }, 250);
    }, [currentTrack.duration, onTimeUpdate, stopProgress]);

    // Handle methods for parent
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          pendingPlayRef.current = true;
          if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            try {
              playerRef.current.playVideo();
            } catch (err) {
              console.warn('Play error:', err);
            }
          }
        },
        pause: () => {
          pendingPlayRef.current = false;
          if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
            try {
              playerRef.current.pauseVideo();
            } catch (err) {
              console.warn('Pause error:', err);
            }
          }
        },
        seekTo: (seconds: number) => {
          if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
            try {
              playerRef.current.seekTo(seconds, true);
              onTimeUpdate(seconds, currentTrack.duration);
            } catch (err) {
              console.warn('Seek error:', err);
            }
          }
        },
        setVolume: (volume: number) => {
          if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            try {
              playerRef.current.setVolume(Math.min(100, Math.max(0, volume)));
            } catch (err) {
              console.warn('Volume error:', err);
            }
          }
        },
      }),
      [currentTrack.duration, onTimeUpdate]
    );

    // 1. Load YouTube IFrame API Script
    useEffect(() => {
      if (typeof window === 'undefined') return;

      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return;
      }

      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        setIsApiReady(true);
      };
    }, []);

    // 2. Initialize YT.Player
    useEffect(() => {
      if (!isApiReady || typeof window === 'undefined' || !window.YT) return;

      const element = document.getElementById(containerId.current);
      if (!element) return;

      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById({
            videoId: currentTrack.videoId,
            startSeconds: 0,
          });
          if (isPlaying || pendingPlayRef.current) {
            playerRef.current.playVideo();
          }
        } catch (err) {
          console.warn('Error loading video by ID:', err);
        }
        return;
      }

      playerRef.current = new window.YT.Player(containerId.current, {
        height: '160',
        width: '240',
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            if (isPlaying || pendingPlayRef.current) {
              try {
                event.target.playVideo();
              } catch (e) {
                console.warn('Playback gesture required:', e);
              }
            }
          },
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === 1) {
              // PLAYING
              onStateChange('PLAYING');
              startProgress();
            } else if (state === 2) {
              // PAUSED
              onStateChange('PAUSED');
              stopProgress();
            } else if (state === 0) {
              // ENDED
              onStateChange('ENDED');
              stopProgress();
              onTrackEnded();
            } else if (state === 3) {
              // BUFFERING
              onStateChange('BUFFERING');
            }
          },
          onError: (event: any) => {
            const errorCode = event.data;
            console.error(`[YouTube Error] Code: ${errorCode} on videoId: ${currentTrack.videoId}`);
            stopProgress();
            onTrackError(errorCode, currentTrack.videoId);
          },
        },
      });

      return () => {
        stopProgress();
      };
    }, [
      isApiReady,
      currentTrack.videoId,
      onStateChange,
      onTrackEnded,
      onTrackError,
      startProgress,
      stopProgress,
    ]);

    // Handle isPlaying prop updates
    useEffect(() => {
      if (!playerRef.current) return;
      try {
        if (isPlaying && typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        } else if (!isPlaying && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } catch {
        // Fallback
      }
    }, [isPlaying]);

    return (
      <div className="fixed -bottom-96 -left-96 w-48 h-32 opacity-0 pointer-events-none overflow-hidden -z-50">
        <div id={containerId.current} />
      </div>
    );
  }
);
