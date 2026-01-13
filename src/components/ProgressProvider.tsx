"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { useProgress, ProgressData } from "@/hooks/useProgress";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import Toast from "@/components/Toast";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import AchievementPopup from "@/components/AchievementPopup";

interface ToastData {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
  onUndo?: () => void;
}

interface ProgressContextType {
  progress: ProgressData;
  mounted: boolean;
  toggleDone: (questionId: string) => void;
  toggleBookmark: (questionId: string) => void;
  isQuestionDone: (questionId: string) => boolean;
  isQuestionBookmarked: (questionId: string) => boolean;
  getQuestionNote: (questionId: string) => string;
  updateQuestionNote: (questionId: string, note: string) => void;
  getCompletedCount: (questionIds: string[]) => number;
  setTheme: (theme: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  showToast: (
    message: string,
    type?: "success" | "info" | "warning",
    onUndo?: () => void,
  ) => void;
  // Achievement functions
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  isAchievementUnlocked: (id: string) => boolean;
  getUnlockedCount: () => number;
  getTotalAchievementCount: () => number;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error(
      "useProgressContext must be used within a ProgressProvider",
    );
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    progress,
    mounted,
    toggleDone: baseToggleDone,
    toggleBookmark: baseToggleBookmark,
    undoLastAction,
    isQuestionDone,
    isQuestionBookmarked,
    getQuestionNote,
    updateQuestionNote,
    getCompletedCount,
    setTheme,
    setDarkMode,
  } = useProgress();

  const {
    achievements,
    isUnlocked,
    markNotified,
    getNextPendingNotification,
    checkProgressAchievements,
    checkStreakAchievements,
    checkTimeAchievements,
    getUnlockedCount,
    getTotalCount,
    getUnlockedAchievements,
  } = useAchievements();

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const toastIdRef = useRef(0);

  // Check for pending achievement notifications
  useEffect(() => {
    if (!mounted) return;

    const nextAchievement = getNextPendingNotification();
    if (nextAchievement && !currentAchievement) {
      setCurrentAchievement(nextAchievement);
    }
  }, [mounted, getNextPendingNotification, currentAchievement]);

  const handleAchievementDismiss = () => {
    if (currentAchievement) {
      markNotified(currentAchievement.id);
      setCurrentAchievement(null);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" = "success",
    onUndo?: () => void,
  ) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type, onUndo }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDone = (questionId: string) => {
    const wasDone = isQuestionDone(questionId);
    baseToggleDone(questionId);

    const message = wasDone
      ? "Question marked as incomplete"
      : "Question marked as done! +10 XP";

    showToast(message, "success", undoLastAction);

    // Check for achievements when marking done (not undoing)
    if (!wasDone) {
      // Need to get updated count after toggle
      setTimeout(() => {
        const totalCompleted =
          Object.keys(progress.questions).filter(
            (qId) => progress.questions[qId]?.done,
          ).length + 1; // +1 for the one we just marked

        checkProgressAchievements(totalCompleted);
        checkStreakAchievements(progress.stats.streakDays);
        checkTimeAchievements();
      }, 100);
    }
  };

  const toggleBookmark = (questionId: string) => {
    const wasBookmarked = isQuestionBookmarked(questionId);
    baseToggleBookmark(questionId);

    const message = wasBookmarked ? "Bookmark removed" : "Question bookmarked!";

    showToast(message, "info", undoLastAction);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        mounted,
        toggleDone,
        toggleBookmark,
        isQuestionDone,
        isQuestionBookmarked,
        getQuestionNote,
        updateQuestionNote,
        getCompletedCount,
        setTheme,
        setDarkMode,
        showToast,
        // Achievement functions
        achievements,
        unlockedAchievements: getUnlockedAchievements(),
        isAchievementUnlocked: isUnlocked,
        getUnlockedCount,
        getTotalAchievementCount: getTotalCount,
      }}
    >
      {children}

      {/* Achievement popup */}
      <AchievementPopup
        achievement={currentAchievement}
        onDismiss={handleAchievementDismiss}
      />

      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onUndo={toast.onUndo}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal />
    </ProgressContext.Provider>
  );
};

export default ProgressProvider;
