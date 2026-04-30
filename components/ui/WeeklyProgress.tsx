/**
 * WeeklyProgress Component
 * 
 * A beautiful animated circular progress ring showing weekly learning activity.
 * Motivates children by visualizing their consistency — fills up as they
 * practice each day of the week. Features:
 * - SVG circular progress ring with gradient stroke
 * - Animated fill on mount
 * - Day-of-week dots showing active/inactive days
 * - Encouraging messages based on progress
 * - Fully accessible with ARIA attributes
 */

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DayActivity {
  day: string;      // Mon, Tue, etc.
  label: string;    // 一, 二, etc.
  active: boolean;
}

const STORAGE_KEY = "kid-smart-weekly-activity";

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? 6 : day - 1; // Adjust so Monday is start
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return monday.toISOString().split("T")[0];
}

function getTodayDayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Monday=0, Sunday=6
}

interface WeeklyState {
  weekStart: string;
  activeDays: boolean[]; // 7 elements, Mon-Sun
}

function loadWeeklyState(): WeeklyState {
  const currentWeekStart = getWeekStart();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as WeeklyState;
      if (parsed.weekStart === currentWeekStart) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // New week or first time
  return {
    weekStart: currentWeekStart,
    activeDays: [false, false, false, false, false, false, false],
  };
}

function saveWeeklyState(state: WeeklyState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function WeeklyProgress() {
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<WeeklyState>({
    weekStart: getWeekStart(),
    activeDays: [false, false, false, false, false, false, false],
  });

  useEffect(() => {
    const loaded = loadWeeklyState();
    // Mark today as active
    const todayIndex = getTodayDayIndex();
    loaded.activeDays[todayIndex] = true;
    saveWeeklyState(loaded);
    setState(loaded);
  }, []);

  const dayLabels: DayActivity[] = [
    { day: "Mon", label: "一", active: state.activeDays[0] },
    { day: "Tue", label: "二", active: state.activeDays[1] },
    { day: "Wed", label: "三", active: state.activeDays[2] },
    { day: "Thu", label: "四", active: state.activeDays[3] },
    { day: "Fri", label: "五", active: state.activeDays[4] },
    { day: "Sat", label: "六", active: state.activeDays[5] },
    { day: "Sun", label: "日", active: state.activeDays[6] },
  ];

  const activeDayCount = state.activeDays.filter(Boolean).length;
  const progress = activeDayCount / 7;

  // SVG circle parameters
  const size = 88;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Encouraging messages
  const getMessage = () => {
    if (activeDayCount >= 7) return { text: "完美一周！", emoji: "🏆" };
    if (activeDayCount >= 5) return { text: "太优秀了！", emoji: "🌟" };
    if (activeDayCount >= 3) return { text: "继续保持！", emoji: "💪" };
    if (activeDayCount >= 1) return { text: "好的开始！", emoji: "🌱" };
    return { text: "开始学习吧", emoji: "📚" };
  };

  const msg = getMessage();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.45, type: "spring", bounce: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl border border-indigo-100/50 shadow-xl shadow-indigo-100/30 overflow-hidden"
      role="region"
      aria-labelledby="weekly-progress-title"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-violet-100 px-6 py-3 border-b border-indigo-100/50">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">📊</span>
          <h3 id="weekly-progress-title" className="text-sm font-bold text-indigo-700">
            本周学习
          </h3>
          <span className="ml-auto text-xs font-medium text-indigo-500 bg-white/60 px-2 py-0.5 rounded-full">
            {activeDayCount}/7 天
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex items-center gap-5">
        {/* Circular Progress Ring */}
        <div className="relative flex-shrink-0" aria-hidden="true">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#E8E5FF"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress ring */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#weeklyGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                duration: 1.2,
                ease: "easeOut",
                delay: 0.6,
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="weeklyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, type: "spring", bounce: 0.5 }}
            >
              {msg.emoji}
            </motion.span>
          </div>
        </div>

        {/* Right side: day indicators + message */}
        <div className="flex-1 min-w-0">
          {/* Motivational text */}
          <p className="text-base font-bold text-gray-800 mb-1">
            {msg.text}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            这周已学习 {activeDayCount} 天{activeDayCount < 7 ? `，还差 ${7 - activeDayCount} 天就能集齐啦` : "，你是最棒的！"}
          </p>

          {/* Day dots */}
          <div 
            className="flex gap-1.5"
            role="img"
            aria-label={`本周学习记录：${activeDayCount} 天活跃`}
          >
            {dayLabels.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.7 + i * 0.06,
                  type: "spring",
                  bounce: 0.4,
                }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                    ${day.active
                      ? "bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-md shadow-indigo-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200/50"
                    }
                    ${i === getTodayDayIndex() && !day.active ? "ring-2 ring-indigo-300 ring-offset-1" : ""}
                  `}
                >
                  {day.active ? "✓" : day.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
