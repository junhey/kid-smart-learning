"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { HomePageSkeleton } from "@/components/ui/SkeletonLoader";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { WeeklyProgress } from "@/components/ui/WeeklyProgress";

export default function HomePage() {
  const { stars, level } = useReward();
  const prefersReducedMotion = useReducedMotion();
  const { tasks, completedCount, totalCount, taskCompleted } = useDailyTasks();
  
  // Loading state management
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial data loading + allow time for animations to prep
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 稍微延长一点，让骨架屏动画更自然
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show skeleton while loading
  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
    >
      {/* Top Navigation Bar */}
      <nav 
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/50 shadow-sm"
        role="navigation"
        aria-label="主导航栏"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-200">
                🎓
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-800">学习乐园</h1>
                <p className="text-xs text-gray-500">Learning Paradise</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3" role="status" aria-label="用户统计信息">
              <StreakBadge />
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full border border-yellow-200/50 shadow-sm">
                <span className="text-xl" aria-hidden="true">⭐</span>
                <div className="text-left">
                  <div className="text-xs text-amber-600 font-medium">Stars</div>
                  <div className="text-sm font-bold text-amber-700" aria-label={`${stars} 颗星星`}>{stars}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200/50 shadow-sm">
                <span className="text-xl" aria-hidden="true">🏆</span>
                <div className="text-left">
                  <div className="text-xs text-purple-600 font-medium">Level</div>
                  <div className="text-sm font-bold text-purple-700" aria-label={`等级 ${level}`}>{level}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Decorative Elements */}
      <section 
        className="relative pt-12 pb-8 px-4 overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[
            { emoji: "✨", top: "15%", left: "10%", delay: 0 },
            { emoji: "🌟", top: "25%", right: "15%", delay: 0.2 },
            { emoji: "💫", top: "40%", left: "8%", delay: 0.4 },
            { emoji: "🎈", top: "20%", right: "8%", delay: 0.6 },
            { emoji: "🎨", top: "35%", right: "20%", delay: 0.8 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              style={{ top: item.top, left: item.left, right: item.right }}
              animate={prefersReducedMotion ? {} : {
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0],
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: item.delay,
              }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Hero Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="inline-flex items-center justify-center mb-6"
            aria-hidden="true"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full blur-xl opacity-40 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-purple-300">
                🎮
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 
              id="hero-title"
              className="text-5xl md:text-6xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
                欢迎来到学习乐园
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              选择你喜欢的世界，开启快乐学习之旅！🚀
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main 
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        role="main"
      >
        {/* Streak Card */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <StreakBadge expanded />
        </motion.section>

        {/* Weekly Progress Card */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <WeeklyProgress />
        </motion.section>

        {/* Daily Tasks Card */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
          role="region"
          aria-labelledby="daily-tasks-title"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/50 shadow-xl shadow-purple-100/50 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 px-6 py-4 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
                    📋
                  </div>
                  <div>
                    <h3 
                      id="daily-tasks-title"
                      className="text-xl font-bold text-gray-800"
                    >
                      今日任务
                    </h3>
                    <p className="text-sm text-gray-600">Daily Challenges</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white rounded-full border border-yellow-200 shadow-sm">
                  <span className="text-sm font-bold text-yellow-700">
                    {completedCount}/{totalCount} 完成
                  </span>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="p-6 space-y-4">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`group relative bg-gradient-to-r ${task.bgColor} rounded-2xl border border-gray-100/50 p-5 hover:shadow-lg focus-within:ring-4 focus-within:ring-purple-400/30 transition-all duration-300 cursor-pointer overflow-hidden`}
                  role="article"
                  aria-label={`任务：${task.title}，${task.subtitle}，进度 ${task.progress}/${task.total}`}
                  tabIndex={0}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                  
                  {/* Completion Glow */}
                  {task.progress >= task.total && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 via-yellow-300/30 to-yellow-200/30 rounded-2xl"
                      aria-hidden="true"
                    />
                  )}
                  
                  <div className="relative flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${task.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0`} aria-hidden="true">
                      {task.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                            {task.progress >= task.total && (
                              <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.6 }}
                                className="text-2xl"
                                aria-label="已完成"
                              >
                                ✅
                              </motion.span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{task.subtitle}</p>
                        </div>
                        <div className="px-3 py-1 bg-white/80 rounded-full border border-yellow-200/50 shadow-sm ml-2">
                          <span className="text-xs font-bold text-yellow-700">+{task.xp} XP</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>进度</span>
                          <span className="font-medium">
                            {task.progress}/{task.total}
                          </span>
                        </div>
                        <div 
                          className="h-2.5 bg-white/60 rounded-full overflow-hidden border border-gray-200/30"
                          role="progressbar"
                          aria-valuenow={task.progress}
                          aria-valuemin={0}
                          aria-valuemax={task.total}
                          aria-label={`任务进度：${task.progress} / ${task.total}`}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${task.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(task.progress / task.total) * 100}%` 
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Game Worlds Grid */}
        <section 
          className="grid md:grid-cols-2 gap-6 mb-8"
          role="region"
          aria-label="游戏世界选择"
        >
          {/* Math World */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href="/math"
              className="group block bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl border border-orange-200/50 shadow-xl shadow-orange-100/50 overflow-hidden hover:shadow-2xl hover:shadow-orange-200/50 focus:ring-4 focus:ring-orange-400/50 focus:outline-none transition-all duration-300 h-full"
              aria-label="进入数学世界，练习加减乘除"
            >
              {/* Card Header with gradient */}
              <div className="relative bg-gradient-to-r from-orange-400 to-red-400 px-6 py-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" aria-hidden="true" />
                <div className="relative flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-2xl shadow-orange-600/30 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                    🧮
                  </div>
                  <div className="text-white">
                    <h3 className="text-3xl font-black mb-1">数学世界</h3>
                    <p className="text-orange-100 text-sm font-medium">Math Adventure</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  练习加减乘除，挑战四则运算，成为数学小达人！
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["加法", "减法", "乘法", "除法"].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white border border-orange-200/50 text-orange-700 text-sm font-bold rounded-full shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold rounded-2xl shadow-lg shadow-orange-300/50 group-hover:shadow-xl group-hover:shadow-orange-400/50 group-hover:scale-105 transition-all duration-300">
                    <span>开始游戏</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* English World */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <Link
              href="/english"
              className="group block bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 rounded-3xl border border-blue-200/50 shadow-xl shadow-blue-100/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/50 focus:ring-4 focus:ring-blue-400/50 focus:outline-none transition-all duration-300 h-full"
              aria-label="进入英语世界，学习英文单词"
            >
              {/* Card Header with gradient */}
              <div className="relative bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" aria-hidden="true" />
                <div className="relative flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                    🔤
                  </div>
                  <div className="text-white">
                    <h3 className="text-3xl font-black mb-1">英语世界</h3>
                    <p className="text-blue-100 text-sm font-medium">English Adventure</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  学习英文单词，趣味听说读写，轻松掌握英语！
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["看图识词", "听音辨词", "拼写挑战", "闪卡速记"].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white border border-blue-200/50 text-blue-700 text-sm font-bold rounded-full shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-300/50 group-hover:shadow-xl group-hover:shadow-blue-400/50 group-hover:scale-105 transition-all duration-300">
                    <span>开始游戏</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            每天练习，持续进步！💪
          </p>
        </motion.div>
      </main>

      {/* Task Completion Toast */}
      <AnimatePresence>
        {taskCompleted && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-green-500/50 border border-white/20 flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <div className="font-bold text-lg">任务完成！</div>
                <div className="text-sm text-green-50">{taskCompleted}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
