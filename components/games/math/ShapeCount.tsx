"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";

type Shape = "circle" | "square" | "triangle" | "star";

const shapeEmojis: Record<Shape, string> = {
  circle: "🔵",
  square: "🟦",
  triangle: "🔺",
  star: "⭐",
};

const shapeNames: Record<Shape, string> = {
  circle: "Circle",
  square: "Square",
  triangle: "Triangle",
  star: "Star",
};

const TOTAL_ROUNDS = 10;

export default function ShapeCount() {
  const [targetShape, setTargetShape] = useState<Shape>("circle");
  const [targetCount, setTargetCount] = useState(0);
  const [shapes, setShapes] = useState<{ type: Shape; id: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const generateRound = useCallback(() => {
    const allShapes: Shape[] = ["circle", "square", "triangle", "star"];
    const target = allShapes[Math.floor(Math.random() * allShapes.length)];
    const count = Math.floor(Math.random() * 5) + 3; // 3-7
    
    const shapeList: { type: Shape; id: number }[] = [];
    
    // Add target shapes
    for (let i = 0; i < count; i++) {
      shapeList.push({ type: target, id: Math.random() });
    }
    
    // Add distractor shapes
    const distractorCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < distractorCount; i++) {
      const distractorTypes = allShapes.filter((s) => s !== target);
      const randomType = distractorTypes[Math.floor(Math.random() * distractorTypes.length)];
      shapeList.push({ type: randomType, id: Math.random() });
    }
    
    // Shuffle
    shapeList.sort(() => Math.random() - 0.5);
    
    setTargetShape(target);
    setTargetCount(count);
    setShapes(shapeList);
    setSelectedAnswer(null);
  }, []);

  useEffect(() => {
    reset();
    generateRound();
  }, [reset, generateRound]);

  const generateOptions = () => {
    const options = [targetCount];
    while (options.length < 4) {
      const opt = targetCount + Math.floor(Math.random() * 5) - 2;
      if (opt > 0 && opt <= 10 && !options.includes(opt)) {
        options.push(opt);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const options = generateOptions();

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const isAnswerCorrect = answer === targetCount;

    if (isAnswerCorrect) {
      playCorrectSound();
      recordCorrect();
      addStar(1);
      setShowReward(true);
      roundRef.current += 1;
      
      if (roundRef.current >= TOTAL_ROUNDS) {
        setTimeout(() => setGameOver(true), 1200);
      } else {
        setTimeout(() => {
          setShowReward(false);
          generateRound();
        }, 1200);
      }
    } else {
      playWrongSound();
      recordWrong();
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const handleRestart = () => {
    roundRef.current = 0;
    setGameOver(false);
    reset();
    generateRound();
  };

  const handleBack = () => {
    // This should navigate back to the main page
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (gameOver) {
    return <GameResult correct={correct} total={total} onRestart={handleRestart} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar current={roundRef.current + 1} total={TOTAL_ROUNDS} />
      </div>

      {showReward && <StarReward show={true} onComplete={() => {}} />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          Count the {shapeNames[targetShape]}s! {shapeEmojis[targetShape]}
        </h2>
        <p className="text-xl text-gray-600 font-semibold">
          How many {shapeNames[targetShape].toLowerCase()}s do you see?
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-4 gap-3 mb-8 p-6 bg-white rounded-3xl shadow-lg max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="text-5xl"
          >
            {shapeEmojis[shape.type]}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        <AnimatePresence mode="wait">
          {options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`py-6 px-8 rounded-2xl text-3xl font-black transition-all ${
                selectedAnswer === option
                  ? selectedAnswer === targetCount
                    ? "bg-green-400 text-white scale-110"
                    : "bg-red-400 text-white scale-90"
                  : "bg-gradient-to-br from-blue-400 to-cyan-400 text-white hover:shadow-xl"
              }`}
            >
              {option}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 text-4xl font-black ${
              selectedAnswer === targetCount ? "text-green-500" : "text-red-500"
            }`}
          >
            {selectedAnswer === targetCount ? "🎉 Amazing!" : "❌ Try again!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}