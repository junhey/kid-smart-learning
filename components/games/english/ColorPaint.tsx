"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import wordsData from "@/data/english/words.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface ColorItem {
  word: string;
  emoji: string;
}

const OBJECTS = [
  { name: "apple", emoji: "🍎" },
  { name: "banana", emoji: "🍌" },
  { name: "star", emoji: "⭐" },
  { name: "flower", emoji: "🌸" },
  { name: "ball", emoji: "⚽" },
  { name: "sun", emoji: "☀️" },
];

const COLOR_MAP: Record<string, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#FBBF24",
  orange: "#F97316",
  purple: "#A855F7",
  pink: "#EC4899",
  brown: "#92400E",
  black: "#000000",
  white: "#FFFFFF",
};

const TOTAL_ROUNDS = 6;

export default function ColorPaint() {
  const colors = wordsData.colors as ColorItem[];
  const [round, setRound] = useState(0);
  const [targetColor, setTargetColor] = useState<ColorItem | null>(null);
  const [currentObject, setCurrentObject] = useState(OBJECTS[0]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { playCorrectSound, playWrongSound } = useSound();
  const { stars, addStar } = useReward();
  const { total, recordCorrect, recordWrong } = useProgress(TOTAL_ROUNDS);

  const startRound = useCallback(() => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    setTargetColor(target);
    setCurrentObject(obj);
    setSelectedColor(null);
  }, [colors]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const handleColorSelect = (color: ColorItem) => {
    if (selectedColor) return;

    setSelectedColor(color.word);

    if (color.word === targetColor?.word) {
      playCorrectSound();
      addStar(1);
      recordCorrect();
      setShowReward(true);

      setTimeout(() => {
        setShowReward(false);

        if (round + 1 >= TOTAL_ROUNDS) {
          setGameOver(true);
        } else {
          setRound(round + 1);
          startRound();
        }
      }, 1500);
    } else {
      playWrongSound();
      recordWrong();
      setTimeout(() => setSelectedColor(null), 800);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setGameOver(false);
    setSelectedColor(null);
    startRound();
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center bg-white p-8 rounded-3xl shadow-xl"
        >
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            Great Job!
          </h2>
          <p className="text-xl text-gray-600 mb-2">You scored: {stars}</p>
          <p className="text-lg text-gray-500 mb-6">
            You&apos;re a color master! 🌈
          </p>
          <button
            onClick={handleRestart}
            className="bg-purple-500 text-white px-8 py-3 rounded-full text-xl font-bold hover:bg-purple-600 transition-colors shadow-lg"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressBar current={total} total={TOTAL_ROUNDS} />

        <div className="text-right mb-4">
          <span className="text-2xl font-bold text-purple-600">
            ⭐ {stars}
          </span>
        </div>

        <motion.div
          key={round}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Paint the {currentObject.name}{" "}
            <span className="text-purple-600">{targetColor?.word}</span>!
          </h3>

          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                scale: selectedColor === targetColor?.word ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className="text-[120px] relative"
              style={{
                filter:
                  selectedColor && COLOR_MAP[selectedColor]
                    ? `drop-shadow(0 0 20px ${COLOR_MAP[selectedColor]})`
                    : "grayscale(100%)",
              }}
            >
              {currentObject.emoji}
            </motion.div>
          </div>

          <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
            {colors.map((color) => (
              <motion.button
                key={color.word}
                onClick={() => handleColorSelect(color)}
                disabled={!!selectedColor}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  aspect-square rounded-2xl text-4xl flex items-center justify-center
                  border-4 shadow-lg transition-all
                  ${
                    selectedColor === color.word
                      ? color.word === targetColor?.word
                        ? "border-green-500 ring-4 ring-green-300"
                        : "border-red-500 ring-4 ring-red-300"
                      : "border-gray-300 hover:border-gray-400"
                  }
                  ${selectedColor && selectedColor !== color.word ? "opacity-50" : ""}
                `}
                style={{ backgroundColor: COLOR_MAP[color.word] || "#ccc" }}
              >
                <span
                  className={
                    color.word === "white" || color.word === "yellow"
                      ? "drop-shadow-lg"
                      : ""
                  }
                >
                  {color.emoji}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {showReward && <StarReward show={showReward} />}
    </div>
  );
}
