"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeMode, themeConfigs } from "@/hooks/useTheme";
import { useProgressContext } from "@/components/ProgressProvider";

interface ThemeSwitcherProps {
  compact?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("fusion");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const { progress, setTheme } = useProgressContext();

  useEffect(() => {
    const themeToSet = (progress.theme as ThemeMode) || "fusion";
    
    setTimeout(() => {
      if (hasInitializedRef.current && currentTheme !== themeToSet) {
        setCurrentTheme(themeToSet);
      }
      hasInitializedRef.current = true;
    }, 0);
  }, [progress.theme, currentTheme, setCurrentTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "t" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
          event.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleThemeSelect = (theme: ThemeMode) => {
    setCurrentTheme(theme);
    setTheme(theme);
    setIsOpen(false);

    // Apply theme-specific body classes
    document.body.classList.remove(
      "theme-fusion",
      "theme-terminal",
      "theme-zen",
      "theme-quest",
      "theme-modern",
      "theme-retro"
    );
    document.body.classList.add(`theme-${theme}`);
  };

  const themes = Object.values(themeConfigs);
  const currentConfig = themeConfigs[currentTheme];

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
          aria-label="Change theme"
          title="Change theme (T)"
        >
          <span className="text-lg">{currentConfig.icon}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Choose Theme
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Press T to toggle
              </p>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeSelect(theme.name as ThemeMode)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                    currentTheme === theme.name
                      ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-2 border-transparent"
                  }`}
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {theme.displayName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {theme.description}
                    </div>
                  </div>
                  {currentTheme === theme.name && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
        aria-label="Change theme"
      >
        <span className="text-lg">{currentConfig.icon}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentConfig.displayName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Theme Personality
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose your preferred visual style
            </p>
          </div>
          <div className="p-2 max-h-96 overflow-y-auto">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name as ThemeMode)}
                className={`w-full p-4 rounded-xl flex items-start gap-4 transition-all duration-200 ${
                  currentTheme === theme.name
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-2 border-transparent"
                }`}
              >
                <span className="text-3xl">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {theme.displayName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {theme.description}
                  </div>
                  {/* Theme preview indicators */}
                  <div className="flex gap-1 mt-2">
                    {theme.effects.scanlines && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                        Scanlines
                      </span>
                    )}
                    {theme.effects.particles && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                        Particles
                      </span>
                    )}
                    {theme.effects.glow && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                        Glow
                      </span>
                    )}
                  </div>
                </div>
                {currentTheme === theme.name && (
                  <svg
                    className="w-6 h-6 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
