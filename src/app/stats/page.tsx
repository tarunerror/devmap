"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProgressContext } from "@/components/ProgressProvider";
import ultimateData from "@/data/ultimateData";
import { countAllQuestions, countQuestionsInContent } from "@/utils/countUtils";

// Simple SVG-based charts
const RadarChart = ({
  data,
  labels,
  size = 300,
}: {
  data: number[];
  labels: string[];
  size?: number;
}) => {
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = data
    .map((v, i) => {
      const point = getPoint(v, i);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={data
            .map((_, i) => {
              const point = getPoint(level, i);
              return `${point.x},${point.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="text-gray-200 dark:text-gray-700"
        />
      ))}

      {/* Axis lines */}
      {data.map((_, i) => {
        const point = getPoint(100, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="currentColor"
            strokeWidth={1}
            className="text-gray-200 dark:text-gray-700"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(99, 102, 241, 0.3)"
        stroke="rgb(99, 102, 241)"
        strokeWidth={2}
        className="transition-all duration-700"
      />

      {/* Data points */}
      {data.map((v, i) => {
        const point = getPoint(v, i);
        return (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="rgb(99, 102, 241)"
            className="transition-all duration-700"
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const point = getPoint(120, i);
        return (
          <text
            key={i}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] fill-gray-600 dark:fill-gray-400 font-medium"
          >
            {label.length > 10 ? label.slice(0, 10) + "..." : label}
          </text>
        );
      })}
    </svg>
  );
};

const HeatmapCalendar = ({ data }: { data: Record<string, number> }) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // Last 52 weeks

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(d));
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getIntensity = (date: Date) => {
    const key = date.toISOString().split("T")[0];
    const count = data[key] || 0;
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
    if (count <= 3) return "bg-emerald-400 dark:bg-emerald-700";
    if (count <= 5) return "bg-emerald-500 dark:bg-emerald-600";
    return "bg-emerald-600 dark:bg-emerald-500";
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        {/* Month labels */}
        <div className="flex ml-8 mb-1">
          {months.map((month, i) => (
            <div
              key={i}
              className="text-xs text-gray-500 dark:text-gray-400 w-[52px]"
            >
              {month}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2 text-xs text-gray-500 dark:text-gray-400">
            {days.map((day, i) => (
              <div key={i} className="h-3 leading-3">
                {i % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`w-3 h-3 rounded-sm ${getIntensity(day)} transition-colors`}
                    title={`${day.toDateString()}: ${data[day.toISOString().split("T")[0]] || 0} problems`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

const DifficultyPieChart = ({
  easy,
  medium,
  hard,
  size = 200,
}: {
  easy: number;
  medium: number;
  hard: number;
  size?: number;
}) => {
  const total = easy + medium + hard;
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-gray-400">No data</span>
      </div>
    );
  }

  const createArc = (startAngle: number, endAngle: number) => {
    const start = ((startAngle - 90) * Math.PI) / 180;
    const end = ((endAngle - 90) * Math.PI) / 180;
    const radius = size * 0.4;
    const cx = size / 2;
    const cy = size / 2;

    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = 0;
  const segments = [
    { value: easy, color: "#22c55e", label: "Easy" },
    { value: medium, color: "#eab308", label: "Medium" },
    { value: hard, color: "#ef4444", label: "Hard" },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {segments.map((segment, i) => {
          if (segment.value === 0) return null;
          const segmentAngle = (segment.value / total) * 360;
          const path = createArc(currentAngle, currentAngle + segmentAngle);
          currentAngle += segmentAngle;
          return (
            <path
              key={i}
              d={path}
              fill={segment.color}
              className="transition-all duration-700 hover:opacity-80"
            />
          );
        })}
        {/* Center hole for donut effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.2}
          fill="currentColor"
          className="text-white dark:text-gray-900"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold fill-gray-800 dark:fill-gray-100"
        >
          {total}
        </text>
      </svg>
      <div className="flex gap-4 mt-4">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {segment.label}: {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
        <div className="text-white w-6 h-6">{icon}</div>
      </div>
    </div>
  </div>
);

export default function StatsPage() {
  const [darkMode, setDarkModeState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hasInitializedRef = React.useRef(false);
  const { progress, getCompletedCount, setDarkMode } = useProgressContext();

  useEffect(() => {
    if (hasInitializedRef.current) return;

    // Get dark mode from progress context or fallback
    const savedProgress = localStorage.getItem("dsa-progress");
    const darkModeToSet = savedProgress
      ? (JSON.parse(savedProgress)?.darkMode ?? false)
      : false;

    setTimeout(() => {
      setDarkModeState(darkModeToSet);
      setIsMounted(true);
      hasInitializedRef.current = true;
    }, 0);
  }, [setDarkModeState, setIsMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkMode(darkMode);
  }, [darkMode, setDarkMode, isMounted]);

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev);
  };

  // Calculate topic-wise progress for radar chart
  const topicProgress = useMemo(() => {
    return ultimateData.data.content.map((topic) => {
      const questionIds = topic.categoryList.flatMap((cat) =>
        cat.questionList.map((q) => q.questionId),
      );
      const completed = getCompletedCount(questionIds);
      const total = countQuestionsInContent(topic);
      return {
        name: topic.contentHeading,
        progress: Math.round((completed / total) * 100),
        completed,
        total,
      };
    });
  }, [getCompletedCount]);

  // Mock daily activity data (in a real app, this would come from the progress data)
  const activityData = useMemo(() => {
    const data: Record<string, number> = {};
    // Generate some sample data based on completed questions
    Object.values(progress.questions).forEach((q) => {
      if (q.done && q.completedAt) {
        const date = new Date(q.completedAt).toISOString().split("T")[0];
        data[date] = (data[date] || 0) + 1;
      }
    });
    return data;
  }, [progress.questions]);

  // Calculate difficulty distribution (mock - would need actual difficulty data)
  const difficultyData = useMemo(() => {
    // Roughly estimate based on topic (in real app, questions would have difficulty)
    const completed = progress.stats.totalCompleted;
    return {
      easy: Math.floor(completed * 0.4),
      medium: Math.floor(completed * 0.45),
      hard:
        completed - Math.floor(completed * 0.4) - Math.floor(completed * 0.45),
    };
  }, [progress.stats.totalCompleted]);

  // Get top 8 topics for radar chart
  const radarData = topicProgress.slice(0, 8);

  // Calculate interview readiness score
  const readinessScore = useMemo(() => {
    const totalCompleted = progress.stats.totalCompleted;
    const totalQuestions = countAllQuestions(ultimateData);
    const baseScore = (totalCompleted / totalQuestions) * 100;

    // Bonus for variety (completing across different topics)
    const topicsWithProgress = topicProgress.filter(
      (t) => t.completed > 0,
    ).length;
    const varietyBonus = (topicsWithProgress / topicProgress.length) * 10;

    // Bonus for streak
    const streakBonus = Math.min(progress.stats.streakDays * 2, 10);

    return Math.min(100, Math.round(baseScore + varietyBonus + streakBonus));
  }, [progress.stats, topicProgress]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      {/* Header */}
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
                  Your Progress Stats
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your DSA journey
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Problems Solved"
            value={progress.stats.totalCompleted}
            subtitle={`of ${countAllQuestions(ultimateData)} total`}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            gradient="from-emerald-500 to-green-600"
          />
          <StatCard
            title="Total XP"
            value={progress.stats.xp}
            subtitle={`Level ${progress.stats.level}`}
            icon={
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            title="Current Streak"
            value={`${progress.stats.streakDays} days`}
            subtitle="Keep it up!"
            icon={
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            }
            gradient="from-orange-500 to-red-600"
          />
          <StatCard
            title="Interview Ready"
            value={`${readinessScore}%`}
            subtitle="Estimated score"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            gradient="from-violet-500 to-purple-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Topic Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Topic Proficiency
            </h2>
            <RadarChart
              data={radarData.map((t) => t.progress)}
              labels={radarData.map((t) => t.name)}
              size={300}
            />
          </div>

          {/* Difficulty Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Difficulty Breakdown
            </h2>
            <div className="flex items-center justify-center py-4">
              <DifficultyPieChart
                easy={difficultyData.easy}
                medium={difficultyData.medium}
                hard={difficultyData.hard}
                size={220}
              />
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Activity Heatmap
          </h2>
          <HeatmapCalendar data={activityData} />
        </div>

        {/* Topic Progress List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Progress by Topic
          </h2>
          <div className="space-y-4">
            {topicProgress.map((topic, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {topic.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {topic.completed}/{topic.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">
                  {topic.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
