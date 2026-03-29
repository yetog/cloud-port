# DJ Zay EPK Section

> Documentation for the DJ portfolio/EPK section of the website.
> Last Updated: 2026-03-29

---

## Overview

The DJ section is a dedicated Electronic Press Kit (EPK) for DJ Zay, separate from the main portfolio's producer identity. It includes a landing page, mixes, events, a timeline blog ("The Adventures of DJ Zay"), and a booking form.

**Live URLs:**
- Landing: https://zaylegend.com/dj
- Mixes: https://zaylegend.com/dj/mixes
- Events: https://zaylegend.com/dj/events
- Journey: https://zaylegend.com/dj/journey
- Booking: https://zaylegend.com/dj/booking

---

## File Structure

```
src/
├── data/
│   └── dj.ts                 # All DJ data (profile, mixes, events, journey posts)
├── pages/
│   ├── DJ.tsx                # Landing page
│   ├── DJMixes.tsx           # Mixes with audio player
│   ├── DJEvents.tsx          # Events & experience
│   ├── DJJourney.tsx         # Timeline blog (filterable)
│   ├── DJJourneyPost.tsx     # Individual post pages
│   └── DJBooking.tsx         # Booking form
```

---

## Data Structure

### Profile (`djProfile`)
```typescript
{
  name: 'DJ Zay',
  tagline: 'Soulful House. Funk Energy. Real Vibes.',
  subtitle: 'DJ • Producer • Systems Builder',
  bio: string,
  fullBio: string,
  socialLinks: { soundcloud, instagram, spotify }
}
```

### Mixes (`djMixes`)
```typescript
{
  id: string,
  title: string,
  duration: string,
  vibe: 'House' | 'Funk' | 'Chill' | 'Energy' | 'Soulful' | 'Mixed',
  description: string,
  audioUrl?: string,      // S3 URL
  coverUrl?: string,      // S3 URL
  recordedAt?: string,
  featured?: boolean
}
```

**S3 Path:** `portfoliowebsite/dj/mixes/`

### Events (`djEvents`)
```typescript
{
  id: string,
  venue: string,
  location: string,
  type: 'Residency' | 'Live Set' | 'Private' | 'Collaborative',
  description: string,
  date?: string,
  imageUrl?: string       // S3 URL
}
```

**S3 Path:** `portfoliowebsite/dj/events/`

### Journey Posts (`journeyPosts`)
```typescript
{
  id: string,
  number: number,         // Post number (1-28)
  title: string,
  date: string,
  phase: string,          // Foundation, Failure, Win, Insight, etc.
  tags: string[],
  coreFocus: string,
  // Content sections (optional until written)
  moment?: string,
  whatHappened?: string,
  realization?: string,
  whatChanged?: string,
  takeaway?: string,
  nextEntry?: string,
  published?: boolean
}
```

---

## Journey Blog (Season 1)

28 posts documenting the DJ journey from January 2026 to present.

### Phases
| Phase | Color | Description |
|-------|-------|-------------|
| Foundation | Blue | Origin stories, identity |
| Failure | Red | Setbacks, mistakes |
| Reflection | Purple | Looking back, processing |
| Win | Green | Successes, achievements |
| Insight | Yellow | Lessons learned |
| Commitment | Indigo | Investing, dedication |
| Learning | Cyan | Skill development |
| Redemption | Emerald | Comebacks |
| Systems | Violet | Building processes |
| Struggle | Orange | Challenges |
| Breakthrough | Lime | Major discoveries |
| Opportunity | Rose | New doors opening |
| Identity | Purple | Finding your sound |

### Post Format
Each post follows this structure:
1. **The Moment** - Story/scene setting
2. **What Happened** - Breakdown of situation
3. **The Realization** - Key insight
4. **What Changed After** - Actions taken
5. **Takeaway** - Punchy conclusion

---

## Adding Content

### Add a New Mix
Edit `src/data/dj.ts`:
```typescript
{
  id: 'mix-slug',
  title: 'Mix Title',
  duration: '45:00',
  vibe: 'House',
  description: 'Description here',
  audioUrl: `${S3_DJ_URL}/mixes/mix-slug.mp3`,
  coverUrl: `${S3_DJ_URL}/covers/mix-slug.jpg`,
}
```

Upload files to S3:
- Audio: `portfoliowebsite/dj/mixes/mix-slug.mp3`
- Cover: `portfoliowebsite/dj/covers/mix-slug.jpg`

### Add a New Event
```typescript
{
  id: 'event-slug',
  venue: 'Venue Name',
  location: 'City',
  type: 'Live Set',
  description: 'Event description',
  imageUrl: `${S3_DJ_URL}/events/event-slug.jpg`,
}
```

### Write a Journey Post
Find the post in `journeyPosts` array and add content:
```typescript
{
  id: 'first-gig-failure',
  // ... existing fields
  moment: 'I pulled up thinking I could just plug in and go...',
  whatHappened: 'No aux access. CDJs only. No prep.',
  realization: 'DJing isn\'t about music first... it\'s about compatibility.',
  whatChanged: 'Bought gear, asked better questions, learned CDJs.',
  takeaway: 'If your setup doesn\'t work, your music doesn\'t matter.',
}
```

---

## S3 Asset URLs

Base URL: `https://s3.us-central-1.ionoscloud.com/portfoliowebsite/dj`

| Asset Type | Path |
|------------|------|
| Mixes (audio) | `/mixes/<filename>.mp3` |
| Mix covers | `/covers/<filename>.jpg` |
| Event photos | `/events/<filename>.jpg` |

---

## Booking Form

Currently logs to console. To connect to a backend:

1. **Email service** (e.g., EmailJS, Formspree):
   - Update `handleSubmit` in `DJBooking.tsx`
   - Add API endpoint or service integration

2. **Form data collected:**
   - Name (required)
   - Email (required)
   - Event type (required)
   - Date
   - Location
   - Additional details

---

## Navigation

DJ link added to sidebar at position after "Music":
- Icon: Headphones
- Route: `/dj`
- Highlights when on any `/dj/*` route

---

## Future Enhancements

- [ ] Upload actual mix audio files to S3
- [ ] Upload event photos to S3
- [ ] Write full content for all 28 journey posts
- [ ] Connect booking form to email service
- [ ] Add mix download functionality
- [ ] Add social share buttons to journey posts
- [ ] Add comments/reactions to journey posts
- [ ] Create Season 2 structure

---

## Related Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions |
| `src/components/Sidebar.tsx` | Navigation link |
| `src/data/dj.ts` | All DJ data |
| `docs/DJ_SECTION.md` | This documentation |
