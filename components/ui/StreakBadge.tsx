/**
 * StreakBadge Component
 * Displays the user's daily streak with a fire animation
 * Inspired by Duolingo's streak counter - the #1 retention mechanic
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStreak } from "@/hooks/useStreak";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StreakBadgeProps {
  /** Show expanded view with more details */
  expanded?: boolean;
  /** Additional className */
  className?: string;
}

export function StreakBadge({ expanded = false, className = "" }: StreakBadgeProps) {
  const { currentStreak, longestStreak, isNewDay } = useStreak();
  const prefersReducedMotion = useReducedMotion();

  // Determine flame color based on streak length
  const getFlameStyle = () => {
    if (currentStreak >= 30) return { gradient: "from-purple-400 to-pink-500", glow: "shadow-purple-300" };
    if (currentStreak >= 14) return { gradient: "from-orange-400 to-red-500", glow: "shadow-red-300" };
    if (currentStreak >= 7) return { gradient: "from-orange-400 to-amber-500", glow: "shadow-orange-300" };
    if (currentStreak >= 3) return { gradient: "from-yellow-400 to-orange-500", glow: "shadow-yellow-300" };
    return { gradient: "from-gray-300 to-gray-400", glow: "shadow-gray-200" };
  };

  const flameStyle = getFlameStyle();
  const isActive = currentStreak >= 1;

  if (!expanded) {
    // Compact badge for nav bar
    return (
      <motion.div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
          isActive 
            ? `bg-gradient-to-r from-orange-50 to-red-50 border-orange-200/50 shadow-sm ${flameStyle.glow}` 
            : "bg-gray-50 border-gray-200/50"
        } ${className}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        role="status"
        aria-label={`学习连续 ${currentStreak} 天`}
      >
        <motion.span
          className="text-lg"
          animate={prefersReducedMotion || !isActive ? {} : {
            scale: [1, 1.2, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          aria-hidden="true"
        >
          {isActive ? "🔥" : "💤"}
        </motion.span>
        <span className={`text-sm font-bold ${isActive ? "text-orange-700" : "text-gray-500"}`}>
          {currentStreak}
        </span>
      </motion.div>
    );
  }

  // Expanded streak card
  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl border border-orange-200/50 p-6 ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.3 }}
      role="region"
      aria-labelledby="streak-title"
    >
      {/* Background glow effect */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-orange-300/30 to-red-300/30 blur-2xl"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </div>
      )}

      <div className="relative z-10 flex items-center gap-5">
        {/* Fire icon */}
        <div className="flex-shrink-0">
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${flameStyle.gradient} flex items-center justify-center shadow-lg ${flameStyle.glow}`}
            animate={prefersReducedMotion || !isActive ? {} : {
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <motion.span
              className="text-4xl"
              animate={prefersReducedMotion || !isActive ? {} : {
                rotate: [0, -8, 8, 0],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              aria-hidden="true"
            >
              {isActive ? "🔥" : "❄️"}
            </motion.span>
          </motion.div>
        </div>

        {/* Text content */}
        <div className="flex-1">
          <h3
            id="streak-title"
            className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1"
          >
            学习连击
          </h3>
          <div className="flex items-baseline gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStreak}
                className={`text-4xl font-black ${isActive ? "text-orange-600" : "text-gray-400"}`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
              >
                {currentStreak}
              </motion.span>
            </AnimatePresence>
            <span className="text-lg font-bold text-orange-500">天</span>
          </div>
          {longestStreak > currentStreak && (
            <p className="text-xs text-orange-500/70 mt-0.5">
              最高纪录：{longestStreak} 天 🏆
            </p>
          )}
        </div>

        {/* Motivational badge */}
        {currentStreak >= 7 && (
          <motion.div
            className="flex-shrink-0 px-3 py-1.5 bg-white/80 rounded-full border border-orange-200/50 shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
          >
            <span className="text-xs font-bold text-orange-600">
              {currentStreak >= 30 ? "🌟 超级学霸" : currentStreak >= 14 ? "🔥 学习达人" : "💪 坚持不错"}
            </span>
          </motion.div>
        )}
      </div>

      {/* New day celebration */}
      <AnimatePresence>
        {isNewDay && currentStreak > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 mt-4 pt-4 border-t border-orange-200/30"
          >
            <p className="text-sm text-orange-700 font-medium text-center">
              🎉 太棒了！你已经连续学习 {currentStreak} 天了！继续保持！
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
