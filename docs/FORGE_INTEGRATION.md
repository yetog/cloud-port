# The Forge - Integration Guide

> Documentation for integrating apps into The Forge ecosystem.
> Last Updated: 2026-06-09

---

## Overview

**The Forge** is a unified personal growth suite combining multiple pillar apps under a single gamification system powered by Questful Living.

### Pillar Apps
| App | Focus | Port |
|-----|-------|------|
| Zen ToT | Note-taking & organization | 3017 |
| Forge Fit | Workout tracking | 3018 |
| FineLine | Journaling & reflection | 3003 |
| Zen Reset | Meditation & mindfulness | 8081 |
| The Forge Hub | Central dashboard | - |

### Key Concepts
- **Shared User Identity**: All apps share a single `forge_user_id` via localStorage
- **XP System**: Apps report actions to Questful Living API for gamification
- **S3 Multi-tenancy**: User data stored at `users/{user_id}/...` paths

---

## User Identity

### How It Works

All Forge apps share a UUID stored in localStorage under the key `forge_user_id`. Since all apps are served from the same domain (zaylegend.com), they share localStorage and thus the same user identity.

### Implementation

Every pillar app needs a `forgeUser.ts` service:

```typescript
// src/services/forgeUser.ts

const FORGE_USER_KEY = 'forge_user_id';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getForgeUserId(): string {
  let userId = localStorage.getItem(FORGE_USER_KEY);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(FORGE_USER_KEY, userId);
  }
  return userId;
}

export function clearForgeUserId(): void {
  localStorage.removeItem(FORGE_USER_KEY);
}
```

### Session Resumption

When a user opens any Forge app:
1. The app checks for `forge_user_id` in localStorage
2. If found, fetches user's data from S3 using that ID
3. If not found, generates a new UUID and starts fresh

---

## Questful Service Pattern

### API Endpoint
```
POST /questful/api/api/xp/event?user_id={forge_user_id}
```

### Request Body
```json
{
  "app": "fineline",
  "action": "journal_entry",
  "metadata": {
    "entryId": "123",
    "wordCount": 250
  }
}
```

### Response
```json
{
  "success": true,
  "xp_earned": 25,
  "total_xp": 1250,
  "level": 5,
  "level_up": false,
  "message": "Great job journaling!"
}
```

### Implementation Template

```typescript
// src/services/questfulService.ts

import { getForgeUserId } from './forgeUser';

const QUESTFUL_API = '/questful/api/api';

export type AppAction =
  | 'your_action_1'
  | 'your_action_2';

interface XPEventResponse {
  success: boolean;
  xp_earned: number;
  total_xp: number;
  level: number;
  level_up: boolean;
  new_level?: number;
  message: string;
}

class QuestfulService {
  private enabled: boolean = true;

  async recordAction(
    action: AppAction,
    metadata?: Record<string, unknown>
  ): Promise<XPEventResponse | null> {
    if (!this.enabled) return null;

    const userId = getForgeUserId();

    try {
      const response = await fetch(`${QUESTFUL_API}/xp/event?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: 'your_app_name',  // Change this
          action,
          metadata,
        }),
      });

      if (!response.ok) {
        console.warn('[Questful] Failed to record action:', action);
        return null;
      }

      const result: XPEventResponse = await response.json();

      if (result.success) {
        console.log(`[Questful] +${result.xp_earned} XP!`);
        if (result.level_up) {
          console.log(`[Questful] Level up to ${result.new_level}!`);
        }
      }

      return result;
    } catch (error) {
      console.error('[Questful] Error:', error);
      return null;
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const questfulService = new QuestfulService();

// Convenience functions for your app's actions
export const recordYourAction = (param1?: string) =>
  questfulService.recordAction('your_action_1', { param1 });
```

---

## App-Specific Actions

### Zen ToT (Notes)
| Action | XP | Description |
|--------|----|----|
| `note_created` | 15 | New note saved |
| `note_updated` | 5 | Existing note edited |
| `folder_created` | 10 | New folder created |

### FineLine (Reflect)
| Action | XP | Description |
|--------|----|----|
| `journal_entry` | 25 | Journal entry saved |
| `mood_logged` | 10 | Mood recorded |
| `reflection_completed` | 20 | Reflection prompt answered |
| `weekly_review` | 50 | Weekly review completed |
| `monthly_review` | 100 | Monthly review completed |

### Zen Reset (Meditate)
| Action | XP | Description |
|--------|----|----|
| `meditation_completed` | 20-50 | Session completed (varies by duration) |
| `lesson_completed` | 30 | Guided lesson finished |
| `session` | 15 | Generic session logged |

### Forge Fit (Train)
| Action | XP | Description |
|--------|----|----|
| `workout_completed` | 50 | Workout finished |
| `streak_maintained` | 25 | Streak day added |
| `personal_record` | 75 | PR achieved |

---

## S3 Data Structure

User data is stored in S3 with user ID as a prefix:

```
{bucket}/
├── users/
│   └── {forge_user_id}/
│       ├── zen-tot/
│       │   ├── notes/
│       │   ├── folders/
│       │   └── tags.json
│       ├── fineline/
│       │   └── entries/
│       ├── zen-reset/
│       │   └── sessions/
│       └── forge-fit/
│           └── workouts/
```

### Sync Service Pattern

Apps with S3 sync should include `user_id` in all API calls:

```typescript
const getUserIdParam = () => `user_id=${encodeURIComponent(getForgeUserId())}`;

// Example usage
const response = await fetch(`${BACKEND_URL}/api/sync/notes/${noteId}?${getUserIdParam()}`, {
  method: 'PUT',
  body: JSON.stringify(note),
});
```

---

## Adding a New Pillar App

1. **Create forgeUser.ts** - Copy the template above
2. **Create questfulService.ts** - Define your app's actions
3. **Update Questful config** - Register app actions in Questful Living backend
4. **Integrate XP calls** - Add to your app's key actions (save, complete, etc.)
5. **Test user isolation** - Verify data stays separated by user ID

### Checklist
- [ ] `src/services/forgeUser.ts` created
- [ ] `src/services/questfulService.ts` created with app-specific actions
- [ ] Key user actions call questfulService
- [ ] API calls include `user_id` parameter
- [ ] App registered in The Forge Hub
- [ ] XP values configured in Questful backend

---

## The Forge Hub API

### Endpoints Used by Hub

```
GET  /questful/api/api/stats?user_id=X      # User stats overview
GET  /questful/api/api/profile?user_id=X    # Full user profile
GET  /questful/api/api/daily?user_id=X      # Daily quests
POST /questful/api/api/xp/event?user_id=X   # Record XP event
```

### ForgeStats Response
```typescript
interface ForgeStats {
  user_id: string;
  level: number;
  total_xp: number;
  xp_to_next: number;
  progress_percent: number;
  streak_days: number;
  completed_today: number;
  app_summaries: {
    [appName: string]: {
      events: number;
      xp: number;
    };
  };
}
```

---

## Files Reference

| App | forgeUser.ts | questfulService.ts |
|-----|--------------|-------------------|
| Zen ToT | `apps/testing/zen-tot/src/services/forgeUser.ts` | `apps/testing/zen-tot/src/services/questfulService.ts` |
| FineLine | `apps/fineline/src/services/forgeUser.ts` | `apps/fineline/src/services/questfulService.ts` |
| Zen Reset | `dist/zen-reset/src/services/forgeUser.ts` | `dist/zen-reset/src/services/questfulService.ts` |
| Forge Fit | `apps/forge-fit/src/services/forgeUser.ts` | `apps/forge-fit/src/services/questfulService.ts` |
| The Forge Hub | `apps/the-forge/src/services/forgeUser.ts` | `apps/the-forge/src/services/questfulApi.ts` |

---

## Troubleshooting

### User ID Not Shared
- Ensure all apps are served from same domain (zaylegend.com)
- Check localStorage key is exactly `forge_user_id`
- Verify no typos in key name

### XP Not Recording
- Check browser console for Questful errors
- Verify Questful Living API is running
- Ensure action type is registered in Questful backend

### Data Not Syncing
- Check `user_id` parameter is included in API calls
- Verify S3 bucket permissions
- Check sync service is enabled

---

## Related Documentation

- [TESTING_APP_DEPLOYMENT.md](./TESTING_APP_DEPLOYMENT.md) - Deploying new apps
- [CLAUDE.md](../CLAUDE.md) - Main project documentation
