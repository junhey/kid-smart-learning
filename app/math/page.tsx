"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import NumberCount from "@/components/games/math/NumberCount";
import AdditionGame from "@/components/games/math/AdditionGame";
import ShapeMatch from "@/components/games/math/ShapeMatch";
import CompareNumbers from "@/components/games/math/CompareNumbers";
import MathShooter from "@/components/games/math/MathShooter";
import ShapeCount from "@/components/games/math/ShapeCount";
import Navigation from "@/components/layout/Navigation";

const games = [
  {
    id: "count",
    title: "Count It!",
    emoji: "🔢",
    description: "Count the objects and pick the number!",
    color: "from-cyan-400 to-blue-400",
    component: NumberCount,
  },
  {
    id: "addition",
    title: "Adding Fun",
    emoji: "➕",
    description: "Add numbers with cute emojis!",
    color: "from-green-400 to-emerald-500",
    component: AdditionGame,
  },
  {
    id: "shapes",
    title: "Shape Match",
    emoji: "🔷",
    description: "Match shapes to their names!",
    color: "from-purple-400 to-violet-500",
    component: ShapeMatch,
  },
  {
    id: "compare",
    title: "Big or Small?",
    emoji: "⚖️",
    description: "Which number is bigger?",
    color: "from-orange-400 to-amber-500",
    component: CompareNumbers,
  },
  {
    id: "shooter",
    title: "Math Shooter",
    emoji: "🎯",
    description: "Shoot the correct answer bubble!",
    color: "from-pink-400 to-rose-500",
    component: MathShooter,
  },
  {
    id: "shapecount",
    title: "Count Shapes",
    emoji: "🔷",
    description: "How many shapes can you count?",
    color: "from-indigo-400 to-purple-500",
    component: ShapeCount,
  },
];

export default function MathPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const ActiveGameComponent = activeGame
    ? games.find((g) => g.id === activeGame)?.component
    : null;

  if (ActiveGameComponent) {
    return (
      <div className="min-h-screen p-4">
        <Navigation onBack={() => setActiveGame(null)} title="Math Games" />
        <ActiveGameComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Navigation onBack={null} title="Math Games" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
          Math Games 🔢
        </h1>
        <p className="text-xl text-gray-600 font-semibold">
          Numbers are fun! Pick a game!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveGame(game.id)}
            className={`game-card bg-gradient-to-br ${game.color} text-white cursor-pointer`}
          >
            <div className="text-6xl mb-3 text-center">{game.emoji}</div>
            <h3 className="text-2xl font-black text-center mb-2">
              {game.title}
            </h3>
            <p className="text-center text-white/90 font-semibold">
              {game.description}
            </p>
            <motion.div
              className="mt-4 bg-white/20 rounded-xl py-2 text-center font-bold"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.35)" }}
            >
              Play Now! 🎮
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-10 flex justify-center gap-4 text-4xl"
      >
        {["🍎", "🍊", "🍋", "🍇", "🍓"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
