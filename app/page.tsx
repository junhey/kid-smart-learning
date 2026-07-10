"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { HomePageSkeleton } from "@/components/ui/SkeletonLoader";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { WeeklyProgress } from "@/components/ui/WeeklyProgress";

/* ===== Decorative Blobs (background morphing shapes) ===== */
function BackgroundBlobs() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-right pink blob */}
      <motion.div
        className="blob-bg w-[400px] h-[400px] bg-pink-300"
        style={{ top: '-10%', right: '-8%' }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 40, 0, -30, 0],
          y: [0, -30, 0, 20, 0],
          scale: [1, 1.15, 1, 0.9, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-left purple blob */}
      <motion.div
        className="blob-bg w-[350px] h-[350px] bg-purple-300"
        style={{ bottom: '10%', left: '-5%' }}
        animate={prefersReducedMotion ? {} : {
          x: [0, -30, 0, 40, 0],
          y: [0, 20, 0, -25, 0],
          scale: [1, 0.9, 1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Center-right blue blob */}
      <motion.div
        className="blob-bg w-[300px] h-[300px] bg-blue-300"
        style={{ top: '50%', right: '-3%' }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 50, 0, -20, 0],
          y: [0, -20, 0, 30, 0],
          scale: [1, 1.1, 0.95, 1, 1.05],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Top-left orange blob */}
      <motion.div
        className="blob-bg w-[250px] h-[250px] bg-orange-200"
        style={{ top: '30%', left: '-3%' }}
        animate={prefersReducedMotion ? {} : {
          x: [0, 20, 0, -40, 0],
          y: [0, -15, 0, 25, 0],
          scale: [1, 1.05, 0.95, 1.1, 1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ===== Animated Mascot floating at bottom-right ===== */
function MascotCorner() {
  const [message, setMessage] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const messages = [
      "来学习吧！🎉",
      "你真棒！⭐",
      "加油加油！💪",
      "今天也要学习哟～",
      "我会陪着你！🦉",
    ];

    const showRandomMessage = () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setMessage(msg);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 3000);
    };

    showRandomMessage();
    const interval = setInterval(showRandomMessage, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", bounce: 0.5 }}
    >
      <div className="relative">
        {/* Speech bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute bottom-full right-0 mb-3 w-44"
            >
              <div className="glass-strong rounded-2xl p-3 text-sm font-bold text-gray-700 text-center shadow-xl">
                {message}
              </div>
              <div className="absolute -bottom-2 right-8 w-4 h-4 glass-strong transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot */}
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-2xl cursor-pointer border-2 border-white/50"
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
          onClick={() => {
            const messages = [
              "嘿嘿，你好呀！",
              "来找我玩吧～",
              "学习时间到！",
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            setMessage(msg);
            setShowBubble(true);
            setTimeout(() => setShowBubble(false), 3000);
          }}
        >
          🦉
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ===== Hero Stats Pill ===== */
function StatPill({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full glass shadow-sm`}
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-xl">{icon}</span>
      <div className="text-left leading-tight">
        <div className={`text-xs font-semibold opacity-70`}>{label}</div>
        <div className="text-sm font-black">{value}</div>
      </div>
    </motion.div>
  );
}

/* ===== Main Homepage ===== */
export default function HomePage() {
  const { stars, level } = useReward();
  const prefersReducedMotion = useReducedMotion();
  const { tasks, completedCount, totalCount, taskCompleted } = useDailyTasks();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <HomePageSkeleton />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-blue-50/80">
      {/* Dynamic canvas particle background */}
      <DynamicBackground theme="default" density="medium" />

      {/* Morphing background blobs */}
      <BackgroundBlobs />

      {/* ===== Navigation Bar ===== */}
      <nav
        className="sticky top-0 z-40 glass-strong shadow-sm"
        role="navigation"
        aria-label="主导航栏"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-9 h-9 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-xl flex items-center justify-center text-white text-lg shadow-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                🎓
              </motion.div>
              <div>
                <h1 className="text-base font-black text-gray-800">
                  <span className="rainbow-text bg-[length:300%_100%]">学习乐园</span>
                </h1>
              </div>
            </motion.div>

            {/* Right side: streak & level */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <StreakBadge />
              <StatPill icon="⭐" label="Stars" value={stars} color="text-amber-500" />
              <StatPill icon="🏆" label="Level" value={level} color="text-purple-500" />
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative pt-8 pb-4 px-4" aria-labelledby="hero-title">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero icon with orbit animation */}
          <motion.div
            className="relative inline-flex items-center justify-center mb-6"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.9 }}
          >
            {/* Orbit rings */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute w-28 h-28 rounded-full border-2 border-dashed border-pink-300/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-36 h-36 rounded-full border border-purple-300/40"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-44 h-44 rounded-full border border-dotted border-blue-300/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </>
            )}

            {/* Center icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full blur-2xl opacity-50 animate-pulse" />
              <motion.div
                className="relative w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                transition={{ y: { duration: 2, repeat: Infinity } }}
              >
                🎮
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2
              id="hero-title"
              className="text-4xl md:text-5xl font-black mb-3 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                欢迎来到学习乐园
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-4">
              选择你喜欢的世界，开启快乐学习之旅！🚀
            </p>

            {/* XP & Progress ring */}
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
          </motion.div>
        </div>
      </section>

      {/* ===== Main Content ===== */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 z-10" role="main">
        {/* Weekly Progress */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <WeeklyProgress />
        </motion.section>

        {/* Daily Tasks */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
          role="region"
          aria-labelledby="daily-tasks-title"
        >
          <div className="glass rounded-3xl overflow-hidden shadow-glass">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 px-5 py-4 border-b border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
                    📋
                  </div>
                  <div>
                    <h3 id="daily-tasks-title" className="text-lg font-black text-gray-800">
                      今日任务
                    </h3>
                    <p className="text-xs text-gray-500">Daily Challenges</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-white/80 rounded-full border border-amber-200 shadow-sm">
                  <span className="text-sm font-bold text-amber-600">
                    {completedCount}/{totalCount} 完成
                  </span>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-4 space-y-3">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className={`
                    group relative rounded-2xl p-4 cursor-pointer
                    bg-gradient-to-r ${task.bgColor}
                    border border-white/50
                    hover:shadow-lg transition-all duration-300 overflow-hidden
                  `}
                  role="article"
                  aria-label={`任务：${task.title}`}
                >
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                  {/* Completion glow */}
                  {task.progress >= task.total && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-amber-300/30 to-amber-200/30 rounded-2xl"
                    />
                  )}

                  <div className="relative flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${task.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                    >
                      {task.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">{task.title}</h4>
                            {task.progress >= task.total && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                                className="text-lg"
                              >
                                ✅
                              </motion.span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{task.subtitle}</p>
                        </div>
                        <span className="px-2 py-1 bg-white/80 rounded-full text-xs font-bold text-amber-600 border border-amber-200/50">
                          +{task.xp} XP
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${task.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(task.progress / task.total) * 100}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {task.progress}/{task.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Game Worlds */}
        <section className="grid md:grid-cols-2 gap-5 mb-8" aria-label="游戏世界选择">
          {/* Math World */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/math"
              className="group block relative h-full"
              aria-label="进入数学世界"
            >
              <motion.div
                className="relative h-full rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 opacity-90" />

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full" />

                <div className="relative p-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    🧮
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-black text-white mb-1">数学世界</h3>
                  <p className="text-sm text-white/80 mb-4">Math Adventure</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["加法", "减法", "乘法", "除法", "时钟", "图形"].map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
                    <span>开始探索</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* English World */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href="/english"
              className="group block relative h-full"
              aria-label="进入英语世界"
            >
              <motion.div
                className="relative h-full rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-400 opacity-90" />

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full" />

                <div className="relative p-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    🔤
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-black text-white mb-1">英语世界</h3>
                  <p className="text-sm text-white/80 mb-4">English Adventure</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["字母", "单词", "拼读", "押韵", "句子", "反义词"].map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
                    <span>开始探索</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mb-4"
        >
          <p className="text-sm text-gray-400">
            每天练习，持续进步！💪
          </p>
        </motion.div>
      </main>

      {/* ===== Floating Mascot ===== */}
      <MascotCorner />

      {/* ===== Task Completion Toast ===== */}
      <AnimatePresence>
        {taskCompleted && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.8 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-strong rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-2 border border-green-200/50">
              <span className="text-2xl animate-bounce">🎉</span>
              <div>
                <div className="font-bold text-gray-800 text-sm">任务完成！</div>
                <div className="text-xs text-gray-500">{taskCompleted}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
