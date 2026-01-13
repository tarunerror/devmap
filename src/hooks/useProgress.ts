"use client";

import { useState, useEffect, useCallback } from "react";
import {
  XP_PER_QUESTION,
  STORAGE_KEYS,
  DEFAULT_THEME,
  calculateLevel,
  getTodayDate,
  getYesterdayDate,
} from "@/lib/constants";

export interface QuestionProgress {
  done: boolean;
  bookmarked: boolean;
  completedAt?: number;
  notes?: string;
}

export interface ProgressStats {
  totalCompleted: number;
  streakDays: number;
  lastActiveDate: string;
  xp: number;
  level: number;
}

export interface ProgressData {
  version: number;
  theme: string;
  darkMode: boolean;
  questions: Record<string, QuestionProgress>;
  stats: ProgressStats;
  achievements: string[];
}

const getDefaultProgress = (): ProgressData => ({
  version: 1,
  theme: DEFAULT_THEME,
  darkMode: false,
  questions: {},
  stats: {
    totalCompleted: 0,
    streakDays: 0,
    lastActiveDate: "",
    xp: 0,
    level: 1,
  },
  achievements: [],
});

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>(getDefaultProgress());
  const [mounted, setMounted] = useState(false);
  const [lastAction, setLastAction] = useState<{
    type: "done" | "bookmark";
    questionId: string;
    previousState: boolean;
  } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress({ ...getDefaultProgress(), ...parsed });
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  }, [progress, mounted]);

  const toggleDone = useCallback((questionId: string) => {
    setProgress((prev) => {
      const currentQuestion = prev.questions[questionId] || {
        done: false,
        bookmarked: false,
      };
      const wasDone = currentQuestion.done;
      const newDone = !wasDone;

      // Store last action for undo
      setLastAction({
        type: "done",
        questionId,
        previousState: wasDone,
      });

      const today = getTodayDate();
      const wasActiveToday = prev.stats.lastActiveDate === today;
      const wasActiveYesterday =
        prev.stats.lastActiveDate === getYesterdayDate();

      let newStreak = prev.stats.streakDays;
      if (newDone && !wasActiveToday) {
        if (wasActiveYesterday) {
          newStreak = prev.stats.streakDays + 1;
        } else if (prev.stats.lastActiveDate === "") {
          newStreak = 1;
        } else {
          newStreak = 1; // Reset streak if more than a day gap
        }
      }

      const xpChange = newDone ? XP_PER_QUESTION : -XP_PER_QUESTION;
      const newXp = Math.max(0, prev.stats.xp + xpChange);
      const completedChange = newDone ? 1 : -1;

      return {
        ...prev,
        questions: {
          ...prev.questions,
          [questionId]: {
            ...currentQuestion,
            done: newDone,
            completedAt: newDone ? Date.now() : undefined,
          },
        },
        stats: {
          ...prev.stats,
          totalCompleted: Math.max(
            0,
            prev.stats.totalCompleted + completedChange,
          ),
          xp: newXp,
          level: calculateLevel(newXp),
          streakDays: newStreak,
          lastActiveDate: newDone ? today : prev.stats.lastActiveDate,
        },
      };
    });
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setProgress((prev) => {
      const currentQuestion = prev.questions[questionId] || {
        done: false,
        bookmarked: false,
      };
      const wasBookmarked = currentQuestion.bookmarked;

      setLastAction({
        type: "bookmark",
        questionId,
        previousState: wasBookmarked,
      });

      return {
        ...prev,
        questions: {
          ...prev.questions,
          [questionId]: {
            ...currentQuestion,
            bookmarked: !wasBookmarked,
          },
        },
      };
    });
  }, []);

  const undoLastAction = useCallback(() => {
    if (!lastAction) return;

    setProgress((prev) => {
      const currentQuestion = prev.questions[lastAction.questionId] || {
        done: false,
        bookmarked: false,
      };

      if (lastAction.type === "done") {
        const xpChange = lastAction.previousState
          ? XP_PER_QUESTION
          : -XP_PER_QUESTION;
        const completedChange = lastAction.previousState ? 1 : -1;
        const newXp = Math.max(0, prev.stats.xp + xpChange);

        return {
          ...prev,
          questions: {
            ...prev.questions,
            [lastAction.questionId]: {
              ...currentQuestion,
              done: lastAction.previousState,
              completedAt: lastAction.previousState ? Date.now() : undefined,
            },
          },
          stats: {
            ...prev.stats,
            totalCompleted: Math.max(
              0,
              prev.stats.totalCompleted + completedChange,
            ),
            xp: newXp,
            level: calculateLevel(newXp),
          },
        };
      } else {
        return {
          ...prev,
          questions: {
            ...prev.questions,
            [lastAction.questionId]: {
              ...currentQuestion,
              bookmarked: lastAction.previousState,
            },
          },
        };
      }
    });

    setLastAction(null);
  }, [lastAction]);

  const isQuestionDone = useCallback(
    (questionId: string): boolean => {
      return progress.questions[questionId]?.done || false;
    },
    [progress.questions],
  );

  const isQuestionBookmarked = useCallback(
    (questionId: string): boolean => {
      return progress.questions[questionId]?.bookmarked || false;
    },
    [progress.questions],
  );

  const getQuestionNote = useCallback(
    (questionId: string): string => {
      return progress.questions[questionId]?.notes || "";
    },
    [progress.questions],
  );

  const updateQuestionNote = useCallback((questionId: string, note: string) => {
    setProgress((prev) => {
      const currentQuestion = prev.questions[questionId] || {
        done: false,
        bookmarked: false,
      };

      return {
        ...prev,
        questions: {
          ...prev.questions,
          [questionId]: {
            ...currentQuestion,
            notes: note,
          },
        },
      };
    });
  }, []);

  const getCompletedCount = useCallback(
    (questionIds: string[]): number => {
      return questionIds.filter((id) => progress.questions[id]?.done).length;
    },
    [progress.questions],
  );

  const setTheme = useCallback((theme: string) => {
    setProgress((prev) => ({ ...prev, theme }));
  }, []);

  const setDarkMode = useCallback((darkMode: boolean) => {
    setProgress((prev) => ({ ...prev, darkMode }));
  }, []);

  return {
    progress,
    mounted,
    lastAction,
    toggleDone,
    toggleBookmark,
    undoLastAction,
    isQuestionDone,
    isQuestionBookmarked,
    getQuestionNote,
    updateQuestionNote,
    getCompletedCount,
    setTheme,
    setDarkMode,
  };
};

export default useProgress;
