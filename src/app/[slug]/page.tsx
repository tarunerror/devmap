"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import ultimateData from "@/data/ultimateData";
import { useProgressContext } from "@/components/ProgressProvider";
import MarkAsDone from "@/components/MarkAsDone";
import NoteButton from "@/components/NoteButton";
import type { Question, Category } from "@/data/types";
import { countQuestionsInContent, countQuestionsInCategory } from "@/utils/countUtils";

const ProgressRing = ({
  progress,
  size = 48,
  strokeWidth = 4,
  colorClass = "text-blue-500 dark:text-blue-400",
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

const BookmarkButton = ({
  isBookmarked,
  onToggle,
}: {
  isBookmarked: boolean;
  onToggle: () => void;
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`p-1.5 rounded-lg transition-all duration-300 ${
        isBookmarked
          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-amber-500"
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
    >
      <svg
        className="w-4 h-4"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
};

const QuestionCard = ({ question }: { question: Question }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isQuestionDone,
    isQuestionBookmarked,
    toggleDone,
    toggleBookmark,
    getQuestionNote,
    updateQuestionNote,
  } = useProgressContext();

  const isDone = isQuestionDone(question.questionId);
  const isBookmarked = isQuestionBookmarked(question.questionId);
  const note = getQuestionNote(question.questionId);

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer ${
        isDone
          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
          : "border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-0.5"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Mark as Done button */}
          <div className="flex-shrink-0 pt-0.5">
            <MarkAsDone
              isDone={isDone}
              onToggle={() => toggleDone(question.questionId)}
              size="md"
            />
          </div>

          {/* Question content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-900 dark:group-hover:to-blue-800 group-hover:text-blue-600 dark:group-hover:text-blue-300"
                }`}
              >
                {question.questionIndex + 1}
              </span>
              <h4
                className={`text-base font-medium truncate transition-colors ${
                  isDone
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }`}
              >
                {question.questionHeading}
              </h4>
            </div>
          </div>

          {/* Status badges and actions */}
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            {isDone && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/50 dark:to-green-900/50 text-emerald-600 dark:text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-700">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Done
              </span>
            )}
            {isBookmarked && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/50 dark:to-yellow-900/50 text-amber-600 dark:text-amber-300 text-xs font-semibold rounded-full flex items-center gap-1.5 border border-amber-200 dark:border-amber-700">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Saved
              </span>
            )}

            {/* Bookmark button */}
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={() => toggleBookmark(question.questionId)}
            />

            {/* Note button */}
            <NoteButton
              note={note}
              onSave={(newNote) => updateQuestionNote(question.questionId, newNote)}
            />

            {/* Expand/collapse toggle */}
            <div
              className={`p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors`}
            >
              <svg
                className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
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
            </div>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-2 px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          {question.questionLink && (
            <a
              href={question.questionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-blue-100 dark:border-blue-800"
              onClick={(e) => e.stopPropagation()}
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Tutorial
            </a>
          )}
          {question.gfgLink && (
            <a
              href={question.gfgLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/50 dark:hover:to-green-900/50 hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-emerald-100 dark:border-emerald-800"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              GFG
            </a>
          )}
          {question.leetCodeLink && (
            <a
              href={question.leetCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium rounded-xl hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/50 dark:hover:to-amber-900/50 hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-orange-100 dark:border-orange-800"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              LeetCode
            </a>
          )}
          {question.youTubeLink && (
            <a
              href={question.youTubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/50 dark:hover:to-rose-900/50 hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-red-100 dark:border-red-800"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ category }: { category: Category }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getCompletedCount } = useProgressContext();

  // Get all question IDs in this category
  const questionIds = category.questionList.map((q) => q.questionId);
  const completedCount = getCompletedCount(questionIds);
  const categoryTotalQuestions = countQuestionsInCategory(category);
  const progress = Math.round(
    (completedCount / categoryTotalQuestions) * 100,
  );

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between mb-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/80 dark:to-slate-800/80 rounded-xl cursor-pointer hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-800 dark:hover:to-slate-800 transition-all duration-300 border border-gray-100 dark:border-gray-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProgressRing progress={progress} size={40} strokeWidth={3} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
              {progress}%
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.categoryName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {completedCount}
              </span>{" "}
              of {categoryTotalQuestions} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className={`p-1.5 rounded-lg bg-white dark:bg-gray-700 shadow-sm transition-transform duration-300 ${isCollapsed ? "-rotate-90" : ""}`}
          >
            <svg
              className="w-5 h-5 text-gray-400"
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
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[5000px] opacity-100"
        }`}
      >
        <div className="grid gap-3 pl-4 sm:pl-12">
          {category.questionList.map((question) => (
            <QuestionCard key={question.questionId} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const resolvedParams = use(params);
  const {
    progress,
    getCompletedCount,
    setDarkMode: saveDarkMode,
  } = useProgressContext();

  useEffect(() => {
    setMounted(true);
    // Get dark mode from progress context or fallback
    const savedProgress = localStorage.getItem("dsa-progress");
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setDarkMode(parsed.darkMode || false);
    } else {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    saveDarkMode(darkMode);
  }, [darkMode, mounted, saveDarkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Find the topic based on slug
  const topic = ultimateData.data.content.find(
    (item) =>
      item.contentPath.replace(/^\//, "").toLowerCase() ===
      resolvedParams.slug.toLowerCase(),
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Topic Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The topic you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress using the context
  const allQuestionIds = topic.categoryList.flatMap((cat) =>
    cat.questionList.map((q) => q.questionId),
  );
  const completedCount = getCompletedCount(allQuestionIds);
  const topicTotalQuestions = countQuestionsInContent(topic);
  const topicProgress = Math.round(
    (completedCount / topicTotalQuestions) * 100,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {topic.contentHeading}
                </h1>
                {topic.contentSubHeading && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {topic.contentSubHeading}
                  </p>
                )}
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

              <div className="relative hidden sm:block">
                <ProgressRing
                  progress={topicProgress}
                  size={52}
                  strokeWidth={4}
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
                  {topicProgress}%
                </span>
              </div>
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
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {completedCount}
              </span>{" "}
              of {topicTotalQuestions} questions completed
            </div>
            <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${topicProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
          {topic.categoryList.map((category) => (
            <CategorySection key={category.categoryId} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
}
