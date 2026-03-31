"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NumberCount from "@/components/games/math/NumberCount";
import AdditionGame from "@/components/games/math/AdditionGame";
import ShapeMatch from "@/components/games/math/ShapeMatch";
import CompareNumbers from "@/components/games/math/CompareNumbers";
import MathShooter from "@/components/games/math/MathShooter";
import ShapeCount from "@/components/games/math/ShapeCount";
import ClockGame from "@/components/games/math/ClockGame";
import MissingNumber from "@/components/games/math/MissingNumber";
import PatternMatch from "@/components/games/math/PatternMatch";
import { SequenceSort } from "@/components/games/math/SequenceSort";
import MemoryMatch from "@/components/games/math/MemoryMatch";
import Navigation from "@/components/layout/Navigation";
import { GameCard } from "@/components/ui/GameCard";
import { dailyTaskEvents } from "@/lib/daily-task-events";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MathPageSkeleton } from "@/components/ui/SkeletonLoader";

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
  {
    id: "clock",
    title: "Clock Time",
    emoji: "⏰",
    description: "Tell the time on the clock!",
    color: "from-yellow-400 to-orange-500",
    component: ClockGame,
  },
  {
    id: "missing",
    title: "Missing Number",
    emoji: "❓",
    description: "Find the missing number in the sequence!",
    color: "from-teal-400 to-cyan-500",
    component: MissingNumber,
  },
  {
    id: "pattern",
    title: "Pattern Match",
    emoji: "🔍",
    description: "What comes next in the pattern?",
    color: "from-purple-400 to-pink-500",
    component: PatternMatch,
  },
  {
    id: "sequence",
    title: "Sequence Sort",
    emoji: "🔢",
    description: "Put items in the right order!",
    color: "from-blue-400 to-purple-500",
    component: SequenceSort,
  },
  {
    id: "memory",
    title: "Memory Match",
    emoji: "🃏",
    description: "Find matching pairs!",
    color: "from-pink-400 to-purple-500",
    component: MemoryMatch,
  },
];

export default function MathPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const ActiveGameComponent = activeGame
    ? games.find((g) => g.id === activeGame)?.component
    : null;

  const handleGameComplete = () => {
    dailyTaskEvents.emitMathGame(); // Notify task system
    setActiveGame(null);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <MathPageSkeleton />;
  }

  if (ActiveGameComponent) {
    return (
      <div className="min-h-screen p-4">
        <Navigation onBack={handleGameComplete} title="Math Games" />
        <ActiveGameComponent onComplete={handleGameComplete} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-6 relative overflow-hidden"
    >
      {/* Floating decorative math elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          { emoji: "➕", top: "12%", left: "8%", delay: 0 },
          { emoji: "➖", top: "22%", right: "12%", delay: 0.2 },
          { emoji: "✖️", top: "35%", left: "5%", delay: 0.4 },
          { emoji: "➗", top: "18%", right: "6%", delay: 0.6 },
          { emoji: "🔢", top: "40%", right: "18%", delay: 0.8 },
          { emoji: "🎯", top: "28%", left: "15%", delay: 1.0 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-15"
            style={{ top: item.top, left: item.left, right: item.right }}
            animate={prefersReducedMotion ? {} : {
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: item.delay,
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      <Navigation onBack={null} title="Math Games" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
          Math Games 🔢
        </h1>
        <p className="text-xl text-gray-600 font-semibold">
          Numbers are fun! Pick a game!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
        {games.map((game, index) => {
          // 为数学游戏分配variant
          const variantOptions = ['default', 'info', 'primary'] as const;
          const variant = variantOptions[index % variantOptions.length];
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08, type: "spring", bounce: 0.4 }}
              onClick={() => setActiveGame(game.id)}
            >
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.emoji}
                variant={variant}
                className="cursor-pointer hover:scale-105"
              >
                <motion.div
                  className="mt-4 bg-white text-gray-800 rounded-xl py-2 text-center font-bold font-['Fredoka']"
                  whileHover={{ backgroundColor: "#FFC800" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Now! 🎮
                </motion.div>
              </GameCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-10 flex justify-center gap-4 text-4xl relative z-10"
      >
        {["🍎", "🍊", "🍋", "🍇", "🍓"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
            transition={prefersReducedMotion ? {} : { 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.3 
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
