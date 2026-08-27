export interface Track {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: number | string;
  duration: number; // in seconds
  videoId: string;  // YouTube Video ID
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tag: string;
  tracks: Track[];
}

export type PlaybackState = 'UNSTARTED' | 'ENDED' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'CUED';
