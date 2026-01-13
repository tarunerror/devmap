"use client";

import React, { useState } from "react";

interface MarkAsDoneProps {
  isDone: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const MarkAsDone: React.FC<MarkAsDoneProps> = ({
  isDone,
  onToggle,
  size = "md",
  showLabel = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const checkSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={handleClick}
      className={`group/done relative flex items-center gap-2 transition-all duration-300 ${
        showLabel ? "pr-2" : ""
      }`}
      aria-label={isDone ? "Mark as incomplete" : "Mark as done"}
    >
      {/* Checkbox circle */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
          isDone
            ? "bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400 shadow-lg shadow-emerald-500/30"
            : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        } ${isAnimating ? "scale-110" : "hover:scale-105"}`}
      >
        {/* Checkmark */}
        <svg
          className={`${checkSizeClasses[size]} text-white transition-all duration-300 ${
            isDone ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        {/* Celebration particles */}
        {isAnimating && isDone && (
          <>
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping animation-delay-100" />
            <span className="absolute -bottom-1 left-0 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping animation-delay-200" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping animation-delay-150" />
          </>
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`text-sm font-medium transition-colors ${
            isDone
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-gray-400 group-hover/done:text-emerald-600 dark:group-hover/done:text-emerald-400"
          }`}
        >
          {isDone ? "Done" : "Mark done"}
        </span>
      )}
    </button>
  );
};

export default MarkAsDone;
