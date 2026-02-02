# Owner Action Checklist

> Things for Zay to do - Claude will update this as tasks arise
> Last Updated: 2026-01-30

---

## Pending Actions

### High Priority

- [ ] **Upload music tracks to S3** - Upload actual tracks to IONOS object storage for the music player
  - Make bucket publicly accessible for streaming
  - Update `src/data/music.ts` with track URLs

- [ ] **Add custom app images** - Replace placeholder images in `src/config/assets.ts`
  - Testing apps all use `zenReset` placeholder
  - Upgrading apps all use `zenReset` placeholder

### Medium Priority

- [ ] **Review RPG UI Design Plan** - Saved at `docs/RPG_UI_DESIGN_PLAN.md`
  - Decide if/when to implement
  - Note: Title has been corrected to "AI Consultant"

- [ ] **Configure GitHub Actions secrets** - For CI/CD auto-deploy
  - `SERVER_HOST` - Your server IP
  - `SERVER_USER` - SSH user
  - `SERVER_SSH_KEY` - Private key for deployment

### Low Priority

- [ ] **Add portfolio content**
  - Cloud Infrastructure projects
  - Art Curation entries
  - Audio Engineering projects/events

---

## Completed Actions

- [x] **Session 2026-01-30 (Earlier)**
  - Changed "Cloud Consultant" to "AI Consultant"
  - Added app category system (23 apps)
  - Created Music section with /music page
  - Set up CI/CD, backup, and deploy scripts
  - Updated documentation (CLAUDE.md)

---

## Notes

This file is updated by Claude during sessions. Check it at the start of each session for pending tasks.
