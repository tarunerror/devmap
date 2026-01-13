// Progress & XP System
export const XP_PER_QUESTION = 10;
export const XP_PER_LEVEL = 100;

// Storage Keys
export const STORAGE_KEYS = {
  PROGRESS: "dsa-progress",
  ACHIEVEMENTS: "dsa-achievements",
  THEME: "theme",
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION = {
  TOAST_DURATION: 3000,
  ACHIEVEMENT_POPUP_DURATION: 5000,
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 200,
  TRANSITION_SLOW: 300,
} as const;

// Achievement Check Delay (in milliseconds)
export const ACHIEVEMENT_CHECK_DELAY = 100;

// Total Questions in the DSA Guide
export const TOTAL_QUESTIONS = 456;

// Default Theme
export const DEFAULT_THEME = "fusion";

// Level Calculation
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

// Date Helpers
export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};
