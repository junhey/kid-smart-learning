"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AlphabetBalloon from "@/components/games/english/AlphabetBalloon";
import AlphabetMatch from "@/components/games/english/AlphabetMatch";
import WordMatch from "@/components/games/english/WordMatch";
import PhonicsGame from "@/components/games/english/PhonicsGame";
import ListenAndChoose from "@/components/games/english/ListenAndChoose";
import SentenceBuilder from "@/components/games/english/SentenceBuilder";
import ColorPaint from "@/components/games/english/ColorPaint";
import AntonymsMatch from "@/components/games/english/AntonymsMatch";
import Navigation from "@/components/layout/Navigation";
import { GameCard } from "@/components/ui/GameCard";
import { Button } from "@/components/ui/Button";
import { Mascot, mascotMessages } from "@/components/Mascot";

const games = [
  {
    id: "alphabet",
    title: "字母气球",
    emoji: "🎈",
    description: "戳对字母气球！",
    component: AlphabetBalloon,
  },
  {
    id: "wordmatch",
    title: "单词配对",
    emoji: "🐶",
    description: "图片和单词配对！",
    component: WordMatch,
  },
  {
    id: "alphabetmatch",
    title: "字母配对",
    emoji: "🔠",
    description: "选择字母的正确读音！",
    component: AlphabetMatch,
  },
  {
    id: "phonics",
    title: "自然拼读",
    emoji: "🔤",
    description: "找出对应开头的单词！",
    component: PhonicsGame,
  },
  {
    id: "listen",
    title: "听音选择",
    emoji: "👂",
    description: "听单词选图片！",
    component: ListenAndChoose,
  },
  {
    id: "sentence",
    title: "造句游戏",
    emoji: "✍️",
    description: "用单词组句子！",
    component: SentenceBuilder,
  },
  {
    id: "colorpaint",
    title: "颜色涂色",
    emoji: "🎨",
    description: "给物体涂颜色！",
    component: ColorPaint,
  },
  {
    id: "antonyms",
    title: "反义词配对",
    emoji: "🔄",
    description: "找出相反的词！",
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Navigation onBack={() => setActiveGame(null)} title="英语游戏" />
        <ActiveGameComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 p-6">
      <Navigation onBack={null} title="英语游戏" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
          English Games 📚
        </h1>
        <p className="text-xl text-gray-600">
          选一个游戏开始学习吧！
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {games.map((game, index) => {
          // 为不同游戏分配不同variant
          const variantOptions = ['default', 'primary', 'info'] as const;
          const variant = variantOptions[index % variantOptions.length];
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.emoji}
                variant={variant}
                className="cursor-pointer hover:scale-105"
              >
                <Button
                  variant={variant === 'primary' ? 'primary' : variant === 'info' ? 'primary' : 'success'}
                  size="lg"
                  fullWidth
                  onClick={() => setActiveGame(game.id)}
                >
                  开始游戏 🎮
                </Button>
              </GameCard>
            </motion.div>
          );
        })}
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

      {/* Mascot */}
      <Mascot 
        message={mascotMessages.welcome}
        mood="happy"
      />
    </div>
  );
}
