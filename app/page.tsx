"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";

export default function HomePage() {
  const { stars, level } = useReward();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🌟", "⭐", "✨", "🌈", "🦋", "🌸", "🍀", "🎈"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl select-none"
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

      {/* Header bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8 bg-white/80 rounded-full px-6 py-3 shadow-lg"
      >
        <span className="text-3xl">⭐</span>
        <span className="text-2xl font-bold text-yellow-600">{stars} Stars</span>
        <span className="text-gray-300 text-2xl">|</span>
        <span className="text-2xl">🏆</span>
        <span className="text-2xl font-bold text-purple-600">Level {level}</span>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 drop-shadow-lg leading-tight">
          Kid Smart
        </h1>
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-md">
          Learning! 🎓
        </h2>
        <p className="mt-3 text-xl text-gray-600 font-semibold">
          Fun games for curious kids! 🚀
        </p>
      </motion.div>

      {/* Main buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
          className="flex-1"
        >
          <Link href="/english" className="block">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="game-card bg-gradient-to-br from-orange-400 to-pink-400 text-white text-center"
            >
              <div className="text-7xl mb-4">📚</div>
              <h3 className="text-4xl font-black mb-2">English</h3>
              <p className="text-lg font-semibold opacity-90">
                Alphabet • Words • Phonics
              </p>
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {["🔤", "🐶", "🍎", "👂", "✍️"].map((e, i) => (
                  <span key={i} className="text-2xl">
                    {e}
                  </span>
                ))}
              </div>
              <div className="mt-4 bg-white/20 rounded-xl py-2 text-lg font-bold">
                5 Fun Games! 🎮
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
          className="flex-1"
        >
          <Link href="/math" className="block">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="game-card bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-center"
            >
              <div className="text-7xl mb-4">🔢</div>
              <h3 className="text-4xl font-black mb-2">Math</h3>
              <p className="text-lg font-semibold opacity-90">
                Count • Add • Shapes
              </p>
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {["🔢", "➕", "🔷", "⚖️", "🎯"].map((e, i) => (
                  <span key={i} className="text-2xl">
                    {e}
                  </span>
                ))}
              </div>
              <div className="mt-4 bg-white/20 rounded-xl py-2 text-lg font-bold">
                5 Fun Games! 🎮
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex gap-4 text-4xl"
      >
        {["🐱", "🐶", "🐸", "🦊", "🐼"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      <p className="mt-6 text-gray-400 text-sm">
        Ages 5-7 • Free Forever • Learn & Play!
      </p>
    </div>
  );
}
