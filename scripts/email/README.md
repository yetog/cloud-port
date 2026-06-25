# Email Scripts

Professional email tools with dark-themed styling.

## Quick Reference

### Simple Text Email
```bash
./send-email.py user@email.com "Subject" "Plain text message"
```

### Styled HTML Email (3 ways)

**1. Quick one-liner:**
```bash
./send-styled-email.py user@email.com "Subject" --quick "Name" "Intro line" "Body text" "Closing"
```

**2. From HTML file:**
```bash
./send-styled-email.py user@email.com "Subject" --file /path/to/content.html
```

**3. Interactive compose:**
```bash
./send-styled-email.py user@email.com "Subject" --compose
```

## Directory Structure

```
scripts/email/
├── send-email.py           # Simple email sender
├── send-styled-email.py    # Professional styled emails
├── templates/
│   └── professional-dark.html   # Base template + component library
└── examples/
    └── patch-night-aryan.html   # Reference example
```

## Component Library

Copy these into your email content:

### Section Block (Purple Header)
```html
<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #2d2d44;">
  <h2 style="color: #a855f7; font-size: 20px; margin: 0 0 20px 0;">TITLE</h2>
  <p style="color: #a3a3a3;">Content...</p>
</div>
```

### Highlight Box (Purple Gradient)
```html
<div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #4c1d95;">
  <h2 style="color: #c4b5fd; font-size: 20px; margin: 0 0 16px 0;">⭐ IMPORTANT</h2>
  <p style="color: #e9d5ff;">Content...</p>
</div>
```

### Action Box (Blue)
```html
<div style="background: #0c4a6e; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #0369a1;">
  <h2 style="color: #7dd3fc; font-size: 20px; margin: 0 0 20px 0;">📋 NEXT STEPS</h2>
  <p style="margin: 0; color: #bae6fd;">☐ Task one</p>
  <p style="margin: 0; color: #bae6fd;">☐ Task two</p>
</div>
```

### Buttons
```html
<!-- Purple -->
<a href="URL" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">
  🎵 Button Text
</a>

<!-- Orange/Pink -->
<a href="URL" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">
  🎨 Button Text
</a>

<!-- GitHub Style -->
<a href="URL" style="display: inline-block; background: #21262d; color: #d4d4d4; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-size: 13px; border: 1px solid #30363d;">
  📦 repo-name
</a>
```

### Checkmarks
```html
<span style="color: #22c55e;">✓</span> <span style="color: #a3a3a3;">Completed item</span><br>
<span style="color: #22c55e;">✓</span> <span style="color: #a3a3a3;">Another item</span>
```

## Colors

| Use | Color | Hex |
|-----|-------|-----|
| Primary (purple) | `#a855f7` | Headers, links |
| Success (green) | `#22c55e` | Checkmarks |
| Warning (orange) | `#f97316` | Attention |
| Info (blue) | `#7dd3fc` | Actions |
| Text (light) | `#d4d4d4` | Body text |
| Text (muted) | `#a3a3a3` | Secondary |
| Text (dim) | `#737373` | Subtle |
| Background | `#0a0a0a` | Main |
| Card bg | `#171717` | Cards |
