import { Playlist } from '../types/music';

/**
 * Playlists Configuration
 * Adding a song is a single-line dictionary entry:
 * { id: "track-slug", title: "Song Name", artist: "Artist", film: "Album/Film", year: 1998, duration: 180, videoId: "YOUTUBE_ID" },
 */
export const PLAYLISTS: Playlist[] = [
  {
    id: 'panbazar-evenings',
    name: 'Panbazar Evenings',
    description: 'Golden hour cassette tunes, street buzz, and acoustic nostalgia',
    tag: 'Adda & Acoustic',
    tracks: [
      { id: 'pb-1', title: 'Golden Hour Monologue', artist: 'Swaralipi Archives', film: 'Panbazar Memories', year: 1994, duration: 194, videoId: 'jfKfPfyJRdk' },
      { id: 'pb-2', title: 'Brahmaputra Breeze', artist: 'Acoustic Assam', film: 'Riverbank Tapes', year: 1997, duration: 215, videoId: '5qap5aO4i9A' },
      { id: 'pb-3', title: 'Vintage Scooter Ride', artist: 'Retro Rhythms', film: 'Guwahati-1', year: 1992, duration: 180, videoId: 'DWcJFNfaw9c' },
      { id: 'pb-4', title: 'Sunset at Dighalipukhuri', artist: 'Lakeside Strings', film: 'Old Town Echoes', year: 1999, duration: 240, videoId: 'WPni755-Krg' },
    ],
  },
  {
    id: 'monsoon-melodies',
    name: 'Monsoon Melodies',
    description: 'Raindrops on tin roofs, warm chai, and sweet vintage melodies',
    tag: 'Rain & Romance',
    tracks: [
      { id: 'mm-1', title: 'Rain Over Tin Roofs', artist: 'Monsoon Collective', film: 'Guwahati Rains', year: 1996, duration: 220, videoId: 'mPZkdNFkNps' },
      { id: 'mm-2', title: 'Chai & Old Letters', artist: 'Sangeet Bhavan Session', film: 'Cassette Tapes Vol. 2', year: 1995, duration: 175, videoId: 'lTRiuFIWV54' },
      { id: 'mm-3', title: 'Whispering Palms', artist: 'Hills & Valleys', film: 'Monsoon Diary', year: 1998, duration: 205, videoId: 'rUxyKA_-grg' },
    ],
  },
  {
    id: 'late-night-adda',
    name: 'Late Night Adda',
    description: 'Mellow nighttime lo-fi, tranquil vinyl crackles, and timeless peace',
    tag: 'Midnight Chill',
    tracks: [
      { id: 'ln-1', title: 'Midnight at Panbazar Point', artist: 'Night Owl Trio', film: 'After Hours', year: 2001, duration: 210, videoId: '21qNxnCS8WU' },
      { id: 'ln-2', title: 'Streetlight Serenade', artist: 'Corner Shop Duo', film: 'Night Tape 04', year: 1993, duration: 190, videoId: 'kgx4WGK0oNU' },
      { id: 'ln-3', title: 'Stars Over Nilachal', artist: 'Assam Acoustic Lab', film: 'Hilltop Reverie', year: 1999, duration: 235, videoId: '7NOSDKb0HlU' },
    ],
  },
];
