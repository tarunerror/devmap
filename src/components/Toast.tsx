"use client";

import React, { useEffect, useState } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "info" | "warning";
  duration?: number;
  onUndo?: () => void;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 5000,
  onUndo,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const bgColor = {
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700",
    info: "bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700",
    warning:
      "bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700",
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className={`${bgColor[type]} text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] max-w-[90vw]`}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {type === "success" && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {type === "info" && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Message */}
        <span className="flex-1 text-sm font-medium">{message}</span>

        {/* Undo button */}
        {onUndo && (
          <button
            onClick={handleUndo}
            className="flex-shrink-0 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
          >
            Undo
          </button>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
          <div
            className="h-full bg-white/50 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
