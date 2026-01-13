"use client";

import React, { useEffect } from "react";
import { useKeyboardShortcuts, Shortcut } from "@/hooks/useKeyboardShortcuts";

const KeyboardShortcutsModal: React.FC = () => {
  const { shortcuts, showHelp, setShowHelp, pendingKey } = useKeyboardShortcuts();

  useEffect(() => {
    if (showHelp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showHelp]);

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  const categoryLabels: Record<string, string> = {
    navigation: "Navigation",
    actions: "Actions",
    view: "View",
  };

  if (!showHelp) {
    // Show pending key indicator
    if (pendingKey) {
      return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg font-mono text-sm animate-in fade-in duration-200">
          <span className="opacity-70">Pressed: </span>
          <kbd className="px-2 py-1 bg-gray-700 dark:bg-gray-300 rounded ml-1">
            {pendingKey}
          </kbd>
          <span className="ml-2 opacity-70">waiting for next key...</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setShowHelp(false)}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Navigate faster with these shortcuts
            </p>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
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
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.key.split(" ").map((key, ki) => (
                        <React.Fragment key={ki}>
                          {ki > 0 && (
                            <span className="text-gray-400 dark:text-gray-500 mx-1">
                              then
                            </span>
                          )}
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                            {key === "/" ? "/" : key.toUpperCase()}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">?</kbd> anytime to show this help
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
