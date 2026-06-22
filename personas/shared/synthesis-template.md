# Synthesis Template

> Use this template at the end of significant work to capture learnings.

---

## When to Write Synthesis

Write a synthesis when you:
- Complete a multi-step task
- Fix a non-trivial bug
- Deploy something new
- Encounter and solve an unexpected issue
- Learn something that should be remembered

**Skip synthesis for:** Simple queries, single-file edits, status checks.

---

## Synthesis Format

```markdown
## Session Synthesis

**Date:** YYYY-MM-DD
**Agent:** {Infrastructure Engineer | Portfolio Curator | Code Reviewer}
**Task:** {Brief description of what was requested}

### Completed
- {What was accomplished}
- {Key changes made}

### Issues Encountered
- {Problems hit during the work}
- {How they were resolved}

### Insights

#### New Gotchas
{Things that broke or almost broke - add to gotchas.md}
- **Title:** {Short name}
  - **What happened:** {Description}
  - **Prevention:** {How to avoid in future}

#### Pattern Improvements
{Better ways to do things discovered}
- {Pattern name}: {Improvement}

#### Knowledge Gaps
{Things the agent didn't know but should}
- {Topic}: {What should be documented}

### Recommendations
- {Suggested follow-up actions}
- {Maintenance tasks identified}
- {Improvements to consider}

### Files Changed
- `{path}` - {what changed}

---
```

---

## Where to Store Synthesis

1. **Session Logs:** `storage/sessions/YYYY-MM-DD-{brief-title}.md`
2. **Extract Gotchas:** Add new gotchas to `storage/knowledge/gotchas.md`
3. **Update Patterns:** If a pattern improved, update relevant knowledge doc

---

## Insight Categories

| Category | Where to Add | Example |
|----------|--------------|---------|
| **Gotcha** | gotchas.md | "git filter-repo breaks dist/" |
| **Deployment Pattern** | deployment-patterns.md | "New way to deploy static apps" |
| **Nginx Pattern** | nginx-conventions.md | "WebSocket proxy config" |
| **Troubleshooting** | troubleshooting.md | "How to fix X error" |
| **Script Usage** | skills-registry.md | "New script added" |

---

## Example Synthesis

```markdown
## Session Synthesis

**Date:** 2026-06-21
**Agent:** Infrastructure Engineer
**Task:** Fix blank page after security remediation

### Completed
- Identified stale index.html pointing to non-existent assets
- Rebuilt portfolio with `npm run build`
- Untracked dist/ from git to prevent recurrence

### Issues Encountered
- `git filter-repo` restored old dist/index.html
- Asset hashes in index.html didn't match actual files

### Insights

#### New Gotchas
- **Title:** Git Filter-Repo Breaks dist/
  - **What happened:** History rewrite restored old index.html
  - **Prevention:** Always `npm run build` after git history operations

#### Knowledge Gaps
- dist/ was tracked in git (shouldn't be)
- Need checklist for git history operations

### Recommendations
- Add pre-flight checklist to gotchas.md
- Consider adding post-deploy verification to deploy.sh

### Files Changed
- `.gitignore` - already had dist/ but wasn't untracked
- `dist/` - removed from git tracking
```

---

## Automated Capture

After writing synthesis, run:
```bash
./scripts/capture-insight.sh "path/to/synthesis.md"
```

This extracts gotchas and updates knowledge base automatically.
