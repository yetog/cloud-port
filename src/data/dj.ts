// DJ Zay Data - Mixes, Events, and Journey Posts

const S3_DJ_URL = 'https://s3.us-central-1.ionoscloud.com/portfoliowebsite/dj';

// =============================================================================
// TYPES
// =============================================================================

export interface DJMix {
  id: string;
  title: string;
  duration: string;
  vibe: 'House' | 'Funk' | 'Chill' | 'Energy' | 'Soulful' | 'Mixed';
  description: string;
  audioUrl?: string;
  coverUrl?: string;
  recordedAt?: string;
  featured?: boolean;
}

export interface DJEvent {
  id: string;
  venue: string;
  location: string;
  type: 'Residency' | 'Live Set' | 'Private' | 'Collaborative';
  description: string;
  date?: string;
  imageUrl?: string;
}

export interface JourneyPost {
  id: string;
  number: number;
  title: string;
  date: string;
  phase: 'Foundation' | 'Failure' | 'Reflection' | 'Win' | 'Insight' | 'Commitment' | 'Learning' | 'Redemption' | 'Systems' | 'Struggle' | 'Breakthrough' | 'Exploration' | 'Perspective' | 'Community' | 'Momentum' | 'Reality' | 'Opportunity' | 'Network' | 'Direction' | 'Hack' | 'Philosophy' | 'Identity' | 'Meaning';
  tags: string[];
  coreFocus: string;
  // Content sections
  moment?: string;        // The story/scene
  whatHappened?: string;  // What went wrong or occurred
  realization?: string;   // The insight/lesson
  whatChanged?: string;   // Actions taken after
  takeaway?: string;      // Punchy conclusion
  nextEntry?: string;     // Link to next post
  published?: boolean;
}

// =============================================================================
// DJ PROFILE
// =============================================================================

export const djProfile = {
  name: 'DJ Zay',
  tagline: 'Soulful House. Funk Energy. Real Vibes.',
  subtitle: 'DJ • Producer • Systems Builder',
  bio: 'Creating groove-driven experiences across live events and digital sets.',
  fullBio: `I'm a DJ and producer focused on groove, energy, and connection.
I started as a curator — building playlists, studying transitions — and turned that into live performance.
My style blends soul, funk, and house with a systems mindset. Energy over perfection.`,
  socialLinks: {
    soundcloud: 'https://soundcloud.com/zay_legend',
    instagram: '',
    spotify: '',
  }
};

// =============================================================================
// MIXES
// =============================================================================

export const djMixes: DJMix[] = [
  {
    id: 'late-night-groove',
    title: 'Late Night Groove Session',
    duration: '45:00',
    vibe: 'Soulful',
    description: 'Built for warm rooms and smooth transitions',
    audioUrl: `${S3_DJ_URL}/mixes/late-night-groove.mp3`,
    coverUrl: `${S3_DJ_URL}/covers/late-night-groove.jpg`,
    featured: true,
  },
  {
    id: 'art-battle-set',
    title: 'Art Battle Live Set',
    duration: '60:00',
    vibe: 'Energy',
    description: 'High-energy set from Art Battle at SPiN',
    audioUrl: `${S3_DJ_URL}/mixes/art-battle-set.mp3`,
    coverUrl: `${S3_DJ_URL}/covers/art-battle.jpg`,
    recordedAt: 'SPiN',
  },
  {
    id: 'funk-foundations',
    title: 'Funk Foundations',
    duration: '35:00',
    vibe: 'Funk',
    description: 'Classic funk grooves reimagined for the floor',
    audioUrl: `${S3_DJ_URL}/mixes/funk-foundations.mp3`,
    coverUrl: `${S3_DJ_URL}/covers/funk-foundations.jpg`,
  },
  {
    id: 'house-warmup',
    title: 'House Warmup',
    duration: '30:00',
    vibe: 'House',
    description: 'Deep house vibes to set the mood',
    audioUrl: `${S3_DJ_URL}/mixes/house-warmup.mp3`,
    coverUrl: `${S3_DJ_URL}/covers/house-warmup.jpg`,
  },
];

// =============================================================================
// EVENTS
// =============================================================================

export const djEvents: DJEvent[] = [
  {
    id: 'spin-art-battle',
    venue: 'SPiN',
    location: 'Art Battle',
    type: 'Residency',
    description: 'Live crowd mixing, multi-genre transitions. Resident DJ for creative events.',
    imageUrl: `${S3_DJ_URL}/events/spin.jpg`,
  },
  {
    id: 'queen-delaware',
    venue: 'Queen',
    location: 'Delaware',
    type: 'Live Set',
    description: 'Full setup performance, house + funk blend.',
    imageUrl: `${S3_DJ_URL}/events/queen.jpg`,
  },
  {
    id: 'private-events',
    venue: 'Private Events',
    location: 'Various',
    type: 'Private',
    description: 'Adaptable sets for house parties and private gatherings. Collaborative DJ environment.',
    imageUrl: `${S3_DJ_URL}/events/private.jpg`,
  },
];

// =============================================================================
// JOURNEY POSTS (Season 1 - 28 Entries)
// =============================================================================

export const journeyPosts: JourneyPost[] = [
  {
    id: 'curator-before-dj',
    number: 1,
    title: 'I Was Always a Curator Before I Was a DJ',
    date: 'Early January 2026',
    phase: 'Foundation',
    tags: ['Origin', 'Identity'],
    coreFocus: 'Taste, playlists',
    published: true,
  },
  {
    id: 'first-gig-failure',
    number: 2,
    title: "My First Gig… and I Didn't Even Get to Play",
    date: 'Late January 2026',
    phase: 'Failure',
    tags: ['Story', 'Failure'],
    coreFocus: 'No aux, CDJs mismatch',
    published: true,
  },
  {
    id: 'first-gig-not-my-fault',
    number: 3,
    title: "Why My First Gig Failure Wasn't Actually My Fault",
    date: 'Late January 2026',
    phase: 'Reflection',
    tags: ['Lesson', 'Insight'],
    coreFocus: 'Communication + prep',
    published: true,
  },
  {
    id: 'second-gig-queen',
    number: 4,
    title: 'My Second Gig Went Completely Different (Queen)',
    date: 'Late January 2026',
    phase: 'Win',
    tags: ['Story', 'Win'],
    coreFocus: 'Proper setup, confidence',
    published: true,
  },
  {
    id: 'setup-matters',
    number: 5,
    title: 'Why Your Setup Matters More Than Your Playlist',
    date: 'Late January 2026',
    phase: 'Insight',
    tags: ['Technical', 'Lesson'],
    coreFocus: 'Environment matters',
    published: true,
  },
  {
    id: 'first-equipment',
    number: 6,
    title: 'I Bought My First Real DJ Equipment',
    date: 'Early February 2026',
    phase: 'Commitment',
    tags: ['Progress', 'Technical'],
    coreFocus: 'Investing in gear',
    published: true,
  },
  {
    id: 'dj-masterclass',
    number: 7,
    title: 'I Got a Real DJ Masterclass (And Everything Changed)',
    date: 'Early February 2026',
    phase: 'Learning',
    tags: ['Mentor', 'Skill'],
    coreFocus: 'CDJs, USBs',
    published: true,
  },
  {
    id: 'back-to-spin',
    number: 8,
    title: 'I Went Back to SPiN and Killed It',
    date: 'Early-Mid February 2026',
    phase: 'Redemption',
    tags: ['Story', 'Win'],
    coreFocus: 'Full-circle moment',
    published: true,
  },
  {
    id: 'djing-as-system',
    number: 9,
    title: 'I Started Treating DJing Like a System, Not Just a Skill',
    date: 'Mid February 2026',
    phase: 'Systems',
    tags: ['Builder', 'Technical'],
    coreFocus: 'Automation mindset',
    published: true,
  },
  {
    id: 'dj-pipeline',
    number: 10,
    title: 'How I Built My DJ Pipeline (Scripts, Crates, Flow)',
    date: 'Mid February 2026',
    phase: 'Systems',
    tags: ['Builder', 'Deep Dive'],
    coreFocus: 'Organization workflows',
    published: true,
  },
  {
    id: 'setup-made-no-sense',
    number: 11,
    title: 'Why My Setup Made No Sense (And Nothing Worked)',
    date: 'Mid February 2026',
    phase: 'Struggle',
    tags: ['Technical', 'Failure'],
    coreFocus: 'Routing confusion',
    published: true,
  },
  {
    id: 'trim-knob',
    number: 12,
    title: 'The Small Knob That Changed Everything (Trim)',
    date: 'Mid-Late February 2026',
    phase: 'Breakthrough',
    tags: ['Technical', 'Insight'],
    coreFocus: 'Gain staging',
    published: true,
  },
  {
    id: 'serato-vs-rekordbox',
    number: 13,
    title: 'Serato vs Rekordbox vs Streaming — My Breakdown',
    date: 'Late February 2026',
    phase: 'Exploration',
    tags: ['Technical', 'Comparison'],
    coreFocus: 'Software learning',
    published: true,
  },
  {
    id: 'usb-obsession',
    number: 14,
    title: 'Why DJs Are Obsessed With USBs (And I Get It Now)',
    date: 'Late February 2026',
    phase: 'Perspective',
    tags: ['Technical', 'Lesson'],
    coreFocus: 'Reliability',
    published: true,
  },
  {
    id: 'talking-to-djs',
    number: 15,
    title: 'What I Learned Talking to Other DJs',
    date: 'Late February 2026',
    phase: 'Community',
    tags: ['Social', 'Insight'],
    coreFocus: 'Etiquette + mindset',
    published: true,
  },
  {
    id: 'seo-words-trick',
    number: 16,
    title: 'The "SEO Words" Trick That Made DJs Respect Me',
    date: 'Late February / March 2026',
    phase: 'Insight',
    tags: ['Social', 'Hack'],
    coreFocus: 'Speaking their language',
    published: true,
  },
  {
    id: 'wedding-dj-story',
    number: 17,
    title: 'The Wedding DJ Story (Backstage Lesson)',
    date: 'Early March 2026',
    phase: 'Insight',
    tags: ['Story', 'Social'],
    coreFocus: 'Respect + awareness',
    published: true,
  },
  {
    id: 'real-gigs-art-battle',
    number: 18,
    title: 'I Started Getting Real Gigs (Art Battle Run)',
    date: 'Early March 2026',
    phase: 'Momentum',
    tags: ['Story', 'Progress'],
    coreFocus: 'Reps + confidence',
    published: true,
  },
  {
    id: 'djs-dont-control-everything',
    number: 19,
    title: "The Night I Realized DJs Don't Control Everything",
    date: 'Early March 2026',
    phase: 'Reality',
    tags: ['Insight', 'Philosophy'],
    coreFocus: 'Sound guy + systems',
    published: true,
  },
  {
    id: 'evil-genius-lead',
    number: 20,
    title: 'I Met a Venue Manager and Got My First Real Lead (Evil Genius)',
    date: 'Late February 2026',
    phase: 'Opportunity',
    tags: ['Story', 'Progress'],
    coreFocus: 'Networking → opportunity',
    published: true,
  },
  {
    id: 'reconnecting-kevin',
    number: 21,
    title: 'Reconnecting With a DJ From High School (Kevin)',
    date: 'Mid March 2026',
    phase: 'Network',
    tags: ['Social', 'Growth'],
    coreFocus: 'Learning + EPK convo',
    published: true,
  },
  {
    id: 'epk-realization',
    number: 22,
    title: 'What Even Is a DJ Portfolio? (EPK Realization)',
    date: 'Mid March 2026',
    phase: 'Direction',
    tags: ['Strategy', 'Growth'],
    coreFocus: 'Next step clarity',
    published: true,
  },
  {
    id: 'house-party-problem',
    number: 23,
    title: 'The House Party That Exposed a New Problem',
    date: 'Mid March 2026',
    phase: 'Reality',
    tags: ['Story', 'Technical'],
    coreFocus: 'Bluetooth delay',
    published: true,
  },
  {
    id: 'apple-music-transitions',
    number: 24,
    title: 'How I Learned Transitions From Apple Music (Cheat Code)',
    date: 'Ongoing',
    phase: 'Hack',
    tags: ['Technique', 'Hack'],
    coreFocus: 'Passive learning',
    published: true,
  },
  {
    id: 'backup-plan',
    number: 25,
    title: 'Why Every DJ Needs a Backup Plan',
    date: 'Ongoing',
    phase: 'Philosophy',
    tags: ['Technical', 'Lesson'],
    coreFocus: 'Redundancy',
    published: true,
  },
  {
    id: 'crowd-energy',
    number: 26,
    title: 'The Night I Realized Crowd Energy Is Everything',
    date: 'Ongoing',
    phase: 'Insight',
    tags: ['Psychology', 'Story'],
    coreFocus: 'Energy control',
    published: true,
  },
  {
    id: 'finding-my-sound',
    number: 27,
    title: "I'm Starting to Find My Sound",
    date: 'Now',
    phase: 'Identity',
    tags: ['Creative', 'Brand'],
    coreFocus: 'Style emerging',
    published: true,
  },
  {
    id: 'pulled-back-into-music',
    number: 28,
    title: 'DJing Pulled Me Back Into Music',
    date: 'Now',
    phase: 'Meaning',
    tags: ['Reflection', 'Identity'],
    coreFocus: 'Bigger picture',
    published: true,
  },
];

// =============================================================================
// HELPERS
// =============================================================================

export const getFeaturedMix = (): DJMix | undefined => {
  return djMixes.find(mix => mix.featured);
};

export const getPublishedPosts = (): JourneyPost[] => {
  return journeyPosts.filter(post => post.published);
};

export const getPostByPhase = (phase: JourneyPost['phase']): JourneyPost[] => {
  return journeyPosts.filter(post => post.phase === phase);
};

export const getPostsByTag = (tag: string): JourneyPost[] => {
  return journeyPosts.filter(post => post.tags.includes(tag));
};

// Phase colors for UI
export const phaseColors: Record<JourneyPost['phase'], string> = {
  Foundation: 'bg-blue-500/20 text-blue-400',
  Failure: 'bg-red-500/20 text-red-400',
  Reflection: 'bg-purple-500/20 text-purple-400',
  Win: 'bg-green-500/20 text-green-400',
  Insight: 'bg-yellow-500/20 text-yellow-400',
  Commitment: 'bg-indigo-500/20 text-indigo-400',
  Learning: 'bg-cyan-500/20 text-cyan-400',
  Redemption: 'bg-emerald-500/20 text-emerald-400',
  Systems: 'bg-violet-500/20 text-violet-400',
  Struggle: 'bg-orange-500/20 text-orange-400',
  Breakthrough: 'bg-lime-500/20 text-lime-400',
  Exploration: 'bg-teal-500/20 text-teal-400',
  Perspective: 'bg-sky-500/20 text-sky-400',
  Community: 'bg-pink-500/20 text-pink-400',
  Momentum: 'bg-amber-500/20 text-amber-400',
  Reality: 'bg-slate-500/20 text-slate-400',
  Opportunity: 'bg-rose-500/20 text-rose-400',
  Network: 'bg-fuchsia-500/20 text-fuchsia-400',
  Direction: 'bg-blue-500/20 text-blue-400',
  Hack: 'bg-lime-500/20 text-lime-400',
  Philosophy: 'bg-violet-500/20 text-violet-400',
  Identity: 'bg-purple-500/20 text-purple-400',
  Meaning: 'bg-indigo-500/20 text-indigo-400',
};

// Vibe colors for mixes
export const vibeColors: Record<DJMix['vibe'], string> = {
  House: 'bg-purple-500/20 text-purple-400',
  Funk: 'bg-orange-500/20 text-orange-400',
  Chill: 'bg-blue-500/20 text-blue-400',
  Energy: 'bg-red-500/20 text-red-400',
  Soulful: 'bg-pink-500/20 text-pink-400',
  Mixed: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400',
};
