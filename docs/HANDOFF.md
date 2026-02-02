# Agent Handoff Document

> Last Updated: 2026-01-31
> Purpose: Comprehensive context for agents continuing work on this portfolio

---

## Quick Start

```bash
# Navigate to project
cd /var/www/zaylegend

# Key commands
npm run dev          # Start dev server
npm run build        # Production build
./scripts/deploy.sh  # Deploy to production

# View current session
cat sessions/2026-01-31-session.md

# View roadmap
cat PORTFOLIO_ROADMAP.md
```

---

## Completed Work (2026-01-31)

### Portfolio Pages
- **Services Page** - Created with 11 services in 4 categories (Cloud, AI, DevOps, Creative)
- **Blog Page** - Created with search, filtering, and 6 sample posts
- **Blog Post Page** - Individual post view with navigation
- **Routes Updated** - /services, /blog, /blog/:postId
- **Navigation Updated** - Sidebar includes Services and Blog links

### Chord Genesis Enhancements
- **City Pop Bounce Genre** - Japanese city pop with house, funk, R&B bounce
- **New Genres Added** - House, Funk, Neo Soul
- **Duration Options** - Expanded up to 5 minutes
- **New Type Definitions** - Energy levels, groove types, drum styles, beat drops
- **Docker Restarted** - Changes are live

---

## Pending Work Items

### Priority 1: Chord Genesis Advanced Features

**Suggested structure for services.ts:**
```typescript
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  category: 'cloud' | 'ai' | 'infrastructure' | 'consulting';
}

export const services: Service[] = [
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description: 'AWS, Azure, GCP setup and optimization',
    icon: 'Cloud',
    features: ['Migration', 'Cost Optimization', 'Security'],
    category: 'cloud'
  },
  // Add more services...
];
```

**Update required:**
- Add route to `src/App.tsx`: `<Route path="/services" element={<Services />} />`
- Add nav link to `src/components/Sidebar.tsx`

#### Create Blog Page
**Why:** User needs a blog for content marketing
**Files to create:**
- `src/pages/Blog.tsx` - Blog listing
- `src/pages/BlogPost.tsx` - Individual post view
- `src/data/blog.ts` - Blog posts data

---

### Priority 2: Testing Apps 404 Fix

**Issue:** Some testing apps return 404 on direct URL access
**Root Cause:** SPA routing not configured properly in nginx

**Fix for nginx (`/etc/nginx/conf.d/portfolio.conf`):**
```nginx
# For each testing app, add try_files directive
location /darkflow/ {
    proxy_pass http://127.0.0.1:3010/;
    # ... existing headers ...

    # Add SPA fallback if needed
    proxy_intercept_errors on;
    error_page 404 = /darkflow/index.html;
}
```

**Alternative:** Ensure each Docker app serves index.html for all routes

---

### Priority 3: Chord Genesis Enhancements

**Location:** `/var/www/zaylegend/apps/chord-genesis/`

#### A. Add New Genre (Japanese City Pop Bounce)
**File:** `src/types/music.ts`
```typescript
// Add to MUSIC_GENRES array:
{
  name: 'City Pop Bounce',
  degrees: [0, 3, 5, 4],
  bpmRange: [100, 120],
  preferredScale: 'major',
  color: 'from-pink-400 to-purple-500'
}
```

**File:** `src/components/ElevenLabsPanel.tsx`
```typescript
// Add to musicStyles array:
{
  id: 'citypop',
  name: 'City Pop Bounce',
  description: 'House, funk, hip-hop, R&B with Japanese city pop influence',
  color: 'from-pink-400 to-purple-500',
  bpmRange: [100, 120]
}
```

#### B. Square Enix / FF7 Styling
Apply these CSS classes from the portfolio:
- `ff7-panel` - RPG-style panels
- `text-glow` - Glowing text effects
- `glass-panel` - Frosted glass effect

**Add sound effects:**
```typescript
// Create src/hooks/useSoundEffects.ts
const playClick = () => { /* Web Audio API beep */ };
const playSuccess = () => { /* FF7-style success chime */ };
const playGenerate = () => { /* Generation start sound */ };
```

#### C. Simple/Advanced Mode
**File:** `src/App.tsx`
```typescript
const [isAdvancedMode, setIsAdvancedMode] = useState(false);

// Save preference
useEffect(() => {
  localStorage.setItem('chordGenesisMode', isAdvancedMode ? 'advanced' : 'simple');
}, [isAdvancedMode]);
```

**Simple mode shows:** Key, Scale, Genre, Generate button
**Advanced mode shows:** All current options

#### D. Duration Options
**File:** `src/components/ElevenLabsPanel.tsx`
```typescript
// Expand options:
<option value={180000}>3 minutes</option>
<option value={240000}>4 minutes</option>
<option value={300000}>5 minutes</option>
```

#### E. Energy/Groove Controls
```typescript
// Add to state:
const [energyLevel, setEnergyLevel] = useState<'chill' | 'medium' | 'high' | 'intense'>('medium');
const [grooveType, setGrooveType] = useState<'smooth' | 'bouncy' | 'driving' | 'danceable'>('smooth');
const [beatDrop, setBeatDrop] = useState<'none' | 'subtle' | 'dramatic'>('none');

// Include in prompt generation
```

#### F. Drum Style Options
```typescript
const DRUM_STYLES = [
  { id: 'acoustic', name: 'Acoustic Drums', description: 'Natural drum kit' },
  { id: 'electronic', name: 'Electronic', description: 'Synthesized beats' },
  { id: '808', name: '808s', description: 'Classic hip-hop drums' },
  { id: 'live', name: 'Live Drums', description: 'Human-played feel' },
  { id: 'hybrid', name: 'Hybrid', description: 'Mix of acoustic and electronic' }
];
```

#### G. Audio Playback Flow
1. When generating: Play chord progression loop
2. On completion: Play success sound
3. Auto-switch: Stop chords, play generated audio

---

## Key Files Reference

### Portfolio Main Files
| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes and providers |
| `src/components/Sidebar.tsx` | Navigation |
| `src/data/apps.ts` | App definitions (23 apps) |
| `src/data/projects.ts` | Project data (30+ entries) |
| `src/pages/Index.tsx` | Main landing page |
| `src/pages/Apps.tsx` | Apps showcase |

### Chord Genesis Key Files
| File | Purpose |
|------|---------|
| `apps/chord-genesis/src/App.tsx` | Main component |
| `apps/chord-genesis/src/types/music.ts` | Genre/scale definitions |
| `apps/chord-genesis/src/components/ElevenLabsPanel.tsx` | AI generation |
| `apps/chord-genesis/src/components/EnhancedControls.tsx` | Control panel |
| `apps/chord-genesis/src/hooks/useAudioContext.ts` | Audio playback |

---

## Build & Deploy

### Portfolio
```bash
cd /var/www/zaylegend
npm run build
# Files output to /var/www/zaylegend/dist/
```

### Chord Genesis
```bash
cd /var/www/zaylegend/apps/chord-genesis
npm run build
# Rebuild Docker container
docker-compose up -d --build
```

### Nginx Reload
```bash
sudo nginx -t          # Test config
sudo nginx -s reload   # Apply changes
```

---

## UI/UX/QA Checklist (Pending)

### Functionality Validation
- [ ] All navigation links work
- [ ] Apps page loads all 3 categories
- [ ] Music page audio player works
- [ ] Project detail pages load
- [ ] Contact form submits

### UI Review
- [ ] Consistent color scheme
- [ ] Proper spacing and alignment
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark/light theme toggle works
- [ ] Sound toggle works

### Accessibility
- [ ] Color contrast ratios
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Focus indicators
- [ ] Alt text for images

### Suggested Enhancements
- Subtle hover animations
- Page transition effects
- Loading skeletons
- Micro-interactions
- Performance optimization

---

## Docker Reference

### Running Containers
```
chord-genesis       -> port 3001
fineline           -> port 3003
game-hub           -> port 3004
dj-visualizer      -> port 3005
spritegen          -> port 3006
voice-assistant    -> port 3007
contentforge       -> port 3009
darkflow           -> port 3010
gmat-mastery       -> port 3012
losk               -> port 3013
got-hired-ai       -> port 3014
zen-reset          -> port 8081
```

### Common Docker Commands
```bash
docker ps                           # List containers
docker logs <container>             # View logs
docker restart <container>          # Restart
docker-compose up -d --build        # Rebuild
```

---

## Contact Context

**Owner:** Isayah Young-Burke
**Role:** Infrastructure & AI Consultant
**Domain:** zaylegend.com
**GitHub:** github.com/yetog

---

## Session Logs Location
`/var/www/zaylegend/sessions/`

Previous session: `2026-01-30-session.md`
Current session: `2026-01-31-session.md`
