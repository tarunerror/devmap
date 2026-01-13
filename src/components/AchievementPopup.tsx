"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Achievement } from "@/hooks/useAchievements";

interface AchievementPopupProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

const rarityColors = {
  common: {
    bg: "from-gray-500 to-gray-600",
    border: "border-gray-400",
    text: "text-gray-100",
    glow: "shadow-gray-500/50",
  },
  uncommon: {
    bg: "from-green-500 to-emerald-600",
    border: "border-green-400",
    text: "text-green-100",
    glow: "shadow-green-500/50",
  },
  rare: {
    bg: "from-blue-500 to-indigo-600",
    border: "border-blue-400",
    text: "text-blue-100",
    glow: "shadow-blue-500/50",
  },
  epic: {
    bg: "from-purple-500 to-violet-600",
    border: "border-purple-400",
    text: "text-purple-100",
    glow: "shadow-purple-500/50",
  },
  legendary: {
    bg: "from-amber-500 to-orange-600",
    border: "border-amber-400",
    text: "text-amber-100",
    glow: "shadow-amber-500/50",
  },
};

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      setIsVisible(false);
      onDismiss();
    }, 300);
  }, [onDismiss]);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [achievement, handleDismiss]);

  if (!achievement) return null;

  const colors = rarityColors[achievement.rarity];

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
        isVisible && !isExiting
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95"
      }`}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {[...Array(12)].map((_, i) => {
          // Use deterministic values based on index instead of Math.random()
          const offsetX = ((i * 17) % 100) - 50;
          const extraDuration = ((i * 7) % 10) / 10;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full confetti"
              style={{
                left: `${50 + offsetX}%`,
                top: "50%",
                background: [
                  "#f59e0b",
                  "#ec4899",
                  "#8b5cf6",
                  "#06b6d4",
                  "#22c55e",
                ][i % 5],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1.5 + extraDuration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Main popup */}
      <div
        className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl p-1 shadow-2xl ${colors.glow}`}
        onClick={handleDismiss}
      >
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-6 min-w-[320px]">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
              Achievement Unlocked!
            </span>
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center text-4xl shadow-lg level-up-glow`}
            >
              {achievement.icon}
            </div>
          </div>

          {/* Title and description */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">
              {achievement.title}
            </h3>
            <p className="text-gray-300 text-sm">{achievement.description}</p>
          </div>

          {/* Rarity and XP */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.text} bg-white/10`}
            >
              {achievement.rarity}
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              +{achievement.xpReward} XP
            </span>
          </div>

          {/* Click to dismiss hint */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Click to dismiss
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
