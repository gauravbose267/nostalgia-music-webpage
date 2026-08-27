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
    const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
    const [isApiReady, setIsApiReady] = useState(false);
    const [hasLoadedPlayer, setHasLoadedPlayer] = useState(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stop progress tracking timer
    const stopProgressTracking = useCallback(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, []);

    // Start progress tracking timer
    const startProgressTracking = useCallback(() => {
      stopProgressTracking();
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const current = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || currentTrack.duration || 0;
            onTimeUpdate(current, dur);
          } catch {
            // Ignore cross-frame issues
          }
        }
      }, 250);
    }, [currentTrack.duration, onTimeUpdate, stopProgressTracking]);

    // Expose control handles to parent
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            try {
              playerRef.current.playVideo();
            } catch (err) {
              console.error('Error playing video:', err);
            }
          }
        },
        pause: () => {
          if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
            try {
              playerRef.current.pauseVideo();
            } catch (err) {
              console.error('Error pausing video:', err);
            }
          }
        },
        seekTo: (seconds: number) => {
          if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
            try {
              playerRef.current.seekTo(seconds, true);
              onTimeUpdate(seconds, currentTrack.duration);
            } catch (err) {
              console.error('Error seeking video:', err);
            }
          }
        },
        setVolume: (volume: number) => {
          if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
            try {
              playerRef.current.setVolume(Math.min(100, Math.max(0, volume)));
            } catch (err) {
              console.error('Error setting volume:', err);
            }
          }
        },
      }),
      [currentTrack.duration, onTimeUpdate]
    );

    // 1. Load YouTube IFrame API script
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

      // If player already exists, load new video
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById({
            videoId: currentTrack.videoId,
            startSeconds: 0,
          });
          if (isPlaying) {
            playerRef.current.playVideo();
          }
        } catch (err) {
          console.warn('Could not reload video ID:', err);
        }
        return;
      }

      // Create new player
      playerRef.current = new window.YT.Player(containerId.current, {
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          fs: 1,
        },
        events: {
          onReady: (event: any) => {
            setHasLoadedPlayer(true);
            if (isPlaying) {
              try {
                event.target.playVideo();
              } catch (e) {
                console.warn('Autoplay blocked before interaction:', e);
              }
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
            const state = event.data;
            if (state === 1) {
              // PLAYING
              onStateChange('PLAYING');
              startProgressTracking();
            } else if (state === 2) {
              // PAUSED
              onStateChange('PAUSED');
              stopProgressTracking();
            } else if (state === 0) {
              // ENDED
              onStateChange('ENDED');
              stopProgressTracking();
              onTrackEnded();
            } else if (state === 3) {
              // BUFFERING
              onStateChange('BUFFERING');
            }
          },
          onError: (event: any) => {
            const errorCode = event.data;
            console.error(`YouTube Player Error ${errorCode} on videoId ${currentTrack.videoId}`);
            stopProgressTracking();
            onTrackError(errorCode, currentTrack.videoId);
          },
        },
      });

      return () => {
        stopProgressTracking();
      };
    }, [
      isApiReady,
      currentTrack.videoId,
      onStateChange,
      onTrackEnded,
      onTrackError,
      startProgressTracking,
      stopProgressTracking,
    ]);

    // Handle isPlaying changes
    useEffect(() => {
      if (!playerRef.current) return;
      try {
        if (isPlaying && typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        } else if (!isPlaying && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } catch {
        // Player state change fallback
      }
    }, [isPlaying]);

    return (
      <div className="w-full flex flex-col items-center">
        {/* Visible YouTube Video Container - fully compliant with YouTube developer terms */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/90 border border-white/10 shadow-2xl">
          <div id={containerId.current} className="w-full h-full" />
          
          {/* Subtle vintage CRT scanline overlay effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.03] to-transparent opacity-40 mix-blend-overlay"></div>
        </div>
      </div>
    );
  }
);
