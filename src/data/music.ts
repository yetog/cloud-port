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

// Placeholder data - replace with actual music content
export const musicProjects: MusicProject[] = [
  {
    id: 'project-1',
    title: 'Coming Soon',
    type: 'album',
    year: 2025,
    description: 'New music project in development. Stay tuned for updates.',
    tracks: [
      {
        id: 'track-1',
        title: 'Sample Track',
        artist: 'Isayah Young-Burke',
        duration: '3:30',
        genre: 'Electronic',
      }
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
  name: 'Isayah Young-Burke',
  bio: 'Music producer and artist exploring the intersection of technology and sound. Creating electronic, ambient, and experimental music.',
  genres: ['Electronic', 'Ambient', 'Experimental'],
  socialLinks: {
    spotify: '',
    appleMusic: '',
    soundcloud: '',
    youtube: '',
    instagram: '',
  }
};
