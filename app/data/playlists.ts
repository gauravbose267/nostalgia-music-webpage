import { Playlist } from '../types/music';

/**
 * Zubeen Garg Playlists
 * Streams from official/embeddable YouTube uploads with one-line track definitions:
 * { id: "slug", title: "Song Name", artist: "Artist", film: "Album/Film", year: 1998, duration: 180, videoId: "YOUTUBE_ID" },
 */
export const PLAYLISTS: Playlist[] = [
  {
    id: 'zubeen-assamese-classics',
    name: 'Zubeen Garg: Evergreen Assamese',
    description: 'Timeless Assamese masterpieces that shaped generations of music in Assam',
    tag: 'Assamese Classics',
    tracks: [
      { id: 'zg-a1', title: 'Mayabini Ratir Bukut', artist: 'Zubeen Garg', film: 'Daag', year: 2000, duration: 320, videoId: 'vC5gV7u9W_s' },
      { id: 'zg-a2', title: 'Monor Nijanot', artist: 'Zubeen Garg', film: 'Anamika', year: 1992, duration: 285, videoId: 'C7D2cZ_gZgI' },
      { id: 'zg-a3', title: 'Pakhi Pakhi Aei Mon', artist: 'Zubeen Garg', film: 'Pakhi', year: 2000, duration: 290, videoId: 'K3gD1i_GvjU' },
      { id: 'zg-a4', title: 'Kuwasun Ebar Bhal Pao Buli', artist: 'Zubeen Garg', film: 'Maya', year: 1994, duration: 310, videoId: 'hY3N0sU2GZg' },
      { id: 'zg-a5', title: 'Mayabini (Classic)', artist: 'Zubeen Garg', film: 'Saregama Evergreen', year: 2001, duration: 305, videoId: 'S3Uo_gP5Z0g' },
    ],
  },
  {
    id: 'zubeen-bollywood-hits',
    name: 'Zubeen Garg: Bollywood Blockbusters',
    description: 'Iconic Bollywood chartbusters sung by the musical voice of the Northeast',
    tag: 'Bollywood Hits',
    tracks: [
      { id: 'zg-b1', title: 'Ya Ali', artist: 'Zubeen Garg', film: 'Gangster', year: 2006, duration: 295, videoId: 'kYJ5oV4YfWc' },
      { id: 'zg-b2', title: 'Dil Tu Hi Bataa', artist: 'Zubeen Garg & Alisha Chinai', film: 'Krrish 3', year: 2013, duration: 390, videoId: 'wN4K2K20o5g' },
      { id: 'zg-b3', title: 'Jaane Kya Chaahe Mann Baawra', artist: 'Zubeen Garg', film: 'Pyaar Ke Side Effects', year: 2006, duration: 260, videoId: '1ZS901FT0Js' },
      { id: 'zg-b4', title: 'Subah Subah', artist: 'Zubeen Garg & Shaan', film: 'I See You', year: 2006, duration: 275, videoId: 'Blx4MwYVvzc' },
    ],
  },
  {
    id: 'zubeen-late-night-adda',
    name: 'Zubeen Garg: Late Night Adda',
    description: 'Deep cuts, soulful night tunes, and golden hour melodies for quiet reflection',
    tag: 'Midnight Soul',
    tracks: [
      { id: 'zg-l1', title: 'Monor Nijanot (Lofi Mood)', artist: 'Zubeen Garg', film: 'Anamika Tape', year: 1992, duration: 260, videoId: 'G5D9G6d5qXw' },
      { id: 'zg-l2', title: 'Ya Ali (Rock/Trending Edit)', artist: 'Zubeen Garg', film: 'Gangster Unplugged', year: 2006, duration: 280, videoId: '4y-N0T_p-Q0' },
      { id: 'zg-l3', title: 'Mayabini (Tribute Session)', artist: 'Zubeen Garg', film: 'Sangeet Bhavan Archives', year: 2002, duration: 315, videoId: 'T_5P_q5zY5Y' },
      { id: 'zg-l4', title: 'Ya Ali (Official Video)', artist: 'Zubeen Garg', film: 'Vishesh Films', year: 2006, duration: 290, videoId: 'J_b53V2T7sA' },
    ],
  },
];
