"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import AlphabetBalloon from "@/components/games/english/AlphabetBalloon";
import WordMatch from "@/components/games/english/WordMatch";
import PhonicsGame from "@/components/games/english/PhonicsGame";
import ListenAndChoose from "@/components/games/english/ListenAndChoose";
import SentenceBuilder from "@/components/games/english/SentenceBuilder";
import ColorPaint from "@/components/games/english/ColorPaint";
import AntonymsMatch from "@/components/games/english/AntonymsMatch";
import Navigation from "@/components/layout/Navigation";

const games = [
  {
    id: "alphabet",
    title: "Alphabet Balloons",
    emoji: "🎈",
    description: "Pop the right letter balloon!",
    color: "from-orange-400 to-red-400",
    component: AlphabetBalloon,
  },
  {
    id: "wordmatch",
    title: "Word Match",
    emoji: "🐶",
    description: "Match pictures to words!",
    color: "from-green-400 to-teal-400",
    component: WordMatch,
  },
  {
    id: "phonics",
    title: "Phonics Fun",
    emoji: "🔤",
    description: "Find what starts with the letter!",
    color: "from-blue-400 to-indigo-400",
    component: PhonicsGame,
  },
  {
    id: "listen",
    title: "Listen & Choose",
    emoji: "👂",
    description: "Hear the word and pick it!",
    color: "from-purple-400 to-pink-400",
    component: ListenAndChoose,
  },
  {
    id: "sentence",
    title: "Sentence Builder",
    emoji: "✍️",
    description: "Build sentences with words!",
    color: "from-yellow-400 to-orange-400",
    component: SentenceBuilder,
  },
  {
    id: "colorpaint",
    title: "Color Paint",
    emoji: "🎨",
    description: "Paint objects with colors!",
    color: "from-pink-400 to-purple-400",
    component: ColorPaint,
  },
  {
    id: "antonyms",
    title: "Antonyms Match",
    emoji: "🔄",
    description: "Find the opposite words!",
    color: "from-cyan-400 to-blue-400",
    component: AntonymsMatch,
  },
];

export default function EnglishPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const ActiveGameComponent = activeGame
    ? games.find((g) => g.id === activeGame)?.component
    : null;

  if (ActiveGameComponent) {
    return (
      <div className="min-h-screen p-4">
        <Navigation onBack={() => setActiveGame(null)} title="English Games" />
        <ActiveGameComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Navigation onBack={null} title="English Games" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-2">
          English Games 📚
        </h1>
        <p className="text-xl text-gray-600 font-semibold">
          Pick a game to start learning!
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
        {["🦁", "🐘", "🦒", "🐬", "🦜"].map((emoji, i) => (
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
