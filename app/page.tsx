"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GameCard } from "@/components/ui/GameCard";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { stars, level } = useReward();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["⭐", "✨", "🌟", "💫", "🎈", "🎉"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl select-none opacity-20 pointer-events-none"
            aria-hidden="true"
            style={{
              top: `${10 + (i * 10)}%`,
              left: `${5 + (i * 15) % 90}%`,
            }}
            animate={prefersReducedMotion ? {} : {
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-10 pb-12 max-w-lg relative z-10">
        {/* Hero section with icon */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_8px_0_rgba(0,0,0,0.1)] mb-4 text-5xl">
            🎮
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-1">
            学习乐园
          </h1>
          <p className="text-gray-500">
            选择你今天想要挑战的世界！🚀
          </p>
        </motion.div>

        {/* Daily tasks card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-5 border-2 shadow-[0_8px_0_rgba(0,0,0,0.1)] bg-white border-gray-200 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h3 className="text-lg font-bold text-gray-800">今日任务</h3>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-xl">
              <span className="text-xs font-bold text-yellow-700">0/3 完成</span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { emoji: "🧮", title: "数学小达人", xp: 150, progress: 0, total: 3, desc: "局数学游戏" },
              { emoji: "🔤", title: "英语每日练", xp: 100, progress: 0, total: 2, desc: "局英语游戏" },
              { emoji: "⭐", title: "完美主义者", xp: 200, progress: 0, total: 1, desc: "次满分" }
            ].map((task, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-2xl border transition-all bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              >
                <span className="text-2xl flex-shrink-0">{task.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-gray-700">{task.title}</p>
                    <span className="text-xs text-yellow-600 font-bold flex-shrink-0">+{task.xp} XP</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(task.progress / task.total) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{task.progress}/{task.total} {task.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game worlds */}
        <div className="flex flex-col gap-5 mb-5">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              href="/math"
              className="block bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border-2 border-orange-200 shadow-[6px_6px_0px_#f97316] hover:shadow-[8px_8px_0px_#f97316] transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-5xl">🧮</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">数学世界</h2>
                    <p className="text-gray-400 text-xs">Math Adventure</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  练习加减乘除，挑战四则运算！
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["加法", "减法", "乘法", "除法"].map((tag, i) => (
                    <span key={i} className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold shadow-[0_4px_0_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform text-sm">
                  开始游戏 →
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href="/english"
              className="block bg-gradient-to-br from-sky-50 to-indigo-50 rounded-3xl border-2 border-sky-200 shadow-[6px_6px_0px_#0ea5e9] hover:shadow-[8px_8px_0px_#0ea5e9] transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-5xl">🔤</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">英语世界</h2>
                    <p className="text-gray-400 text-xs">English Adventure</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  学习英文单词，趣味听说读写！
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["看图识词", "听音辨词", "拼写挑战", "闪卡速记"].map((tag, i) => (
                    <span key={i} className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-400 text-white font-bold shadow-[0_4px_0_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform text-sm">
                  开始游戏 →
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Footer message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-400 text-sm pt-2"
        >
          每天练习，持续进步！💪
        </motion.p>
      </div>
    </div>
  );
}
