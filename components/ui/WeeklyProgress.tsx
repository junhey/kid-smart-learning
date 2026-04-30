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

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import confetti from "canvas-confetti";

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

const PERFECT_WEEK_KEY = "kid-smart-weekly-perfect-celebrated";

export function WeeklyProgress() {
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<WeeklyState>({
    weekStart: getWeekStart(),
    activeDays: [false, false, false, false, false, false, false],
  });
  const [showPerfectWeek, setShowPerfectWeek] = useState(false);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    const loaded = loadWeeklyState();
    // Mark today as active
    const todayIndex = getTodayDayIndex();
    const wasPerfectBefore = loaded.activeDays.every(Boolean);
    loaded.activeDays[todayIndex] = true;
    saveWeeklyState(loaded);
    setState(loaded);

    // Check if this completes a perfect week (all 7 days)
    const isPerfectNow = loaded.activeDays.every(Boolean);
    if (isPerfectNow && !wasPerfectBefore) {
      // First time achieving perfect week this session
      const celebratedKey = `${PERFECT_WEEK_KEY}-${loaded.weekStart}`;
      const alreadyCelebrated = localStorage.getItem(celebratedKey);
      if (!alreadyCelebrated) {
        localStorage.setItem(celebratedKey, "true");
        setShowPerfectWeek(true);
      }
    } else if (isPerfectNow) {
      // Already perfect, show the "perfect" styling without animation
      setShowPerfectWeek(true);
    }
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

  // Trigger confetti burst for perfect week
  useEffect(() => {
    if (showPerfectWeek && activeDayCount === 7 && !prefersReducedMotion && !confettiTriggered.current) {
      confettiTriggered.current = true;
      // Delay slightly for visual impact
      const timer = setTimeout(() => {
        // Golden confetti burst from center
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6, x: 0.5 },
          colors: ["#FFD700", "#FFA500", "#FF6B6B", "#A78BFA", "#58CC02"],
          ticks: 100,
          gravity: 1.2,
          scalar: 0.9,
          shapes: ["star", "circle"],
        });
        // Second burst after short delay
        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 100,
            origin: { y: 0.55, x: 0.3 },
            colors: ["#FFD700", "#FFE066", "#81C784"],
            ticks: 80,
            gravity: 1.0,
            scalar: 0.8,
          });
          confetti({
            particleCount: 40,
            spread: 100,
            origin: { y: 0.55, x: 0.7 },
            colors: ["#FF66C4", "#4DD0E1", "#A78BFA"],
            ticks: 80,
            gravity: 1.0,
            scalar: 0.8,
          });
        }, 300);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showPerfectWeek, activeDayCount, prefersReducedMotion]);

  // Encouraging messages
  const getMessage = () => {
    if (activeDayCount >= 7) return { text: "完美一周！", emoji: "🏆" };
    if (activeDayCount >= 5) return { text: "太优秀了！", emoji: "🌟" };
    if (activeDayCount >= 3) return { text: "继续保持！", emoji: "💪" };
    if (activeDayCount >= 1) return { text: "好的开始！", emoji: "🌱" };
    return { text: "开始学习吧", emoji: "📚" };
  };

  const msg = getMessage();
  const isPerfect = activeDayCount === 7;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.45, type: "spring", bounce: 0.3 }}
      className={`backdrop-blur-sm rounded-3xl border shadow-xl overflow-hidden relative ${
        isPerfect
          ? "bg-gradient-to-br from-yellow-50/90 via-amber-50/90 to-orange-50/90 border-yellow-300/60 shadow-yellow-200/40"
          : "bg-white/80 border-indigo-100/50 shadow-indigo-100/30"
      }`}
      role="region"
      aria-labelledby="weekly-progress-title"
    >
      {/* Perfect week shimmer overlay */}
      {isPerfect && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/40 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Header */}
      <div className={`px-6 py-3 border-b relative z-10 ${
        isPerfect
          ? "bg-gradient-to-r from-yellow-200/80 via-amber-200/80 to-orange-200/80 border-yellow-200/50"
          : "bg-gradient-to-r from-indigo-100 via-purple-100 to-violet-100 border-indigo-100/50"
      }`}>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg"
            aria-hidden="true"
            animate={isPerfect && !prefersReducedMotion ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            {isPerfect ? "🏆" : "📊"}
          </motion.span>
          <h3 id="weekly-progress-title" className={`text-sm font-bold ${
            isPerfect ? "text-amber-700" : "text-indigo-700"
          }`}>
            {isPerfect ? "完美一周！" : "本周学习"}
          </h3>
          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
            isPerfect
              ? "text-amber-700 bg-yellow-100/80 border border-yellow-300/50"
              : "text-indigo-500 bg-white/60"
          }`}>
            {isPerfect ? "7/7 ✨" : `${activeDayCount}/7 天`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex items-center gap-5 relative z-10">
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
              stroke={isPerfect ? "#FDE68A" : "#E8E5FF"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress ring */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isPerfect ? "url(#weeklyGradientPerfect)" : "url(#weeklyGradient)"}
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
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="weeklyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <linearGradient id="weeklyGradientPerfect" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl"
              initial={{ scale: 0 }}
              animate={isPerfect && !prefersReducedMotion
                ? { scale: [0, 1.3, 1], rotate: [0, -10, 10, 0] }
                : { scale: 1 }
              }
              transition={isPerfect
                ? { delay: 1.0, duration: 0.8, ease: "easeOut" }
                : { delay: 1.0, type: "spring", bounce: 0.5 }
              }
            >
              {msg.emoji}
            </motion.span>
          </div>
          {/* Perfect week outer glow ring */}
          {isPerfect && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-[-4px] rounded-full border-2 border-dashed border-yellow-400/60"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Right side: day indicators + message */}
        <div className="flex-1 min-w-0">
          {/* Motivational text */}
          <p className={`text-base font-bold mb-1 ${
            isPerfect ? "text-amber-800" : "text-gray-800"
          }`}>
            {isPerfect ? "🌟 完美一周！" : msg.text}
          </p>
          <p className={`text-xs mb-3 ${
            isPerfect ? "text-amber-600" : "text-gray-500"
          }`}>
            {isPerfect
              ? "连续学习7天，你是超级学霸！🎉"
              : `这周已学习 ${activeDayCount} 天${activeDayCount < 7 ? `，还差 ${7 - activeDayCount} 天就能集齐啦` : "，你是最棒的！"}`
            }
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
                      ? isPerfect
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md shadow-yellow-200"
                        : "bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-md shadow-indigo-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200/50"
                    }
                    ${i === getTodayDayIndex() && !day.active ? "ring-2 ring-indigo-300 ring-offset-1" : ""}
                  `}
                >
                  {day.active ? (isPerfect ? "⭐" : "✓") : day.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
