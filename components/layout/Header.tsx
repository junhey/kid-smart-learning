"use client";

import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";

export default function Header() {
  const { stars, level, achievements } = useReward();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-md"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
          Kid Smart 🎓
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl">⭐</span>
            <span className="font-black text-yellow-700 text-lg">{stars}</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl">🏆</span>
            <span className="font-black text-purple-700 text-lg">Lv.{level}</span>
          </motion.div>

          {achievements.firstStar && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl"
              title="First Star!"
            >
              🌟
            </motion.div>
          )}
          {achievements.perfectRound && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl"
              title="Perfect Round!"
            >
              💯
            </motion.div>
          )}
          {achievements.streak10 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl"
              title="10 Streak!"
            >
              🔥
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
