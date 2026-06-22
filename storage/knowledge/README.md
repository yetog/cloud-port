# Knowledge Base

> Persistent learnings for AI agents. Reference these documents before performing operations.

---

## Documents

| Document | Purpose | When to Reference |
|----------|---------|-------------------|
| [deployment-patterns.md](deployment-patterns.md) | How we deploy apps | Before any deployment |
| [nginx-conventions.md](nginx-conventions.md) | Nginx config patterns | Before editing nginx |
| [troubleshooting.md](troubleshooting.md) | Common issues & fixes | When debugging |
| [gotchas.md](gotchas.md) | Lessons learned | Before major operations |

---

## Quick Reference

### Most Common Operations

| Task | Document | Section |
|------|----------|---------|
| Deploy portfolio | deployment-patterns.md | Standard Portfolio Deployment |
| Add testing app | deployment-patterns.md | Adding a New Testing App |
| Fix blank page | troubleshooting.md | Blank Page (White Screen) |
| Fix 502 error | troubleshooting.md | 502 Bad Gateway |
| Add nginx location | nginx-conventions.md | Pattern 1: Static SPA |

### Pre-Flight Checklists

See `gotchas.md` for:
- Before Deploying New App
- Before Git History Operations
- Before Major Nginx Changes

---

## Contributing

When you learn something new that should be remembered:

1. Identify which document it belongs in
2. Add it with date and context
3. Include the "what happened" and "prevention/fix"

Format:
```markdown
### N. Short Title

**Date Learned:** YYYY-MM-DD

**What Happened:**
- Description of the issue

**Prevention/Fix:**
```bash
# Commands or code
```
```

---

## Usage by Agents

Agents should:
1. Check `gotchas.md` before major operations
2. Reference `deployment-patterns.md` for deploy tasks
3. Reference `nginx-conventions.md` for nginx changes
4. Use `troubleshooting.md` for debugging

The knowledge base grows over time as we learn from issues.
