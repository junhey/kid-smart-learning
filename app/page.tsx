"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { GameCard } from "@/components/ui/GameCard";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { stars, level } = useReward();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🌟", "⭐", "✨", "🌈", "🦋", "🌸", "🍀", "🎈"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl select-none opacity-30"
            style={{
              left: `${10 + i * 11}%`,
              top: `${5 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header bar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between bg-white rounded-3xl px-6 py-4 shadow-lg mb-8"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">⭐</span>
            <div>
              <div className="text-sm text-gray-500 font-medium">Stars</div>
              <div className="text-2xl font-bold text-[#FFC800]">{stars}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-sm text-gray-500 font-medium">Level</div>
              <div className="text-2xl font-bold text-[#CE82FF]">{level}</div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#CE82FF] mb-4">
            Kid Smart Learning
          </h1>
          <p className="text-2xl text-gray-600 font-semibold">
            让学习充满乐趣！🎉
          </p>
        </motion.div>

        {/* Main cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Link href="/english">
              <GameCard
                title="English 英语"
                description="字母、单词、自然拼读"
                icon="📚"
                className="hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex justify-center gap-3 mb-4">
                  {["🔤", "🐶", "🍎", "👂", "✍️"].map((e, i) => (
                    <span key={i} className="text-3xl">{e}</span>
                  ))}
                </div>
                <Button variant="primary" size="lg" fullWidth>
                  开始学习 →
                </Button>
              </GameCard>
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Link href="/math">
              <GameCard
                title="Math 数学"
                description="数数、加法、图形"
                icon="🔢"
                className="hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="flex justify-center gap-3 mb-4">
                  {["🔢", "➕", "🔷", "⚖️", "🎯"].map((e, i) => (
                    <span key={i} className="text-3xl">{e}</span>
                  ))}
                </div>
                <Button variant="success" size="lg" fullWidth>
                  开始挑战 →
                </Button>
              </GameCard>
            </Link>
          </motion.div>
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center gap-4 text-4xl mb-4">
            {["🐱", "🐶", "🐸", "🦊", "🐼"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            适合 5-7 岁 • 永久免费 • 寓教于乐
          </p>
        </motion.div>
      </div>
    </div>
  );
}
