"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "progress" | "streak" | "mastery" | "exploration" | "special";
  requirement: number;
  xpReward: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
  notified: boolean;
}

export interface AchievementState {
  unlocked: UnlockedAchievement[];
  pendingNotifications: string[];
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Progress achievements
  {
    id: "first_blood",
    title: "First Blood",
    description: "Complete your first problem",
    icon: "🎯",
    category: "progress",
    requirement: 1,
    xpReward: 10,
    rarity: "common",
  },
  {
    id: "getting_started",
    title: "Getting Started",
    description: "Complete 10 problems",
    icon: "🚀",
    category: "progress",
    requirement: 10,
    xpReward: 50,
    rarity: "common",
  },
  {
    id: "warming_up",
    title: "Warming Up",
    description: "Complete 25 problems",
    icon: "🔥",
    category: "progress",
    requirement: 25,
    xpReward: 100,
    rarity: "uncommon",
  },
  {
    id: "on_a_roll",
    title: "On a Roll",
    description: "Complete 50 problems",
    icon: "⚡",
    category: "progress",
    requirement: 50,
    xpReward: 200,
    rarity: "uncommon",
  },
  {
    id: "century",
    title: "Century",
    description: "Complete 100 problems",
    icon: "💯",
    category: "progress",
    requirement: 100,
    xpReward: 500,
    rarity: "rare",
  },
  {
    id: "halfway_there",
    title: "Halfway There",
    description: "Complete 228 problems (50%)",
    icon: "🎖️",
    category: "progress",
    requirement: 228,
    xpReward: 1000,
    rarity: "rare",
  },
  {
    id: "almost_there",
    title: "Almost There",
    description: "Complete 400 problems",
    icon: "🏆",
    category: "progress",
    requirement: 400,
    xpReward: 2000,
    rarity: "epic",
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Complete all 456 problems",
    icon: "👑",
    category: "progress",
    requirement: 456,
    xpReward: 5000,
    rarity: "legendary",
  },

  // Streak achievements
  {
    id: "streak_3",
    title: "Hat Trick",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    category: "streak",
    requirement: 3,
    xpReward: 30,
    rarity: "common",
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "📅",
    category: "streak",
    requirement: 7,
    xpReward: 100,
    rarity: "uncommon",
  },
  {
    id: "streak_14",
    title: "Fortnight Fighter",
    description: "Maintain a 14-day streak",
    icon: "⚔️",
    category: "streak",
    requirement: 14,
    xpReward: 250,
    rarity: "rare",
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    category: "streak",
    requirement: 30,
    xpReward: 500,
    rarity: "epic",
  },
  {
    id: "streak_100",
    title: "Centurion",
    description: "Maintain a 100-day streak",
    icon: "🏅",
    category: "streak",
    requirement: 100,
    xpReward: 2000,
    rarity: "legendary",
  },

  // Mastery achievements (complete entire topics)
  {
    id: "master_basics",
    title: "Foundation Builder",
    description: "Complete all Basics problems",
    icon: "📚",
    category: "mastery",
    requirement: 1,
    xpReward: 100,
    rarity: "uncommon",
  },
  {
    id: "master_arrays",
    title: "Array Architect",
    description: "Complete all Arrays problems",
    icon: "🧱",
    category: "mastery",
    requirement: 1,
    xpReward: 200,
    rarity: "rare",
  },
  {
    id: "master_dp",
    title: "DP Wizard",
    description: "Complete all Dynamic Programming problems",
    icon: "🧙",
    category: "mastery",
    requirement: 1,
    xpReward: 500,
    rarity: "epic",
  },
  {
    id: "master_graphs",
    title: "Graph Navigator",
    description: "Complete all Graphs problems",
    icon: "🗺️",
    category: "mastery",
    requirement: 1,
    xpReward: 400,
    rarity: "epic",
  },
  {
    id: "master_trees",
    title: "Tree Hugger",
    description: "Complete all Binary Trees problems",
    icon: "🌳",
    category: "mastery",
    requirement: 1,
    xpReward: 300,
    rarity: "rare",
  },

  // Exploration achievements
  {
    id: "explorer_5",
    title: "Curious Mind",
    description: "Attempt problems from 5 different topics",
    icon: "🔍",
    category: "exploration",
    requirement: 5,
    xpReward: 50,
    rarity: "common",
  },
  {
    id: "explorer_10",
    title: "Well Rounded",
    description: "Attempt problems from 10 different topics",
    icon: "🌐",
    category: "exploration",
    requirement: 10,
    xpReward: 150,
    rarity: "uncommon",
  },
  {
    id: "explorer_all",
    title: "Jack of All Trades",
    description: "Attempt problems from all topics",
    icon: "🎨",
    category: "exploration",
    requirement: 17,
    xpReward: 300,
    rarity: "rare",
  },

  // Special achievements
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Complete a problem after midnight",
    icon: "🦉",
    category: "special",
    requirement: 1,
    xpReward: 50,
    rarity: "uncommon",
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete a problem before 6 AM",
    icon: "🐦",
    category: "special",
    requirement: 1,
    xpReward: 50,
    rarity: "uncommon",
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Complete 5 problems in one day",
    icon: "💨",
    category: "special",
    requirement: 5,
    xpReward: 100,
    rarity: "rare",
  },
  {
    id: "marathon",
    title: "Marathon Runner",
    description: "Complete 10 problems in one day",
    icon: "🏃",
    category: "special",
    requirement: 10,
    xpReward: 250,
    rarity: "epic",
  },
];

const STORAGE_KEY = "dsa-achievements";

const getRarityColor = (rarity: Achievement["rarity"]): string => {
  switch (rarity) {
    case "common":
      return "#9ca3af";
    case "uncommon":
      return "#22c55e";
    case "rare":
      return "#3b82f6";
    case "epic":
      return "#a855f7";
    case "legendary":
      return "#f59e0b";
    default:
      return "#9ca3af";
  }
};

export const useAchievements = () => {
  const [state, setState] = useState<AchievementState>({
    unlocked: [],
    pendingNotifications: [],
  });
  const hasLoadedDataRef = useRef(false);

  // Load from localStorage
  useEffect(() => {
    if (hasLoadedDataRef.current) return;
    hasLoadedDataRef.current = true;

    const saved = localStorage.getItem(STORAGE_KEY);
    const stateToSet = {
      unlocked: [],
      pendingNotifications: [],
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(stateToSet, parsed);
      } catch {
        // Invalid JSON, start fresh
      }
    }
    const timer = setTimeout(() => setState(stateToSet), 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!hasLoadedDataRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isUnlocked = useCallback(
    (achievementId: string): boolean => {
      return state.unlocked.some((u) => u.achievementId === achievementId);
    },
    [state.unlocked]
  );

  const unlockAchievement = useCallback(
    (achievementId: string): Achievement | null => {
      if (isUnlocked(achievementId)) return null;

      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!achievement) return null;

      setState((prev) => ({
        unlocked: [
          ...prev.unlocked,
          {
            achievementId,
            unlockedAt: new Date().toISOString(),
            notified: false,
          },
        ],
        pendingNotifications: [...prev.pendingNotifications, achievementId],
      }));

      return achievement;
    },
    [isUnlocked]
  );

  const markNotified = useCallback((achievementId: string) => {
    setState((prev) => ({
      ...prev,
      unlocked: prev.unlocked.map((u) =>
        u.achievementId === achievementId ? { ...u, notified: true } : u
      ),
      pendingNotifications: prev.pendingNotifications.filter(
        (id) => id !== achievementId
      ),
    }));
  }, []);

  const getNextPendingNotification = useCallback((): Achievement | null => {
    if (state.pendingNotifications.length === 0) return null;
    const nextId = state.pendingNotifications[0];
    return ACHIEVEMENTS.find((a) => a.id === nextId) || null;
  }, [state.pendingNotifications]);

  const checkProgressAchievements = useCallback(
    (completedCount: number): Achievement[] => {
      const newAchievements: Achievement[] = [];

      // Progress achievements
      const progressAchievements = ACHIEVEMENTS.filter(
        (a) => a.category === "progress"
      );
      for (const achievement of progressAchievements) {
        if (completedCount >= achievement.requirement && !isUnlocked(achievement.id)) {
          const unlocked = unlockAchievement(achievement.id);
          if (unlocked) newAchievements.push(unlocked);
        }
      }

      return newAchievements;
    },
    [isUnlocked, unlockAchievement]
  );

  const checkStreakAchievements = useCallback(
    (streakDays: number): Achievement[] => {
      const newAchievements: Achievement[] = [];

      const streakAchievements = ACHIEVEMENTS.filter(
        (a) => a.category === "streak"
      );
      for (const achievement of streakAchievements) {
        if (streakDays >= achievement.requirement && !isUnlocked(achievement.id)) {
          const unlocked = unlockAchievement(achievement.id);
          if (unlocked) newAchievements.push(unlocked);
        }
      }

      return newAchievements;
    },
    [isUnlocked, unlockAchievement]
  );

  const checkTimeAchievements = useCallback((): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const hour = new Date().getHours();

    // Night Owl: after midnight (0-4)
    if (hour >= 0 && hour < 5 && !isUnlocked("night_owl")) {
      const unlocked = unlockAchievement("night_owl");
      if (unlocked) newAchievements.push(unlocked);
    }

    // Early Bird: before 6 AM (5-6)
    if (hour >= 5 && hour < 6 && !isUnlocked("early_bird")) {
      const unlocked = unlockAchievement("early_bird");
      if (unlocked) newAchievements.push(unlocked);
    }

    return newAchievements;
  }, [isUnlocked, unlockAchievement]);

  const getUnlockedCount = useCallback((): number => {
    return state.unlocked.length;
  }, [state.unlocked.length]);

  const getTotalCount = useCallback((): number => {
    return ACHIEVEMENTS.length;
  }, []);

  const getAchievementsByCategory = useCallback(
    (category: Achievement["category"]): Achievement[] => {
      return ACHIEVEMENTS.filter((a) => a.category === category);
    },
    []
  );

  const getUnlockedAchievements = useCallback((): Achievement[] => {
    return ACHIEVEMENTS.filter((a) =>
      state.unlocked.some((u) => u.achievementId === a.id)
    );
  }, [state.unlocked]);

  return {
    achievements: ACHIEVEMENTS,
    unlocked: state.unlocked,
    pendingNotifications: state.pendingNotifications,
    isUnlocked,
    unlockAchievement,
    markNotified,
    getNextPendingNotification,
    checkProgressAchievements,
    checkStreakAchievements,
    checkTimeAchievements,
    getUnlockedCount,
    getTotalCount,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getRarityColor,
  };
};

export default useAchievements;
