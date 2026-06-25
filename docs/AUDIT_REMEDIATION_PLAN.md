# Portfolio Audit Remediation Plan

> **Created:** 2026-06-25
> **Author:** Claude (AI Assistant)
> **Purpose:** Complete remediation plan for portfolio website audit
> **Status:** Ready for execution

---

## Overview

This document contains all fixes needed from the 2026-06-25 website audit. Each section can be executed independently. Check off items as completed.

**Priority Levels:**
- P0: Broken/blocking - fix immediately
- P1: Important - fix this week
- P2: Enhancement - fix when time permits
- P3: Nice to have - backlog

---

## Section 1: Broken Apps (P0)

### 1.1 Darkflow Mind Mapper - Blank Screen

**Problem:** App shows blank screen, likely missing base path for subdirectory deployment.

**Files to check/fix:**
```
/var/www/zaylegend/apps/staging/darkflow-mind-mapper/
├── vite.config.ts      # Add: base: '/darkflow/'
├── src/main.tsx        # Check BrowserRouter basename
└── package.json        # Verify build script
```

**Steps:**
1. Check if app has base path configured:
   ```bash
   grep -r "base:" apps/staging/darkflow-mind-mapper/vite.config.ts
   grep -r "basename" apps/staging/darkflow-mind-mapper/src/
   ```

2. If missing, add to `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/darkflow/',
     // ... rest of config
   })
   ```

3. If using React Router, update `main.tsx` or `App.tsx`:
   ```typescript
   <BrowserRouter basename="/darkflow">
   ```

4. Rebuild and test:
   ```bash
   cd apps/staging/darkflow-mind-mapper
   npm install && npm run build
   docker-compose up -d --build
   ```

5. Verify at: https://zaylegend.com/darkflow/

---

### 1.2 Prompted Pixels - 404 Error

**Problem:** App returning 404, may not be deployed or directory missing.

**Steps:**
1. Check if app exists:
   ```bash
   ls -la apps/*/prompted-pixels 2>/dev/null
   find apps/ -name "*prompted*" -o -name "*pixels*"
   ```

2. Check nginx config for route:
   ```bash
   grep -r "prompted" /etc/nginx/conf.d/
   ```

3. If app exists but not deployed:
   ```bash
   cd apps/staging/prompted-pixels  # or wherever it is
   npm install && npm run build
   # Add nginx location block if missing
   ```

4. If app doesn't exist, remove from any references or mark as archived.

5. Check `src/data/apps.ts` and remove if not available:
   ```typescript
   // Remove or comment out prompted-pixels entry
   ```

---

### 1.3 Portfolio GitHub Connection

**Problem:** Need to verify portfolio is connected to correct GitHub repo and changes sync properly.

**Steps:**
1. Verify remote:
   ```bash
   cd /var/www/zaylegend
   git remote -v
   # Should show: git@github.com:yetog/cloud-port.git
   ```

2. Check for uncommitted changes:
   ```bash
   git status
   ```

3. Verify push/pull works:
   ```bash
   git fetch origin main
   git log HEAD..origin/main --oneline  # commits to pull
   git log origin/main..HEAD --oneline  # commits to push
   ```

4. If remote is wrong:
   ```bash
   git remote set-url origin git@github.com:yetog/cloud-port.git
   ```

---

## Section 2: Apps Needing Configuration (P1)

### 2.1 Voice Assistant - API Key Swap

**Location:** `/var/www/zaylegend/apps/production/voice-assistant/`

**Steps:**
1. Find environment file:
   ```bash
   ls -la apps/production/voice-assistant/.env*
   cat apps/production/voice-assistant/.env.example
   ```

2. Update API key in `.env`:
   ```bash
   # Edit the file with correct API key
   nano apps/production/voice-assistant/.env
   # Or
   echo "OPENAI_API_KEY=sk-your-new-key" > apps/production/voice-assistant/.env
   ```

3. Restart container:
   ```bash
   cd apps/production/voice-assistant
   docker-compose down && docker-compose up -d
   ```

4. Test at: https://zaylegend.com/voice-assistant/

---

### 2.2 FineLine - Connect to S3

**Location:** `/var/www/zaylegend/apps/production/fineline/`

**Steps:**
1. Check current asset configuration:
   ```bash
   grep -r "s3\|S3\|ionos" apps/production/fineline/src/
   ```

2. Add S3 config if needed. Create or update `src/config/assets.ts`:
   ```typescript
   const S3_BASE = 'https://s3.us-central-1.ionoscloud.com/portfoliowebsite';

   export const getAssetUrl = (path: string) => `${S3_BASE}/${path}`;
   ```

3. Update image references to use S3 URLs.

4. Rebuild:
   ```bash
   cd apps/production/fineline
   npm run build
   docker-compose up -d --build
   ```

---

### 2.3 Knowledge Base - Sync with PDFs/Notion

**Location:** `/var/www/zaylegend/apps/production/knowledge-base/`

**Goal:** Integrate with PDFs and Notion for comprehensive knowledge sharing.

**Steps:**
1. Research Notion API integration:
   - Get Notion API key from https://www.notion.so/my-integrations
   - Install Notion SDK: `npm install @notionhq/client`

2. For PDF integration:
   - Option A: Upload PDFs to S3 and link
   - Option B: Use pdf.js for in-browser viewing
   - Option C: Extract text with a backend service

3. Create integration service:
   ```typescript
   // src/services/notion.ts
   import { Client } from '@notionhq/client';

   const notion = new Client({ auth: process.env.NOTION_API_KEY });

   export const fetchNotionPages = async (databaseId: string) => {
     const response = await notion.databases.query({ database_id: databaseId });
     return response.results;
   };
   ```

4. Add reference links section to UI.

---

### 2.4 Sensei AI - Host on Server

**Problem:** App not currently hosted on server.

**Steps:**
1. Check if app exists locally:
   ```bash
   ls -la apps/*/sensei-ai* 2>/dev/null
   find apps/ -iname "*sensei*"
   ```

2. If not on server, clone from GitHub:
   ```bash
   cd apps/staging/
   git clone git@github.com:yetog/sensei-ai.git
   ```

3. Set up deployment:
   ```bash
   cd apps/staging/sensei-ai
   npm install
   npm run build
   ```

4. Create Dockerfile if missing:
   ```dockerfile
   FROM nginx:alpine
   COPY dist /usr/share/nginx/html
   RUN echo 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
   EXPOSE 80
   ```

5. Create docker-compose.yml:
   ```yaml
   version: '3'
   services:
     sensei-ai:
       build: .
       container_name: sensei-ai
       ports:
         - "3020:80"
       restart: unless-stopped
   ```

6. Add nginx location block:
   ```nginx
   location /sensei-ai/ {
       proxy_pass http://127.0.0.1:3020/;
       proxy_set_header Host $host;
   }
   ```

7. Reload nginx and start container:
   ```bash
   docker-compose up -d
   sudo nginx -s reload
   ```

---

### 2.5 Purple Lotus - Add Web Version

**Problem:** Currently phone-only app, need web browser version.

**Location:** `/var/www/zaylegend/apps/staging/purple-lotus/`

**Steps:**
1. Check if it's a React Native or native app:
   ```bash
   cat apps/staging/purple-lotus/package.json | grep -E "react-native|expo"
   ```

2. If React Native with Expo, add web support:
   ```bash
   cd apps/staging/purple-lotus
   npx expo install react-dom react-native-web @expo/webpack-config
   ```

3. Update app.json for web:
   ```json
   {
     "expo": {
       "platforms": ["ios", "android", "web"]
     }
   }
   ```

4. Build for web:
   ```bash
   npx expo export:web
   ```

5. Deploy the web build to nginx.

---

### 2.6 Cloud LLM Assistant - Upgrade & Host Publicly

**Steps:**
1. Locate the app:
   ```bash
   find apps/ -iname "*llm*" -o -iname "*cloud*assistant*"
   ```

2. Review current state and plan upgrades.

3. Ensure it's accessible without authentication for public viewing.

4. Add to nginx config if not already routed.

---

## Section 3: Apps to Archive/Remove (P2)

### 3.1 Slam OG Studio - Archive

**Steps:**
1. Archive to backups:
   ```bash
   tar -czvf backups/slam-og-studio-archive-$(date +%Y%m%d).tar.gz apps/misc/slam-og-studio/
   ```

2. Remove from active apps:
   ```bash
   rm -rf apps/misc/slam-og-studio/
   ```

3. Remove from `src/data/apps.ts` if listed.

4. Remove from `api/routes/apps.py` registries.

---

### 3.2 Goat Landscaping - Move to Client Projects

**Steps:**
1. Remove from apps collection in `src/data/apps.ts`.

2. Add to projects or create client websites section in `src/data/projects.ts`:
   ```typescript
   {
     id: 'goat-landscaping',
     title: 'GOAT Landscaping',
     description: 'Professional landscaping website for Long Island business',
     category: 'client',
     image: getAssetUrl('projects/goat-landscaping.jpg'),
     tags: ['Client Website', 'Landscaping', 'Business'],
     liveUrl: 'https://goatlandscapeli.com',
   }
   ```

3. Keep in `api/routes/apps.py` APP_DIRS for git tracking, but move to client category.

---

### 3.3 "Apps Being Upgraded" Section - Remove/Update

**Problem:** Section appears outdated on the frontend.

**Steps:**
1. Check `src/pages/Apps.tsx` for the upgrading section.

2. Either:
   - Remove the section entirely, OR
   - Update with current apps actually being upgraded:
     - Ashley-v3
     - Sensei AI IO
     - Ask HR Beta
     - SOP AI Beta

3. Consider hiding apps with `status: 'upgrading'` from public view.

---

## Section 4: Portfolio Content Additions (P1)

### 4.1 Cloud Projects - Add Details/Demos

**File:** `src/data/projects.ts`

**Projects needing content:**
- Enterprise Cloud Migrations
- CI/CD Pipeline Optimization
- Cloud Security Framework
- Next.js Hosting and Development
- Serverless API Platform
- Scalable Web Architecture

**Template for each:**
```typescript
{
  id: 'project-slug',
  title: 'Project Title',
  description: 'Detailed description of the project, challenges solved, and outcomes.',
  category: 'cloud',
  image: getAssetUrl('projects/project-image.jpg'),
  tags: ['AWS', 'Terraform', 'Docker', 'etc'],
  highlights: [
    'Key achievement 1',
    'Key achievement 2',
    'Metrics or results',
  ],
  // Optional
  demoUrl: 'https://demo.example.com',
  caseStudyUrl: '/projects/project-slug',
}
```

**Action:** Owner needs to provide:
- [ ] Real project descriptions
- [ ] Screenshots or diagrams
- [ ] Metrics and outcomes
- [ ] Demo links if available

---

### 4.2 People's Church of Dover - Missing Photo

**Steps:**
1. Upload photo to S3:
   ```bash
   # Upload to: portfoliowebsite/projects/dover-church.jpg
   ```

2. Update `src/data/projects.ts`:
   ```typescript
   {
     id: 'dover-church',
     // ...
     image: getAssetUrl('projects/dover-church.jpg'),
   }
   ```

---

### 4.3 Art Creation Entries

**File:** `src/data/projects.ts`

**Action:** Owner to provide:
- [ ] Art project names
- [ ] Descriptions
- [ ] Images (upload to S3: `portfoliowebsite/projects/art/`)

---

### 4.4 Audio Engineering Entries

**File:** `src/data/projects.ts`

**Action:** Owner to provide:
- [ ] Audio project names
- [ ] Descriptions
- [ ] Audio samples or images
- [ ] Upload to S3: `portfoliowebsite/audio/`

---

## Section 5: DJ Section Enhancements (P1)

### 5.1 Add More Events and Stories

**File:** `src/data/dj.ts`

**Current events:** SPiN, Queen, Frankie Bradley's, Private Events

**To add:** (Owner to provide details)
```typescript
// Add to djEvents array
{
  id: 'new-event-id',
  venue: 'Venue Name',
  location: 'City, State',
  type: 'Live Set',  // or 'Residency', 'Private', 'Collaborative'
  description: 'Description of the event and your role',
  date: 'Month Year',
  imageUrl: `${S3_DJ_URL}/events/venue-name.jpg`,
  photos: [
    `${S3_DJ_URL}/events/venue-name/photo1.jpg`,
    // Add more photos
  ],
  highlights: ['Highlight 1', 'Highlight 2'],
  linkedMixId: 'mix-id-if-applicable',
}
```

---

### 5.2 Add DJ Stats

**File:** `src/data/dj.ts`

**Add stats object:**
```typescript
export const djStats = {
  totalEvents: 25,          // Count of all gigs
  hoursPlayed: 150,         // Estimate total hours
  songsInLibrary: 2000,     // Songs in collection
  venuesPlayed: 8,          // Unique venues
  yearsActive: 2,           // Years DJing
  genres: ['House', 'Funk', 'Soul', 'Disco'],
};
```

**Update DJ page to display stats:**
```typescript
// In src/pages/DJ.tsx, add stats section:
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <StatCard label="Events" value={djStats.totalEvents} />
  <StatCard label="Hours Played" value={djStats.hoursPlayed} />
  <StatCard label="Venues" value={djStats.venuesPlayed} />
  <StatCard label="Years Active" value={djStats.yearsActive} />
</div>
```

---

### 5.3 Add Event Tag/Filter

**Steps:**
1. Add `tags` field to events in `src/data/dj.ts`:
   ```typescript
   tags: ['club', 'art-event', 'private', 'outdoor'],
   ```

2. Create filter component in DJ Events page.

---

## Section 6: UI/UX Improvements (P2)

### 6.1 Services Page - Add Carousel

**File:** `src/pages/Services.tsx` (or wherever services are rendered)

**Steps:**
1. Install carousel component if not available:
   ```bash
   npx shadcn-ui@latest add carousel
   ```

2. Import and use:
   ```typescript
   import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
   } from "@/components/ui/carousel";

   <Carousel>
     <CarouselContent>
       {services.map((service) => (
         <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
           <ServiceCard service={service} />
         </CarouselItem>
       ))}
     </CarouselContent>
     <CarouselPrevious />
     <CarouselNext />
   </Carousel>
   ```

---

### 6.2 Websites Tab - Organize Better

**Options:**
1. **Group by type:** Client sites, Personal projects, Templates
2. **Add filters:** By technology, status, year
3. **Remove if redundant:** If websites are shown elsewhere, remove this tab

**File:** Check `src/pages/Admin.tsx` or wherever websites tab is defined.

---

### 6.3 Contact Page - Add Buy Me Coffee

**File:** `src/pages/Index.tsx` or contact section

**Steps:**
1. Add Buy Me Coffee button:
   ```typescript
   <a
     href="https://www.buymeacoffee.com/YOUR_USERNAME"
     target="_blank"
     rel="noopener noreferrer"
     className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full"
   >
     <Coffee className="w-5 h-5" />
     Buy me a coffee
   </a>
   ```

2. Import Coffee icon from lucide-react.

---

### 6.4 Add Resume/Career Timeline

**Concept:** GitHub contributions-style timeline showing career progression.

**Steps:**
1. Create `src/data/career.ts`:
   ```typescript
   export const careerTimeline = [
     {
       year: 2024,
       title: 'AI Consultant',
       company: 'Freelance',
       highlights: ['Built 25+ apps', 'Cloud migrations'],
     },
     // ... more entries
   ];
   ```

2. Create `src/components/CareerTimeline.tsx`:
   ```typescript
   // Render a visual timeline with expandable entries
   ```

3. Add to About section or create dedicated Resume page.

---

### 6.5 Connect Services to Business Page

**Steps:**
1. Identify business page URL (LinkedIn, Google Business, etc.)
2. Add links in Contact section
3. Consider adding a "Work With Me" CTA that links to booking/consultation

---

## Section 7: Testing Apps (P2)

### 7.1 DJ Visualizer - Test

**URL:** https://zaylegend.com/dj-visualizer/ or port 3005

**Test checklist:**
- [ ] Page loads without errors
- [ ] Visualizer responds to audio
- [ ] Controls work (play, pause, etc.)
- [ ] Mobile responsive

---

### 7.2 Zen Reset - Finish

**Location:** `/var/www/zaylegend/apps/production/zen-reset/`

**Steps:**
1. Review current state
2. Identify missing features
3. Complete implementation
4. Test thoroughly
5. Update app status to 'finished' in `src/data/apps.ts`

---

### 7.3 BH AI 79 - Define Direction

**Location:** `/var/www/zaylegend/apps/staging/bh-ai-79/`

**Questions to answer:**
1. What is the core purpose of this app?
2. What features are complete?
3. What's needed for production?

**Once decided:**
1. Document purpose in README
2. Complete remaining features
3. Test thoroughly
4. Move to production when ready

---

### 7.4 Losk - Update Story

**Location:** `/var/www/zaylegend/apps/staging/losk/`

**Steps:**
1. Review current story content
2. Add new chapters/entries
3. Update any placeholder content
4. Test reading experience

---

### 7.5 IONOS Exam Prep - Turn into Course

**Location:** `/var/www/zaylegend/apps/staging/IONOS-Cloud-Exam-Prep/`

**Enhancement plan:**
1. Add structured curriculum
2. Add progress tracking
3. Add quizzes/assessments
4. Add certificate of completion
5. Consider video content

---

### 7.6 Forge Fit - Continue Testing

**Location:** `/var/www/zaylegend/apps/staging/forge-fit/`

**Test checklist:**
- [ ] All features work
- [ ] Data persists correctly
- [ ] Mobile responsive
- [ ] Performance acceptable

---

### 7.7 Zen TOT - Beta Testing

**Location:** `/var/www/zaylegend/apps/staging/zen-tot/`

**Beta testing plan:**
1. Create test user accounts
2. Document test scenarios
3. Gather feedback
4. Fix issues
5. Iterate until stable

---

## Section 8: Music Section Update (P2)

**File:** `src/data/music.ts`

**Current:** PH Pool album with 25 tracks

**To update:**
1. Add any new releases
2. Update streaming links
3. Add album artwork to S3
4. Verify audio URLs work

---

## Section 9: Dashboard Fixes (P1)

### 9.1 Live Update Button

**Status:** API works correctly. If button doesn't work in browser:

**Debug steps:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify HTTPS (not HTTP)
4. Clear cache and hard refresh

**Files involved:**
- Frontend: `src/pages/Admin.tsx` (lines 227-249)
- Backend: `api/routes/apps.py` (POST `/{app_name}/update`)
- Script: `scripts/maintenance/update-app.sh`

---

## Verification Checklist

After completing fixes, verify each section:

### Apps
- [ ] Darkflow loads correctly
- [ ] Prompted Pixels resolved (deployed or removed)
- [ ] Voice Assistant works with new API key
- [ ] FineLine connected to S3
- [ ] Knowledge Base has integration plan
- [ ] Sensei AI hosted on server
- [ ] Purple Lotus has web version

### Content
- [ ] Cloud projects have real content
- [ ] Dover Church has photo
- [ ] Art entries added
- [ ] Audio entries added
- [ ] DJ events updated
- [ ] DJ stats displayed

### UI/UX
- [ ] Services carousel implemented
- [ ] Websites tab organized
- [ ] Buy Me Coffee added
- [ ] Career timeline added

### Dashboard
- [ ] Update button works
- [ ] All 32 apps tracked
- [ ] Push/pull functionality works

---

## Commands Reference

### Check app health
```bash
curl -s https://zaylegend.com/api/apps/health | python3 -m json.tool
```

### Check for updates
```bash
curl -s https://zaylegend.com/api/apps/updates/check | python3 -m json.tool
```

### Update an app
```bash
curl -X POST https://zaylegend.com/api/apps/{app-name}/update
```

### Rebuild portfolio
```bash
cd /var/www/zaylegend
npm run build
```

### Restart nginx
```bash
sudo nginx -t && sudo nginx -s reload
```

### View logs
```bash
docker logs {container-name} --tail 50
```

---

## Notes for Future Agents

1. **Always read CLAUDE.md first** - Contains full project context
2. **Use brain CLI** - `brain status`, `brain apps health`, `brain task list`
3. **Check MCP insights** - Cross-session knowledge stored there
4. **Test after changes** - Always verify fixes work
5. **Commit incrementally** - Small, focused commits
6. **Update documentation** - Keep CLAUDE.md current

---

*This plan was generated from the 2026-06-25 website audit. Update status as items are completed.*
