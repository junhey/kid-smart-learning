"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface GameResultProps {
  correct: number;
  total: number;
  onRestart: () => void;
  onBack: () => void;
}

export default function GameResult({
  correct,
  total,
  onRestart,
  onBack,
}: GameResultProps) {
  const accuracy = Math.round((correct / total) * 100);
  const isPerfect = correct === total;
  const isGood = accuracy >= 80;

  useEffect(() => {
    // Launch confetti for good performance
    if (isGood) {
      const duration = isPerfect ? 3000 : 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: isPerfect ? 5 : 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#FFD700", "#FFA500", "#FF6B6B"],
        });
        confetti({
          particleCount: isPerfect ? 5 : 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#FFD700", "#FFA500", "#FF6B6B"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isGood, isPerfect]);

  const getMessage = () => {
    if (isPerfect) return "完美！你太棒了！🎉";
    if (accuracy >= 90) return "非常棒！继续加油！🌟";
    if (accuracy >= 80) return "很不错！再接再厉！👍";
    if (accuracy >= 60) return "不错哦！继续努力！💪";
    return "加油！再试一次！🎯";
  };

  const getTrophy = () => {
    if (isPerfect) return "🏆";
    if (accuracy >= 90) return "🥇";
    if (accuracy >= 80) return "🥈";
    if (accuracy >= 60) return "🥉";
    return "⭐";
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        {/* Trophy */}
        <motion.div
          className="text-9xl text-center mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {getTrophy()}
        </motion.div>

        {/* Message */}
        <motion.h2
          className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {getMessage()}
        </motion.h2>

        {/* Score Display */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-around items-center text-center">
            <div>
              <div className="text-5xl font-black text-green-500">{correct}</div>
              <div className="text-sm font-semibold text-gray-600 mt-1">答对</div>
            </div>
            <div className="text-4xl font-black text-gray-300">/</div>
            <div>
              <div className="text-5xl font-black text-blue-500">{total}</div>
              <div className="text-sm font-semibold text-gray-600 mt-1">总题数</div>
            </div>
          </div>
          <motion.div
            className="mt-4 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text">
              {accuracy}%
            </div>
            <div className="text-xs text-gray-500 mt-1">正确率</div>
          </motion.div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:scale-105 transition-transform shadow-lg"
          >
            🔄 再玩一次
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:scale-105 transition-transform shadow-lg"
          >
            🏠 返回
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
