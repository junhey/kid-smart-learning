"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { colors, shadows, borderRadius, animations } from "@/lib/design-tokens";
import { playPerfectResult, playGoodResult, playFairResult } from "@/lib/game-sounds";

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
    // Launch confetti for good performance with Duolingo colors
    if (isGood) {
      const duration = isPerfect ? 3000 : 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: isPerfect ? 5 : 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: [
            colors.accent.yellow,   // 星星黄
            colors.accent.orange,   // 警告橙
            colors.accent.pink      // 成就粉
          ],
        });
        confetti({
          particleCount: isPerfect ? 5 : 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: [
            colors.accent.yellow,
            colors.accent.orange,
            colors.accent.pink
          ],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
    
    // 播放相应的音效
    if (isPerfect) {
      playPerfectResult();
    } else if (isGood) {
      playGoodResult();
    } else {
      playFairResult();
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

  const getResultColor = () => {
    if (isPerfect) return colors.primary.green;
    if (accuracy >= 90) return colors.accent.blue;
    if (accuracy >= 80) return colors.accent.purple;
    if (accuracy >= 60) return colors.accent.orange;
    return colors.accent.pink;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: colors.background.main,
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(88, 204, 2, 0.05), transparent 50%), radial-gradient(circle at 75% 75%, rgba(206, 130, 255, 0.05), transparent 50%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-8 shadow-2xl max-w-md w-full mx-4"
        style={{
          backgroundColor: colors.background.card,
          borderRadius: borderRadius['3xl'],
          boxShadow: shadows.lg
        }}
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
          className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          style={{ 
            color: getResultColor(),
            backgroundImage: `linear-gradient(45deg, ${getResultColor()}, ${colors.accent.purple})`
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {getMessage()}
        </motion.h2>

        {/* Score Display */}
        <motion.div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: isGood ? colors.status.correctBg : colors.background.subtle,
            border: `2px solid ${isGood ? colors.status.correct : colors.border.light}`,
            borderRadius: borderRadius['2xl']
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-around items-center text-center">
            <div>
              <div 
                className="text-5xl font-black"
                style={{ color: colors.status.correct }}
              >
                {correct}
              </div>
              <div 
                className="text-sm font-semibold mt-1"
                style={{ color: colors.text.secondary }}
              >
                答对
              </div>
            </div>
            <div 
              className="text-4xl font-black"
              style={{ color: colors.border.light }}
            >
              /
            </div>
            <div>
              <div 
                className="text-5xl font-black"
                style={{ color: colors.accent.blue }}
              >
                {total}
              </div>
              <div 
                className="text-sm font-semibold mt-1"
                style={{ color: colors.text.secondary }}
              >
                总题数
              </div>
            </div>
          </div>
          <motion.div
            className="mt-4 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <div 
              className="text-3xl font-black"
              style={{ color: getResultColor() }}
            >
              {accuracy}%
            </div>
            <div 
              className="text-xs mt-1"
              style={{ color: colors.text.muted }}
            >
              正确率
            </div>
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
            className="flex-1 relative font-bold py-4 px-6 text-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-1"
            style={{
              backgroundColor: colors.primary.green,
              color: colors.text.white,
              borderRadius: borderRadius.xl,
              boxShadow: shadows.button,
              border: `2px solid ${colors.primary.greenDark}`,
            }}
          >
            <span className="drop-shadow-md">🔄 再玩一次</span>
          </button>
          <button
            onClick={onBack}
            className="flex-1 relative font-bold py-4 px-6 text-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-1"
            style={{
              backgroundColor: colors.accent.blue,
              color: colors.text.white,
              borderRadius: borderRadius.xl,
              boxShadow: `0 4px 0 0 ${colors.accent.blue.replace('#', '#1A')}`,
              border: `2px solid ${colors.accent.blue.replace('#', '#1A')}`,
            }}
          >
            <span className="drop-shadow-md">🏠 返回选择</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
