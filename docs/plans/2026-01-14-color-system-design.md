# DevMap Color System Design

## Overview

This document describes the DevMap brand color palette and design system implemented to give the application a distinctive visual identity.

## Brand Philosophy

DevMap is a DSA (Data Structures & Algorithms) learning platform. The color system reflects:

- **Growth & Progress** - Teal/cyan primary colors evoke growth and forward movement
- **Achievement & Mastery** - Violet/purple for secondary accents represent mastery
- **Rewards & Celebration** - Amber/gold for XP, streaks, and achievements
- **Trust & Professionalism** - Clean, modern aesthetic suitable for learning

## Primary Color Palette

### Brand Primary: Teal/Cyan
```
Light Mode:
- Primary: teal-500 (#14b8a6) to cyan-600 (#0891b2)
- Hover: teal-600 to cyan-700

Dark Mode:
- Primary: teal-400 (#2dd4bf) to cyan-500 (#06b6d4)
```

### Brand Secondary: Violet/Purple
```
Light Mode:
- Secondary: violet-500 (#8b5cf6) to purple-600 (#9333ea)

Dark Mode:
- Secondary: violet-400 to purple-500
```

### Accent: Amber/Gold
```
- XP badges, streaks, achievements
- amber-400 (#fbbf24) to orange-500 (#f97316)
```

### Semantic Colors
```
- Success: emerald-500 (#10b981) - completed tasks, checkmarks
- Warning: amber-500 (#f59e0b) - alerts, pending items
- Error: red-500 (#ef4444) - errors, difficult problems
```

## Color Usage Guidelines

### Progress Elements
- Progress rings: `text-teal-500 dark:text-teal-400`
- Progress bars: `from-teal-500 via-cyan-500 to-teal-600`

### Interactive Elements
- Primary buttons: `from-teal-500 to-cyan-600`
- Hover states: `from-teal-600 to-cyan-700`
- Focus outlines: `rgba(20, 184, 166, 0.5)` (teal-500 with opacity)

### Text Colors
- Primary text highlights: `text-teal-600 dark:text-teal-400`
- Hover text: `group-hover:text-teal-600 dark:group-hover:text-teal-400`

### Backgrounds
- Selection: `rgba(20, 184, 166, 0.3)` (teal-500 at 30%)
- Tap highlight: `rgba(20, 184, 166, 0.2)`

## Theme System

DevMap maintains 6 distinct themes, each with its own personality:

| Theme | Primary | Description |
|-------|---------|-------------|
| **Fusion** | Teal/Cyan | DevMap's signature blend (default) |
| **Terminal** | Green | Hacker command-line aesthetic |
| **Zen** | Stone | Minimal, distraction-free |
| **Quest** | Violet | RPG-style gamification |
| **Modern** | Slate | Sleek startup aesthetic |
| **Retro** | Pink | Pixel art nostalgia |

## Files Modified

### Core Configuration
- `src/hooks/useTheme.ts` - Theme configurations and CSS classes
- `src/app/globals.css` - CSS variables and global styles

### Components Updated
- `src/components/DSAWebsite.tsx` - Main app component
- `src/components/Toast.tsx` - Toast notifications
- `src/components/TopicMap.tsx` - Interactive topic graph
- `src/app/[slug]/page.tsx` - Topic detail pages
- `src/app/stats/page.tsx` - Statistics dashboard

## Accessibility

All color combinations maintain WCAG AA contrast ratios:
- Teal-600 on white: 4.5:1+ contrast
- Teal-400 on gray-900: 4.5:1+ contrast

Focus indicators use a clear 2px teal outline for keyboard navigation.

## Future Considerations

1. **Custom Theme Builder** - Allow users to create their own color themes
2. **High Contrast Mode** - Enhanced accessibility option
3. **Color Blind Modes** - Deuteranopia, protanopia support
