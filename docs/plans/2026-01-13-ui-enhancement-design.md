# DSA Website UI Enhancement Design

**Date:** 2026-01-13  
**Status:** Approved  

## Overview

Transform the DSA learning platform with enhanced information design, interactivity, distinctive multi-personality themes, and functional progress persistence.

---

## 1. Multi-Personality Theme System

### Theme Architecture

```
Themes Available:
├── Fusion (default) - Contextual blend of all styles
├── Terminal Mode - Hacker/command-line aesthetic  
├── Zen Mode - Minimal, distraction-free
├── Quest Mode - Full gamification, RPG-style
├── Modern Mode - Sleek startup aesthetic
└── Retro Mode - Pixel art nostalgia
```

### Fusion Mode Contextual Logic

| Area | Personality Applied |
|------|---------------------|
| Header/Nav | Modern tech (sleek, professional) |
| Progress/Stats | Game-inspired (XP bars, achievements) |
| Topic Cards | Retro pixel icons + modern gradients |
| Problem Lists | Terminal aesthetic (monospace, command feel) |
| Focus/Reading | Zen mode (clean, calm) |
| Micro-interactions | Playful bounces + pixel sparkles |

### Theme Persistence

- Saved to localStorage alongside progress
- Smooth crossfade transitions when switching (300ms)
- System preference detection for initial dark/light

---

## 2. Progress Persistence & Mark as Done

### localStorage Data Schema

```javascript
// Key: 'dsa-progress'
{
  version: 1,
  theme: 'fusion',
  darkMode: true,
  questions: {
    "arrays-q1": { done: true, bookmarked: false, completedAt: timestamp },
    "dp-q15": { done: true, bookmarked: true, completedAt: timestamp, notes: "..." }
  },
  stats: {
    totalCompleted: 47,
    streakDays: 5,
    lastActiveDate: "2026-01-13",
    xp: 2350,
    level: 7
  },
  achievements: ["first-solve", "streak-3", "arrays-master"]
}
```

### Mark as Done UI

**Three Interaction Points:**

1. **Quick toggle on question row** - Circular checkbox at the left of each question with theme-specific animations
2. **Bulk actions** - Select multiple questions, mark all done/undone
3. **Undo support** - Toast notification with "Undo" button for 5 seconds

**Visual Feedback Per Theme:**

| Theme | Done Animation |
|-------|---------------|
| Fusion | Smooth check + subtle particles |
| Terminal | `[████████] DONE` typing effect |
| Zen | Gentle fade to muted state |
| Quest | +10 XP popup, progress bar fills |
| Modern | Sleek checkmark morph |
| Retro | Pixel heart fills, 8-bit sound option |

---

## 3. Better Information Design

### Topic Relationship Map

Interactive visualization showing DSA topic connections:

- **Node size** = number of questions
- **Node glow** = completion percentage
- **Connections** = prerequisite relationships
- **Click node** = navigate to topic
- **Hover** = show stats popup

### Personal Stats Dashboard (`/stats`)

- Completion heatmap (GitHub-style calendar)
- Topic radar chart (spider graph of proficiency)
- Difficulty breakdown (Easy/Medium/Hard pie chart)
- Time-based trends (weekly line graph)
- Estimated readiness score

### Question Difficulty Indicators

| Theme | Easy | Medium | Hard |
|-------|------|--------|------|
| Default | Green dot | Yellow dot | Red dot |
| Retro | 1 star | 2 stars | 3 stars |
| Terminal | [TRIVIAL] | [MODERATE] | [BRUTAL] |

---

## 4. Enhanced Interactivity

### Keyboard Navigation

```
Global:
  /         → Focus search
  t         → Toggle theme switcher
  d         → Toggle dark mode
  ?         → Show shortcuts modal
  g h       → Go home
  g s       → Go to stats

Question List:
  j / ↓     → Next question
  k / ↑     → Previous question
  x         → Toggle done
  b         → Toggle bookmark
  Enter     → Expand/collapse
  o         → Open LeetCode
  Esc       → Close / back
```

### Page Transitions

- View Transitions API for seamless navigation
- Topic cards morph into detail page header
- Progress rings animate continuously across pages
- Shared element transitions for topic icons

### Mobile Gestures

- **Swipe right** → Mark as done
- **Swipe left** → Bookmark
- **Pull down** → Back to home
- **Long press** → Quick actions menu

### Micro-interactions

- Parallax tilt on card hover
- Magnetic button effect
- Progress celebrations (confetti at milestones)
- Streak flames animation

---

## 5. Theme Personality Specifications

### Terminal Mode

- Font: Fira Code / JetBrains Mono
- Scanline overlay effect
- Typing animations for text
- Green/amber phosphor colors
- Prompt-style breadcrumbs: `~/dsa/arrays$`
- ASCII art decorations

### Zen Mode

- Generous whitespace
- Muted color palette
- Minimal animations (gentle fades only)
- Hide gamification elements
- Focus timer integration
- Serif font option

### Quest Mode

- XP bar in header with level badge
- Achievement popups with fanfare
- Topic cards as "dungeon doors"
- Questions as "quests" with rewards
- Daily challenges section
- Future: Leaderboard

### Modern Mode

- Glass morphism cards
- Subtle grain texture overlay
- Inter/Satoshi font family
- Vercel-style gradients
- Crisp micro-animations
- Floating orb decorations

### Retro Mode

- Pixel art topic icons
- Press Start 2P font for headings
- CRT screen curvature option
- 8-bit progress bars
- Pixel confetti celebrations
- Chiptune sound effects toggle

---

## 6. Implementation Components

### New Files to Create

```
src/
├── components/
│   ├── ThemeSwitcher.tsx
│   ├── MarkAsDone.tsx
│   ├── TopicMap.tsx
│   ├── StatsPage.tsx
│   ├── KeyboardShortcuts.tsx
│   ├── Toast.tsx
│   ├── AchievementPopup.tsx
│   └── themes/
│       ├── TerminalTheme.tsx
│       ├── ZenTheme.tsx
│       ├── QuestTheme.tsx
│       ├── ModernTheme.tsx
│       └── RetroTheme.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useProgress.ts
│   └── useTheme.ts
├── lib/
│   ├── progressManager.ts
│   ├── achievementSystem.ts
│   └── xpCalculator.ts
└── app/
    └── stats/
        └── page.tsx
```

### CSS/Styling

- Theme-specific CSS custom properties
- Font imports (Fira Code, Press Start 2P, Inter)
- Animation keyframes per theme
- Responsive breakpoints maintained

---

## 7. Priority Order

1. **P0 - Core:** localStorage persistence + Mark as Done button
2. **P1 - Themes:** Theme switcher + Fusion mode
3. **P2 - Info Design:** Stats dashboard + difficulty indicators
4. **P3 - Interactivity:** Keyboard shortcuts + page transitions
5. **P4 - Polish:** Topic map + all theme personalities + achievements
