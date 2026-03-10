"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";

export default function RewardPanel() {
  const { stars, level, achievements, streak } = useReward();
  const starsForNextLevel = level * 10;
  const starsInCurrentLevel = stars - (level - 1) * 10;
  const progressPercent = Math.min(
    100,
    Math.round((starsInCurrentLevel / 10) * 100)
  );

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white rounded-3xl p-5 shadow-xl max-w-xs"
    >
      <h3 className="text-2xl font-black text-center text-gray-700 mb-4">
        My Progress 🏆
      </h3>

      {/* Stars */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.span
          className="text-5xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⭐
        </motion.span>
        <div>
          <div className="text-4xl font-black text-yellow-500">{stars}</div>
          <div className="text-sm text-gray-500 font-semibold">Total Stars</div>
        </div>
      </div>

      {/* Level */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-purple-700 text-xl">Level {level}</span>
          <span className="text-sm text-gray-500">
            {starsInCurrentLevel}/10 ⭐
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {10 - starsInCurrentLevel} more stars to Level {level + 1}!
        </p>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-orange-100 rounded-2xl p-3 mb-4 flex items-center gap-3"
        >
          <span className="text-3xl">🔥</span>
          <div>
            <div className="font-black text-orange-600 text-xl">{streak} Streak!</div>
            <div className="text-xs text-gray-500">Keep going!</div>
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <div>
        <h4 className="font-black text-gray-600 mb-2">Achievements:</h4>
        <div className="flex gap-2 flex-wrap">
          <AnimatePresence>
            {achievements.firstStar && (
              <motion.div
                key="firstStar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-yellow-100 rounded-xl px-3 py-2 text-center"
              >
                <div className="text-2xl">🌟</div>
                <div className="text-xs font-bold text-yellow-700">First Star</div>
              </motion.div>
            )}
            {achievements.perfectRound && (
              <motion.div
                key="perfectRound"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-100 rounded-xl px-3 py-2 text-center"
              >
                <div className="text-2xl">💯</div>
                <div className="text-xs font-bold text-green-700">Perfect!</div>
              </motion.div>
            )}
            {achievements.streak10 && (
              <motion.div
                key="streak10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-100 rounded-xl px-3 py-2 text-center"
              >
                <div className="text-2xl">🔥</div>
                <div className="text-xs font-bold text-orange-700">Streak 10</div>
              </motion.div>
            )}
            {!achievements.firstStar && !achievements.perfectRound && !achievements.streak10 && (
              <p className="text-sm text-gray-400 italic">
                Play games to earn achievements!
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
