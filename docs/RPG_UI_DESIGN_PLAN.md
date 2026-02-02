# RPG UI Design System Implementation Plan
## Upgrading Your Portfolio with FF7R/Matrix-Inspired Aesthetics

> **Note:** This plan references "Infrastructure & Cloud Consultant" - this has been updated to "Infrastructure & AI Consultant"
> Saved: 2026-01-30 | Status: Pending Review

---

## Executive Summary

This plan transforms your portfolio's visual design from the current light-themed, Apple-inspired aesthetic to a sophisticated dark-mode RPG interface inspired by Final Fantasy VII Remake and The Matrix. The upgrade preserves your professional branding (name, content, structure) while adding gamification elements, enhanced animations, and a modern futuristic feel.

---

## Current State Analysis

### What You Have Now
- **Theme**: Light mode with Apple-inspired design (SF Pro fonts, subtle grays)
- **Colors**: Light background (220 20% 97%), dark text, minimal accent colors
- **Components**: Glass panels, progress bars, carousels, forms
- **Branding**: "Isayah Young-Burke - Infrastructure & AI Consultant"
- **Structure**: Sidebar navigation, Hero, About (with skills), Apps, Projects, Contact, Music

### What We're Upgrading To
- **Theme**: Dark mode with Matrix-green accents
- **Colors**: Near-black background, green primary (#22c55e), gold accents
- **Components**: FF7-style panels with glows, materia indicators, segmented progress bars
- **Visual Effects**: Text glow, border glow, hover animations, grid background
- **Same Content**: Your professional identity stays intact

---

## Implementation Phases

### Phase 1: Design System Foundation
Create the core design tokens and utility classes

**Files to Create:**
- `src/styles/rpg-design-system.css` - Core CSS variables and utility classes

**Files to Modify:**
- `src/index.css` - Update color variables for dark theme
- `tailwind.config.ts` - Add custom colors, animations, shadows

**Key Changes:**
```text
Color System (HSL):
- Primary: 142 76% 45% (Matrix green)
- Background: 0 0% 3% (Near black #080808)
- Card: 0 0% 6% (Elevated surfaces)
- Muted: 0 0% 12% (Secondary content)
- Gold: 45 93% 47% (Achievement/accent)
- Warning: 38 92% 50% (Orange)
- Destructive: 0 72% 51% (Red)

New Utility Classes:
- .ff7-panel - Glass panel with green glow border
- .ff7-header - Section headers with left border
- .text-glow - Glowing text effect
- .hover-lift - Interactive hover animation
- .bg-grid - Subtle grid background pattern
- .progress-segmented - RPG-style segmented progress bar
```

---

### Phase 2: Core RPG Components
Create reusable components matching the design system

**Files to Create:**

1. **`src/components/rpg/FF7Panel.tsx`**
   - Wrapper component for content sections
   - Double-line border with glow effect
   - Optional corner accents
   - Glassmorphism backdrop

2. **`src/components/rpg/MateriaIndicator.tsx`**
   - Diamond-shaped skill level indicators (1-5 scale)
   - Filled slots glow, empty slots are transparent
   - Configurable size (sm/md/lg)

3. **`src/components/rpg/AttributeBar.tsx`**
   - RPG-style stat display
   - 3-letter abbreviation + label + progress + value
   - Segmented progress bar (not smooth gradient)
   - Color variants for different stat types

4. **`src/components/rpg/EquipmentSlot.tsx`**
   - Display active skill/focus areas
   - Icon + name + description + materia level
   - Active/inactive states

5. **`src/components/rpg/SectionHeader.tsx`**
   - Uppercase, tracked text
   - Green left border accent
   - Consistent styling across sections

---

### Phase 3: Update Existing Components

**Sidebar (`src/components/Sidebar.tsx`):**
- Change from `bg-apple-black/90` to new dark theme variables
- Add green accent on active nav items with glow
- Add subtle hover effects with `hover-lift`
- Update text colors for muted foreground

**Hero (`src/components/Hero.tsx`):**
- Add `text-glow` to main heading
- Update button to have glow effect on hover
- Add grid background pattern
- Enhance fade-in animations

**About (`src/components/About.tsx`):**
- Replace standard progress bars with `AttributeBar` component
- Add skill categories with `MateriaIndicator` for mastery levels
- Wrap content in `FF7Panel` component
- Add `SectionHeader` styling

**Apps (`src/components/Apps.tsx`):**
- Update card styling to `ff7-panel`
- Add hover glow effects
- Update tag styling with new color scheme
- Add `hover-lift` to carousel items

**Projects (`src/components/Projects.tsx`):**
- Convert cards to `FF7Panel` style
- Add category icons with glow
- Update filter buttons with new styling
- Add maintenance badge with new color scheme

**Contact (`src/components/Contact.tsx`):**
- Wrap form in `FF7Panel`
- Update input styling for dark theme
- Add focus glow on form fields
- Update success/error states

**Music (`src/pages/Music.tsx`):**
- Already has purple/pink theme - consider green variant
- Update player controls with glow effects
- Add FF7Panel to project cards

---

### Phase 4: Enhanced Animations

**Add to Tailwind Config:**
```text
New Keyframes:
- pulse-glow: Subtle pulsing glow effect (2s infinite)
- slide-in-up: Entry animation from bottom
- shimmer: Loading/skeleton animation
- scale-up: Emphasis on interaction

New Animations:
- animate-pulse-glow
- animate-slide-in-up
- animate-shimmer
```

---

### Phase 5: Create Documentation File

**File: `src/styles/DESIGN_SYSTEM.md`**
- Complete specification for the coding agent
- Color palette with HSL values
- Component usage examples
- Animation guidelines
- Accessibility requirements

---

## Technical Specifications

### Updated Color Variables (`src/index.css`)
```css
:root {
  /* RPG Dark Theme */
  --background: 0 0% 3%;
  --foreground: 0 0% 98%;
  --card: 0 0% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 142 76% 45%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 10%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 12%;
  --muted-foreground: 0 0% 60%;
  --accent: 0 0% 12%;
  --accent-foreground: 142 76% 55%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --border: 142 76% 45% / 0.2;
  --input: 0 0% 10%;
  --ring: 142 76% 45%;
  --radius: 0.75rem;

  /* Extended Palette */
  --gold: 45 93% 47%;
  --warning: 38 92% 50%;
  --success: 142 76% 45%;
}
```

### New Tailwind Extensions (`tailwind.config.ts`)
```text
colors:
  - gold: 'hsl(45, 93%, 47%)'
  - warning: 'hsl(38, 92%, 50%)'

boxShadow:
  - glow: '0 0 20px hsl(var(--primary) / 0.3)'
  - glow-strong: '0 0 30px hsl(var(--primary) / 0.5)'
  - inner-glow: 'inset 0 0 20px hsl(var(--primary) / 0.1)'

animation:
  - pulse-glow: 'pulse-glow 2s ease-in-out infinite'
  - slide-in-up: 'slide-in-up 0.4s ease-out'

keyframes:
  - pulse-glow: { 0%, 100%: opacity 1, 50%: opacity 0.6 }
  - slide-in-up: { from: translateY(20px) opacity 0, to: translateY(0) opacity 1 }
```

---

## Component Architecture

### FF7Panel Component
```text
Props:
- children: ReactNode
- title?: string (renders SectionHeader)
- className?: string
- variant?: 'default' | 'highlight' | 'muted'
- withCorners?: boolean (decorative corner brackets)

Structure:
<div className="ff7-panel">
  {title && <SectionHeader>{title}</SectionHeader>}
  {children}
</div>
```

### MateriaIndicator Component
```text
Props:
- filled: number (0-5)
- total?: number (default 5)
- size?: 'sm' | 'md' | 'lg'
- color?: 'primary' | 'gold' | 'blue'

Renders:
- Row of diamond shapes
- Filled = solid color + glow
- Empty = transparent + border
```

### AttributeBar Component
```text
Props:
- abbr: string (3-letter code like "STR")
- label: string (full name)
- value: number (0-100)
- displayValue?: string (override display)
- color?: 'primary' | 'gold' | 'blue' | 'red'

Layout:
[ABBR] [Label........] [████████░░░░] [Value]
```

---

## Files Summary

### New Files (7)
1. `src/styles/rpg-design-system.css`
2. `src/styles/DESIGN_SYSTEM.md`
3. `src/components/rpg/FF7Panel.tsx`
4. `src/components/rpg/MateriaIndicator.tsx`
5. `src/components/rpg/AttributeBar.tsx`
6. `src/components/rpg/EquipmentSlot.tsx`
7. `src/components/rpg/SectionHeader.tsx`

### Modified Files (9)
1. `src/index.css` - Color variables + utility classes
2. `tailwind.config.ts` - Extended theme
3. `src/components/Sidebar.tsx` - Dark theme + glow
4. `src/components/Hero.tsx` - Text glow + grid bg
5. `src/components/About.tsx` - RPG skill bars
6. `src/components/Apps.tsx` - FF7 panels
7. `src/components/Projects.tsx` - FF7 panels
8. `src/components/Contact.tsx` - Dark form styling
9. `src/pages/Music.tsx` - Green theme variant

---

## Implementation Order

1. Foundation first (CSS variables + Tailwind config)
2. Create RPG component library
3. Update Sidebar and Hero (immediate visual impact)
4. Update About section with skill bars
5. Update Apps and Projects cards
6. Update Contact form
7. Update Music page
8. Create documentation file
9. Test all pages and interactions

---

## Preserved Elements

Your branding remains completely intact:
- Name: "Isayah Young-Burke"
- Title: "Infrastructure & AI Consultant" *(corrected)*
- Content: All apps, projects, skills, music data
- Structure: Same page layout and navigation
- Functionality: All interactions work the same

Only the visual presentation changes to the RPG aesthetic.
