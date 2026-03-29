// Music data structure for portfolio music section

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string; // format: "3:45"
  audioUrl?: string; // URL to audio file or streaming link
  coverUrl?: string; // Album/track artwork
  year?: number;
  genre?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  soundcloudUrl?: string;
  youtubeUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  coverUrl?: string;
  description?: string;
  tracks: Track[];
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

export interface MusicProject {
  id: string;
  title: string;
  type: 'album' | 'ep' | 'single' | 'mixtape' | 'compilation';
  year: number;
  coverUrl?: string;
  description?: string;
  tracks: Track[];
  links?: {
    spotify?: string;
    appleMusic?: string;
    soundcloud?: string;
    youtube?: string;
    bandcamp?: string;
  };
}

const S3_MUSIC_URL = 'https://s3.us-central-1.ionoscloud.com/portfoliowebsite/music';

export const musicProjects: MusicProject[] = [
  {
    id: 'ph-pool',
    title: 'PH Pool',
    type: 'album',
    year: 2026,
    coverUrl: `${S3_MUSIC_URL}/ph-pool-cover.jpg`,
    description: 'A collection of ambient and electronic compositions exploring mood, atmosphere, and sonic textures.',
    tracks: [
      { id: 'abode', title: 'Abode', artist: 'Zay Legend', duration: '2:32', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/abode.mp3` },
      { id: 'azure', title: 'Azure', artist: 'Zay Legend', duration: '3:02', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/azure.mp3` },
      { id: 'balconies', title: 'Balconies', artist: 'Zay Legend', duration: '4:23', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/balconies.mp3` },
      { id: 'bath-bomb', title: 'Bath Bomb', artist: 'Zay Legend', duration: '3:21', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/bath-bomb.mp3` },
      { id: 'blush', title: 'Blush', artist: 'Zay Legend', duration: '4:31', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/blush.mp3` },
      { id: 'cascade', title: 'Cascade', artist: 'Zay Legend', duration: '2:31', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/cascade.mp3` },
      { id: 'channel-news', title: 'Channel News', artist: 'Zay Legend', duration: '3:05', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/channel-news.mp3` },
      { id: 'coast', title: 'Coast', artist: 'Zay Legend', duration: '4:29', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/coast.mp3` },
      { id: 'crimson-sunsets', title: 'Crimson Sunsets', artist: 'Zay Legend', duration: '4:40', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/crimson-sunsets.mp3` },
      { id: 'departure', title: 'Departure', artist: 'Zay Legend', duration: '3:58', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/departure.mp3` },
      { id: 'dividends', title: 'Dividends', artist: 'Zay Legend', duration: '4:40', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/dividends.mp3` },
      { id: 'dusk', title: 'Dusk', artist: 'Zay Legend', duration: '3:10', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/dusk.mp3` },
      { id: 'equity', title: 'Equity', artist: 'Zay Legend', duration: '4:10', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/equity.mp3` },
      { id: 'i-want-you-to-stay', title: 'I Want You to Stay', artist: 'Zay Legend', duration: '3:46', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/i-want-you-to-stay.mp3` },
      { id: 'intimacy', title: 'Intimacy', artist: 'Zay Legend', duration: '3:25', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/intimacy.mp3` },
      { id: 'midnight-shower', title: 'Midnight Shower', artist: 'Zay Legend', duration: '4:06', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/midnight-shower.mp3` },
      { id: 'pulse', title: 'Pulse', artist: 'Zay Legend', duration: '2:16', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/pulse.mp3` },
      { id: 'retro-rivers', title: 'Retro Rivers', artist: 'Zay Legend', duration: '4:41', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/retro-rivers.mp3` },
      { id: 'ripples', title: 'Ripples', artist: 'Zay Legend', duration: '3:46', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/ripples.mp3` },
      { id: 'risky-business', title: 'Risky Business', artist: 'Zay Legend', duration: '4:02', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/risky-business.mp3` },
      { id: 'serene', title: 'Serene', artist: 'Zay Legend', duration: '3:39', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/serene.mp3` },
      { id: 'sidewalk-slammer', title: 'Sidewalk Slammer', artist: 'Zay Legend', duration: '2:36', genre: 'Electronic', audioUrl: `${S3_MUSIC_URL}/sidewalk-slammer.mp3` },
      { id: 'skyline', title: 'Skyline', artist: 'Zay Legend', duration: '4:31', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/skyline.mp3` },
      { id: 'the-secret-spot', title: 'The Secret Spot', artist: 'Zay Legend', duration: '3:15', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/the-secret-spot.mp3` },
      { id: 'warm-oud', title: 'Warm Oud', artist: 'Zay Legend', duration: '2:30', genre: 'Ambient', audioUrl: `${S3_MUSIC_URL}/warm-oud.mp3` },
    ],
    links: {}
  }
];

// Featured tracks for quick access
export const featuredTracks: Track[] = musicProjects.flatMap(p => p.tracks).slice(0, 5);

// Get all tracks across all projects
export const getAllTracks = (): Track[] => {
  return musicProjects.flatMap(project => project.tracks);
};

// Artist info
export const artistInfo = {
  name: 'Zay Legend',
  bio: 'Music producer and artist exploring the intersection of technology and sound. Creating electronic, ambient, and experimental music.',
  genres: ['Electronic', 'Ambient', 'Experimental'],
  socialLinks: {
    spotify: '',
    appleMusic: 'https://music.apple.com/us/song/thurzday/1684586453',
    soundcloud: 'https://soundcloud.com/zay_legend',
    youtube: '',
    instagram: '',
  }
};
