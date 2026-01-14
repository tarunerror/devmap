"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProgressContext } from "@/components/ProgressProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import TopicMap from "@/components/TopicMap";
import DevMapLogo from "@/components/DevMapLogo";
import { countAllQuestions, countQuestionsInContent } from "@/utils/countUtils";
import type { UltimateData, Content, Category, Question } from "@/data/types";

// Topic icons mapping with unique colors
const topicConfig: Record<
  string,
  { icon: React.ReactNode; gradient: string; bgLight: string; bgDark: string }
> = {
  Basics: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-900/20",
  },
  Sorting: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
    ),
    gradient: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50",
    bgDark: "dark:bg-pink-900/20",
  },
  Arrays: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-900/20",
  },
  "Binary Search": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-900/20",
  },
  Strings: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/20",
  },
  "Linked List": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    gradient: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-900/20",
  },
  Recursion: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    gradient: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-fuchsia-50",
    bgDark: "dark:bg-fuchsia-900/20",
  },
  "Bit Manipulation": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    gradient: "from-slate-500 to-gray-600",
    bgLight: "bg-slate-50",
    bgDark: "dark:bg-slate-900/20",
  },
  "Stack and Queues": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    gradient: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50",
    bgDark: "dark:bg-cyan-900/20",
  },
  "Sliding Window": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    gradient: "from-lime-500 to-green-600",
    bgLight: "bg-lime-50",
    bgDark: "dark:bg-lime-900/20",
  },
  Heaps: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    gradient: "from-yellow-500 to-amber-600",
    bgLight: "bg-yellow-50",
    bgDark: "dark:bg-yellow-900/20",
  },
  "Greedy Algorithms": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    gradient: "from-orange-500 to-red-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-900/20",
  },
  "Binary Trees": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
    gradient: "from-green-500 to-emerald-600",
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-900/20",
  },
  "Binary Search Trees": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    gradient: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50",
    bgDark: "dark:bg-teal-900/20",
  },
  Graphs: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
        />
      </svg>
    ),
    gradient: "from-purple-500 to-indigo-600",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-900/20",
  },
  "Dynamic Programming": {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
    gradient: "from-red-500 to-rose-600",
    bgLight: "bg-red-50",
    bgDark: "dark:bg-red-900/20",
  },
  Tries: {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50",
    bgDark: "dark:bg-sky-900/20",
  },
};

const getTopicConfig = (heading: string) => {
  const key = Object.keys(topicConfig).find((k) =>
    heading.toLowerCase().includes(k.toLowerCase()),
  );
  return topicConfig[key || "Basics"] || topicConfig["Basics"];
};

const AnimatedCounter = ({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const step = value / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const ProgressRing = ({
  progress,
  size = 48,
  strokeWidth = 4,
  colorClass = "text-indigo-500 dark:text-indigo-400",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-gray-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`${colorClass} transition-all duration-700 ease-out`}
      />
    </svg>
  );
};

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

const TopicSection = ({
  content,
  searchQuery,
  completedCount,
}: {
  content: Content;
  searchQuery: string;
  completedCount: number;
}) => {
  const contentTotalQuestions = countQuestionsInContent(content);
  const progress = Math.round((completedCount / contentTotalQuestions) * 100);
  const config = getTopicConfig(content.contentHeading);
  const slug = content.contentPath.replace(/^\//, "").toLowerCase();

  return (
    <Link href={`/${slug}`} className="block group">
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer h-full">
        <div className="p-6 flex flex-col items-center text-center h-full">
          <div
            className={`p-5 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <div className="text-white w-10 h-10 [&>svg]:w-10 [&>svg]:h-10">
              {config.icon}
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <HighlightText text={content.contentHeading} query={searchQuery} />
          </h2>

          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bgLight} ${config.bgDark} text-gray-700 dark:text-gray-300 mb-3`}
          >
            {contentTotalQuestions} Qs
          </span>

          {content.contentSubHeading && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {content.contentSubHeading}
            </p>
          )}

          <div className="mt-auto w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {completedCount} / {contentTotalQuestions}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center mt-2">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {progress}%
              </span>
            </div>
          </div>

          <div className="mt-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-indigo-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

const QuoteCard = ({ quote, author }: { quote: string; author: string }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24" />

      <div className="relative z-10">
        <svg
          className="w-10 h-10 text-white/30 mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-lg sm:text-xl italic font-light leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center gap-3 mt-6">
          <div className="h-px flex-1 bg-white/30" />
          <span className="text-sm font-medium opacity-90">- {author}</span>
        </div>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
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
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

const DSAWebsite = ({ data }: { data: UltimateData }) => {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkModeState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomQuote] = useState<{ quote: string; author: string }>(() => {
    const quoteIndex = Math.floor(
      Math.random() * data.data.header.motivationalQuotes.length,
    );
    return data.data.header.motivationalQuotes[quoteIndex];
  });

  const { progress, getCompletedCount, setDarkMode } = useProgressContext();

  // Get all question IDs for total progress calculation
  const allQuestionIds = useMemo(() => {
    return data.data.content.flatMap((content) =>
      content.categoryList.flatMap((cat) =>
        cat.questionList.map((q) => q.questionId),
      ),
    );
  }, [data.data.content]);

  const totalCompleted = getCompletedCount(allQuestionIds);

  useEffect(() => {
    setMounted(true);
    // Get dark mode from progress context or fallback
    const savedProgress = localStorage.getItem("dsa-progress");
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setDarkModeState(parsed.darkMode || false);
    } else {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkModeState(savedTheme === "dark" || (!savedTheme && prefersDark));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkMode(darkMode);
  }, [darkMode, mounted, setDarkMode]);

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev);
  };

  const overallProgress = Math.round(
    (totalCompleted / countAllQuestions(data)) * 100,
  );

  const filteredContent = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return data.data.content;

    return data.data.content.filter((content) => {
      const topicMatch =
        content.contentHeading.toLowerCase().includes(query) ||
        content.contentSubHeading?.toLowerCase().includes(query);

      const questionMatch = content.categoryList.some((category) =>
        category.questionList.some((question) =>
          question.questionHeading.toLowerCase().includes(query),
        ),
      );

      return topicMatch || questionMatch;
    });
  }, [data.data.content, searchQuery]);

  // Loading skeleton
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div>
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse hidden sm:block" />
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <div className="relative">
                  <ProgressRing
                    progress={overallProgress}
                    size={52}
                    strokeWidth={4}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
                    {overallProgress}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DevMapLogo
                  size={36}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    DevMap
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your DSA Journey
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <AnimatedCounter value={totalCompleted} />
                  </span>
                  <span className="text-gray-400">/</span>
                  <span>{countAllQuestions(data)} Questions</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* XP Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full border border-amber-200 dark:border-amber-800">
                <svg
                  className="w-4 h-4 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {progress.stats.xp} XP
                </span>
              </div>

              {/* Level Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full border border-purple-200 dark:border-purple-800">
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                  Lv. {progress.stats.level}
                </span>
              </div>

              {/* Streak Badge */}
              {progress.stats.streakDays > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full border border-orange-200 dark:border-orange-800">
                  <span className="text-base">🔥</span>
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                    {progress.stats.streakDays} day
                    {progress.stats.streakDays > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Stats Link */}
              <Link
                href="/stats"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full border border-indigo-200 dark:border-indigo-800 hover:scale-105 transition-transform"
                title="View detailed stats"
              >
                <svg
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                  Stats
                </span>
              </Link>

              <div className="relative flex-1 sm:flex-none group">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search topics or questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                )}
              </div>
              {/* Theme Switcher */}
              <ThemeSwitcher compact />

              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {randomQuote.quote && (
          <div className="mb-8">
            <QuoteCard quote={randomQuote.quote} author={randomQuote.author} />
          </div>
        )}

        {/* Topic Relationship Map */}
        <TopicMap />

        {filteredContent.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search query
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((content) => {
              const questionIds = content.categoryList.flatMap((cat) =>
                cat.questionList.map((q) => q.questionId),
              );
              const completedCount = getCompletedCount(questionIds);

              return (
                <TopicSection
                  key={content.contentPath}
                  content={content}
                  searchQuery={searchQuery}
                  completedCount={completedCount}
                />
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DevMapLogo
                  size={28}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  DevMap
                </h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-2">
                Your DSA Journey
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Master Data Structures and Algorithms with our comprehensive
                guide featuring {countAllQuestions(data)} curated problems.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {countAllQuestions(data)} Total Problems
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {totalCompleted} Completed
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {data.data.content.length} Topics
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Resources
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://takeuforward.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  TakeUForward
                </a>
                <a
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  LeetCode
                </a>
                <a
                  href="https://geeksforgeeks.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  GeeksforGeeks
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-400">
              <p className="text-sm flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                Keep practicing! Consistency is key to mastering DSA.
              </p>
              <p className="text-sm">Made with dedication</p>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default DSAWebsite;
