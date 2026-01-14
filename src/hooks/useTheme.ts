"use client";

import { useCallback } from "react";

export type ThemeMode =
  | "fusion"
  | "terminal"
  | "zen"
  | "quest"
  | "modern"
  | "retro";

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    scanlines: boolean;
    crt: boolean;
    particles: boolean;
    grain: boolean;
    glow: boolean;
  };
}

export const themeConfigs: Record<ThemeMode, ThemeConfig> = {
  fusion: {
    name: "fusion",
    displayName: "Fusion",
    description: "DevMap's signature blend",
    icon: "🌀",
    fonts: {
      heading: "var(--font-geist-sans)",
      body: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
    },
    colors: {
      primary: "from-teal-500 to-cyan-600",
      secondary: "from-violet-500 to-purple-600",
      accent: "from-amber-400 to-orange-500",
    },
    effects: {
      scanlines: false,
      crt: false,
      particles: true,
      grain: false,
      glow: true,
    },
  },
  terminal: {
    name: "terminal",
    displayName: "Terminal",
    description: "Hacker command-line aesthetic",
    icon: "💻",
    fonts: {
      heading: "'Fira Code', 'JetBrains Mono', monospace",
      body: "'Fira Code', monospace",
      mono: "'Fira Code', monospace",
    },
    colors: {
      primary: "from-green-400 to-emerald-500",
      secondary: "from-green-500 to-green-600",
      accent: "from-amber-400 to-amber-500",
    },
    effects: {
      scanlines: true,
      crt: false,
      particles: false,
      grain: false,
      glow: true,
    },
  },
  zen: {
    name: "zen",
    displayName: "Zen",
    description: "Minimal, distraction-free",
    icon: "🧘",
    fonts: {
      heading: "'Inter', 'Helvetica Neue', sans-serif",
      body: "'Inter', sans-serif",
      mono: "var(--font-geist-mono)",
    },
    colors: {
      primary: "from-stone-400 to-stone-500",
      secondary: "from-stone-300 to-stone-400",
      accent: "from-emerald-400 to-teal-500",
    },
    effects: {
      scanlines: false,
      crt: false,
      particles: false,
      grain: false,
      glow: false,
    },
  },
  quest: {
    name: "quest",
    displayName: "Quest",
    description: "RPG-style gamification",
    icon: "🎮",
    fonts: {
      heading: "'Poppins', 'Nunito', sans-serif",
      body: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
    },
    colors: {
      primary: "from-violet-500 to-purple-600",
      secondary: "from-fuchsia-500 to-pink-500",
      accent: "from-yellow-400 to-amber-500",
    },
    effects: {
      scanlines: false,
      crt: false,
      particles: true,
      grain: false,
      glow: true,
    },
  },
  modern: {
    name: "modern",
    displayName: "Modern",
    description: "Sleek startup aesthetic",
    icon: "✨",
    fonts: {
      heading: "'Inter', 'SF Pro Display', sans-serif",
      body: "'Inter', sans-serif",
      mono: "var(--font-geist-mono)",
    },
    colors: {
      primary: "from-slate-600 to-slate-800",
      secondary: "from-blue-500 to-indigo-600",
      accent: "from-cyan-400 to-blue-500",
    },
    effects: {
      scanlines: false,
      crt: false,
      particles: false,
      grain: true,
      glow: true,
    },
  },
  retro: {
    name: "retro",
    displayName: "Retro",
    description: "Pixel art nostalgia",
    icon: "👾",
    fonts: {
      heading: "'Press Start 2P', cursive",
      body: "var(--font-geist-sans)",
      mono: "'Press Start 2P', monospace",
    },
    colors: {
      primary: "from-pink-500 to-rose-600",
      secondary: "from-cyan-400 to-blue-500",
      accent: "from-yellow-300 to-orange-400",
    },
    effects: {
      scanlines: true,
      crt: true,
      particles: true,
      grain: false,
      glow: true,
    },
  },
};

// Context-aware theme classes for Fusion mode
export const getFusionContextClass = (context: string): ThemeMode => {
  const contextMap: Record<string, ThemeMode> = {
    header: "modern",
    nav: "modern",
    stats: "quest",
    progress: "quest",
    achievement: "quest",
    topicCard: "fusion",
    questionList: "terminal",
    questionCard: "terminal",
    focus: "zen",
    reading: "zen",
    icon: "retro",
    celebration: "retro",
  };
  return contextMap[context] || "fusion";
};

// Theme-specific CSS classes
export const getThemeClasses = (theme: ThemeMode) => {
  const classes: Record<ThemeMode, Record<string, string>> = {
    fusion: {
      card: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700",
      button:
        "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700",
      heading: "font-bold text-gray-900 dark:text-white",
      text: "text-gray-600 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-700",
      badge:
        "bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30",
    },
    terminal: {
      card: "bg-black/90 border border-green-500/30 rounded-lg font-mono",
      button:
        "bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30",
      heading: "font-mono text-green-400 uppercase tracking-wider",
      text: "font-mono text-green-300/80",
      border: "border-green-500/30",
      badge: "bg-green-500/20 border border-green-500/50 text-green-400",
    },
    zen: {
      card: "bg-stone-50 dark:bg-stone-900 rounded-xl shadow-sm",
      button:
        "bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200",
      heading: "font-light text-stone-800 dark:text-stone-100 tracking-wide",
      text: "text-stone-600 dark:text-stone-400",
      border: "border-stone-200 dark:border-stone-700",
      badge:
        "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400",
    },
    quest: {
      card: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl border-2 border-violet-200 dark:border-violet-700",
      button:
        "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30",
      heading: "font-bold text-violet-900 dark:text-violet-100",
      text: "text-violet-700 dark:text-violet-300",
      border: "border-violet-300 dark:border-violet-600",
      badge:
        "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-300 dark:border-yellow-700",
    },
    modern: {
      card: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800",
      button:
        "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100",
      heading: "font-semibold text-gray-900 dark:text-white tracking-tight",
      text: "text-gray-500 dark:text-gray-400",
      border: "border-gray-100 dark:border-gray-800",
      badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    },
    retro: {
      card: "bg-gray-900 border-4 border-pink-500 rounded-none shadow-[4px_4px_0_0_#ec4899]",
      button:
        "bg-pink-500 hover:bg-pink-400 text-white border-b-4 border-pink-700 active:border-b-0 active:mt-1",
      heading: "font-['Press_Start_2P'] text-pink-400 uppercase text-sm",
      text: "text-cyan-300",
      border: "border-pink-500",
      badge: "bg-yellow-400 text-gray-900 border-2 border-yellow-600",
    },
  };
  return classes[theme];
};

export const useTheme = () => {
  const getConfig = useCallback((theme: ThemeMode): ThemeConfig => {
    return themeConfigs[theme];
  }, []);

  const getClasses = useCallback((theme: ThemeMode) => {
    return getThemeClasses(theme);
  }, []);

  const getFusionContext = useCallback((context: string): ThemeMode => {
    return getFusionContextClass(context);
  }, []);

  return {
    themeConfigs,
    getConfig,
    getClasses,
    getFusionContext,
  };
};

export default useTheme;
