# Carousel Layout Issue - Brainstorm Document

> Created: 2026-03-16
> Status: Pending - To be addressed later

---

## Problem Documentation

### The Issue
Left edge of **Featured Apps** and **Projects** carousels is being clipped/cut off by the sidebar area.

### Current Architecture
```
┌─────────────────────────────────────────────────┐
│ Viewport (100vw)                                │
│ ┌────┐ ┌─────────────────────────────────────┐  │
│ │Side│ │ Main Content                        │  │
│ │bar │ │ ┌─────────────────────────────────┐ │  │
│ │64px│ │ │ Container (centered)            │ │  │
│ │    │ │ │ ┌─────────────────────────────┐ │ │  │
│ │    │ │ │ │ Carousel                    │ │ │  │
│ │    │ │ │ │ [CLIPPED]│Card│Card│Card│   │ │ │  │
│ │    │ │ │ └─────────────────────────────┘ │ │  │
│ └────┘ └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### What We Tried (All Failed)
| Attempt | Result |
|---------|--------|
| `md:ml-16` on main | Carousel still clipped |
| `md:pl-16` on main | Carousel still clipped |
| Remove `mx-auto` from containers | Broke centered layout, content hugged left |
| Add `px-1` to Carousel wrapper | Not enough buffer |
| `overflow-x-hidden` on wrapper | Doesn't fix root cause |

### Root Cause (Best Guess)
The shadcn Carousel component (`carousel.tsx:163`) has:
```tsx
className={cn("flex", "-ml-4", ...)}  // Negative margin pulls content LEFT
```
Combined with `overflow-hidden` on the parent, the left edge gets clipped.

---

## Brainstorm: Potential Solutions

### Option A: Fix the Carousel Component
Modify `carousel.tsx` to remove or offset the `-ml-4` internally.
- **Pros**: Fixes at the source
- **Cons**: May break carousel spacing/gaps

### Option B: Wrapper with Overflow Visible
Wrap Carousel in a div with `overflow-visible` to prevent clipping.
- **Pros**: Non-invasive
- **Cons**: May cause horizontal scroll

### Option C: First-Item Padding
Add extra left padding/margin to the first CarouselItem only.
- **Pros**: Targeted fix
- **Cons**: Hacky, affects first item width

### Option D: Remove Sidebar Offset Entirely
Let the sidebar overlay content (it already has backdrop). Content stays full-width.
- **Pros**: Simpler layout, no offset math needed
- **Cons**: Content partially hidden behind collapsed sidebar

### Option E: CSS Grid Layout
Restructure entire page with CSS Grid:
```css
.layout { display: grid; grid-template-columns: 64px 1fr; }
```
- **Pros**: Proper layout system, no margin/padding hacks
- **Cons**: Major refactor

---

## Related Files
- `src/pages/Index.tsx` - Main layout wrapper
- `src/components/Sidebar.tsx` - Fixed sidebar (w-16 collapsed, w-64 expanded)
- `src/components/Apps.tsx` - Featured Apps carousel
- `src/components/Projects.tsx` - Projects carousel
- `src/components/ui/carousel.tsx` - shadcn carousel component (embla-based)

## Notes
- Issue is most visible on medium-width screens where max-w-6xl approaches available space
- Contact form doesn't have issue because it's narrower (max-w-3xl)
- The sidebar defaults to collapsed state (w-16 = 64px)
