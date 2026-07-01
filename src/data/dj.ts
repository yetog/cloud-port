// DJ Zay Data - Mixes, Events, and Journey Posts

const S3_DJ_URL = 'https://s3.us-central-1.ionoscloud.com/portfoliowebsite/DJ';

// =============================================================================
// DJ IMAGES (Actual S3 files)
// =============================================================================

export const djImages = {
  // Hero/Profile shots
  hero: `${S3_DJ_URL}/884C5A78-4A68-4646-8284-12568789C3C7_1_102_o.jpeg`,
  profile: `${S3_DJ_URL}/24CE3CCD-1D4F-4C9C-BBB9-51755F217ED4_1_102_o.jpeg`,

  // SPiN / Art Battle
  spinProfile: `${S3_DJ_URL}/51BBE407-A311-447B-90B3-C22B32A5FD14_1_102_o.jpeg`,
  spinAction: `${S3_DJ_URL}/9B44FD29-602E-4220-A964-BDCCFB0C53C2_1_102_o.jpeg`,
  artBattleSelfie: `${S3_DJ_URL}/8196EB44-0B7F-4CB3-97C1-850D68DA9A42_1_105_c.jpeg`,
  artBattleDecks: `${S3_DJ_URL}/9792AC74-ED53-4486-8702-89EEC74F0B06_1_105_c.jpeg`,

  // Frankie Bradley's
  frankieBradleys: `${S3_DJ_URL}/0D6F68AE-92D0-4F44-8F14-F180E8D1EB36_1_105_c.jpeg`,

  // Queen
  queen: `${S3_DJ_URL}/045300CC-AD60-4544-87AA-666731F7E0F0_1_105_c.jpeg`,

  // Private/House Party
  houseParty: `${S3_DJ_URL}/E0D5C82B-1C1B-4E87-AAFF-266421C98BE8_1_105_c.jpeg`,

  // Evil Genius venue
  evilGenius: `${S3_DJ_URL}/91A4E670-7AFD-44B8-9D85-F09978CAD17A_1_105_c.jpeg`,

  // Studio
  studio: `${S3_DJ_URL}/FEBC3699-199E-4271-97B5-11BB5846A240_1_105_c.jpeg`,

  // Additional shots
  extra1: `${S3_DJ_URL}/39AE85D9-0E46-4AE0-9A05-A86D701A15D2_1_105_c.jpeg`,
  extra2: `${S3_DJ_URL}/435BD88E-3D47-47BF-8530-ED8B54E8C87C_1_105_c.jpeg`,
  extra3: `${S3_DJ_URL}/5454E002-41E7-47B2-B8A5-BCA326651732_1_105_c.jpeg`,
  extra4: `${S3_DJ_URL}/7B16D92B-7FE4-411F-9146-12CBD4BAEF65_1_105_c.jpeg`,
  extra5: `${S3_DJ_URL}/D0BE6B68-5956-4E49-A1C2-36E87D4A41AA_1_105_c.jpeg`,
  extra6: `${S3_DJ_URL}/AE361FBD-9DC7-42BB-B41A-798CE5E87C0B_1_105_c.jpeg`,
  extra7: `${S3_DJ_URL}/24D6D15F-E01B-493A-A21A-22105F1A61BF_1_105_c.jpeg`,
  extra8: `${S3_DJ_URL}/100E557F-870D-4B7C-A6D5-CCA5A8ACBCCC_4_5005_c.jpeg`,
  extra9: `${S3_DJ_URL}/28CD861E-12C9-4665-A832-E8D50E8FF3CE_4_5005_c.jpeg`,
  extra10: `${S3_DJ_URL}/B3D7112B-5B8E-408C-803D-68CAC28828A7_4_5005_c.jpeg`,
  extra11: `${S3_DJ_URL}/D29FFC3C-0903-4699-ADD0-8B7AC8260CD0_4_5005_c.jpeg`,
};

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
  // New fields for immersive experience
  photos?: string[];           // Gallery of photos from this event
  videoUrl?: string;           // Video clip from the event
  linkedMixId?: string;        // ID of the mix from this night
  highlights?: string[];       // Key moments/highlights
  setlist?: string[];          // Songs played (optional)
}

export interface JourneyPost {
  id: string;
  number: number;
  title: string;
  date: string;
  phase: 'Foundation' | 'Failure' | 'Reflection' | 'Win' | 'Insight' | 'Commitment' | 'Learning' | 'Redemption' | 'Systems' | 'Struggle' | 'Breakthrough' | 'Exploration' | 'Perspective' | 'Community' | 'Momentum' | 'Reality' | 'Opportunity' | 'Network' | 'Direction' | 'Hack' | 'Philosophy' | 'Identity' | 'Meaning' | 'Skill' | 'Growth';
  tags: string[];
  coreFocus: string;
  summary?: string;       // One-line summary for previews
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
    imageUrl: djImages.artBattleDecks,
    linkedMixId: 'art-battle-set',
    photos: [
      djImages.spinProfile,
      djImages.spinAction,
      djImages.artBattleSelfie,
      djImages.artBattleDecks,
    ],
    highlights: [
      'High-energy crowd interaction',
      'Multi-genre transitions',
      'Live art + music fusion'
    ],
  },
  {
    id: 'queen-delaware',
    venue: 'Queen',
    location: 'Delaware',
    type: 'Live Set',
    description: 'Full setup performance, house + funk blend. First successful gig after the learning curve.',
    date: 'Late January 2026',
    imageUrl: djImages.queen,
    photos: [
      djImages.queen,
    ],
    highlights: [
      'Full 2-hour set',
      'House + funk fusion',
      'First venue success'
    ],
  },
  {
    id: 'frankie-bradleys',
    venue: "Frankie Bradley's",
    location: 'Philadelphia',
    type: 'Live Set',
    description: 'Wine & Waffles event. Real venue, real crowd, high-energy set with great feedback.',
    date: 'Late March 2026',
    imageUrl: djImages.frankieBradleys,
    photos: [
      djImages.frankieBradleys,
    ],
    highlights: [
      'Booked off a practice video',
      'Real venue experience',
      'Great crowd energy'
    ],
  },
  {
    id: 'private-events',
    venue: 'Private Events',
    location: 'Various',
    type: 'Private',
    description: 'Adaptable sets for house parties and private gatherings. Collaborative DJ environment.',
    imageUrl: djImages.houseParty,
    photos: [
      djImages.houseParty,
      djImages.studio,
    ],
    highlights: [
      'Adaptable vibes',
      'Intimate settings',
      'Collaborative sessions'
    ],
  },
];

// =============================================================================
// JOURNEY POSTS (Season 1 - 30 Entries)
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
    summary: 'Before touching decks, you were already studying vibe, playlists, and transitions — DJing started with taste, not gear',
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
    summary: 'Showed up unprepared for CDJ-only setup, couldn\'t connect laptop, learned harsh reality of DJ environments',
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
    summary: 'Broke down how miscommunication and lack of venue prep caused the issue — importance of asking the right questions',
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
    summary: 'Came prepared with proper setup, executed a full set, gained confidence and validation',
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
    summary: 'Realization that technical compatibility can override musical ability in live environments',
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
    summary: 'Decision to invest in your craft after early failures — turning point moment',
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
    summary: 'Learned CDJs, USB workflow, and real-world DJ expectations from an experienced friend',
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
    summary: 'Redemption arc — returned to original venue prepared and delivered a strong performance',
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
    summary: 'Began organizing music like data — BPM, key, crates, automation mindset',
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
    summary: 'Expanded into scripting and structuring music workflows for efficiency and consistency',
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
    summary: 'Struggled with Serato, audio routing, interface vs controller confusion',
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
    summary: 'Learned gain staging — turning point in understanding sound flow',
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
    summary: 'Explored DJ software ecosystems and limitations (especially streaming vs owned music)',
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
    summary: 'Realized reliability and independence of USB workflows in real environments',
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
    summary: 'Observed etiquette, mindset, and how DJs interact and respect each other',
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
    summary: 'Using industry language (Serato, Rekordbox, CDJs) builds instant credibility',
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
    summary: 'Initial tension with DJ turned into respect through conversation and curiosity',
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
    summary: 'Consistent gigs helped build confidence, adaptability, and repetition',
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
    summary: 'Learned how sound engineers, venues, and systems impact performance',
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
    summary: 'Networking led to a real opportunity — first step into consistent bookings',
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
    summary: 'Leveraged existing connection to gain insight on professional DJing and portfolio building',
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
    summary: 'Learned importance of having a professional DJ presence and materials',
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
    summary: 'Bluetooth delay issue revealed importance of proper audio monitoring',
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
    summary: 'Used auto-mixing and playlists to subconsciously train transition skills',
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
    summary: 'Reinforces redundancy mindset — USBs, gear, contingencies',
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
    summary: 'Shift from technical perfection to reading and controlling crowd energy',
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
    summary: 'Emerging style: soulful house, funk, groove-driven sets',
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
    summary: 'Full-circle moment — reconnecting with music on a deeper level',
    published: true,
  },
  // NEW ENTRIES
  {
    id: 'djing-is-physical',
    number: 29,
    title: 'The Night I Learned DJing Is Physical (Energy, Breaks, Endurance)',
    date: 'Late March 2026',
    phase: 'Skill',
    tags: ['Performance', 'Insight', 'Reality'],
    coreFocus: 'Energy management',
    summary: 'Third SPiN set revealed that DJing is endurance — energy drops, your set drops',
    moment: `This was my third time DJing at SPiN.

At this point, I felt way more comfortable. Transitions were smoother, song selection was landing, and I could actually feel the room.

But about two hours in… I felt it.

My energy started dropping.

Not mentally — physically.`,
    whatHappened: `DJing isn't just standing there pressing buttons.

You're:
• constantly listening
• adjusting EQ
• planning next tracks
• reading the crowd
• staying in rhythm

And doing that for hours straight is different.

I also realized something funny mid-set: "I need a bathroom break… but I can't just leave."

There's no pause button in a live set.`,
    realization: `Two big realizations hit me that night:

1. Energy management is part of DJing
   • caffeine helps
   • pacing matters
   • you can't burn out early

2. You need "buffer songs"
   • longer tracks
   • safe grooves
   • songs that give you 2–3 minutes to step away if needed`,
    whatChanged: `Now I'm thinking about my sets differently:
• plan energy in waves (not just bangers)
• include "breathing room" tracks
• prep for real-life needs (breaks, resets)
• treat DJing like endurance, not just performance`,
    takeaway: "DJing isn't just musical — it's physical. If your energy drops, your set drops.",
    published: true,
  },
  {
    id: 'booked-off-video',
    number: 30,
    title: 'I Got Booked Off a Last-Minute Video (And Almost Missed the Opportunity)',
    date: 'Late March 2026',
    phase: 'Growth',
    tags: ['Story', 'Opportunity', 'Lesson'],
    coreFocus: 'Be ready with content',
    summary: 'Wine & Waffles booking came fast — a random practice video saved the opportunity',
    moment: `A couple days before my SPiN set, I reached out to an event:

Wine & Waffles

Just putting myself out there: "If you need a DJ, I got you."

Didn't think much of it.

Then the day of SPiN… they hit me back.`,
    whatHappened: `We were going back and forth, and she asked:

"Do you have anything I can listen to?"

And instantly I thought: "Damn… I don't have a real DJ portfolio yet."

No EPK. No mix page. No clean way to show my work.

Just vibes and experience.

Luckily… the day before, I randomly recorded a video of myself mixing. Nothing crazy. Just me practicing.

I sent that.

She watched it. We had a good conversation. I got booked.

Just like that.

The event was at Frankie Bradley's in Philly. This was a BIG step up:
• real venue
• real crowd
• real expectations

And it went great. People were rocking with the set, energy was right, and I got solid feedback.

But of course… something went wrong. The CDJ setup:
• headphone monitoring wasn't working properly
• aux situation wasn't what I expected
• couldn't rely fully on USB workflow

If I didn't bring my laptop + controller, I would've been stuck. Again.`,
    realization: `3 huge lessons from one night:

1. Opportunities come fast — be ready
2. Content matters (even rough content)
3. Every venue is different — ALWAYS bring backup gear`,
    whatChanged: `Now I'm locked in on:
• building a real EPK (portfolio)
• recording mixes consistently
• always bringing: controller, laptop, adapters, backup plan`,
    takeaway: "You don't need perfect content — you need something ready. Because opportunities don't wait for you to prepare.",
    published: true,
  },
];

// =============================================================================
// DJ STATS
// =============================================================================

export const djStats = {
  totalEvents: 12,              // Count of all gigs
  hoursPlayed: 40,              // Estimate total hours of live performance
  songsInLibrary: 1500,         // Songs in collection
  venuesPlayed: 5,              // Unique venues (SPiN, Queen, Frankie Bradley's, etc.)
  yearsActive: 2,               // Years DJing
  mixesRecorded: djMixes.length,
  journeyPosts: journeyPosts.filter(p => p.published).length,
  genres: ['House', 'Funk', 'Soul', 'Disco', 'Electronic'],
};

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

export const getMixById = (id: string): DJMix | undefined => {
  return djMixes.find(mix => mix.id === id);
};

export const getEventMix = (event: DJEvent): DJMix | undefined => {
  if (!event.linkedMixId) return undefined;
  return getMixById(event.linkedMixId);
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
  Skill: 'bg-cyan-500/20 text-cyan-400',
  Growth: 'bg-emerald-500/20 text-emerald-400',
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
