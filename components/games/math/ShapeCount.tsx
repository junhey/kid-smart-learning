"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import Toast from "@/components/ui/Toast";

function CelebrationAnimation() {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const distance = 200;
          const x = 50 + distance * Math.cos(angle);
          const y = 50 + distance * Math.sin(angle);
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, x: "50vw", y: "50vh" }}
              animate={{ scale: 1, opacity: 1, x: `${x}vw`, y: `${y}vh` }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="absolute w-20 h-20 flex items-center justify-center text-4xl"
              style={{ left: -40, top: -40 }}
            >
              {"✨⭐🎉🌈🎈💖🎊💫🎯🚀🧠🧩".split("")[i]}
            </motion.div>
          );
        })}
        
        {/* Center explosion */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-yellow-400"
        >
          🎉
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

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
  const [celebrateAnimation, setCelebrateAnimation] = useState(false);
  const [wrongAnswerAnimation, setWrongAnswerAnimation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "correct" | "wrong" } | null>(null);
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
      setCelebrateAnimation(true);
      setToast({ message: `Perfect! You counted ${targetCount} ${shapeNames[targetShape].toLowerCase()}s! 🎉`, type: "correct" });
      roundRef.current += 1;
      
      if (roundRef.current >= TOTAL_ROUNDS) {
        setTimeout(() => {
          setToast(null);
          setGameOver(true);
        }, 2000);
      } else {
        setTimeout(() => {
          setCelebrateAnimation(false);
          setToast(null);
          generateRound();
        }, 1500);
      }
    } else {
      playWrongSound();
      recordWrong();
      setWrongAnswerAnimation(true);
      setToast({ message: `Try again! Count the ${shapeNames[targetShape].toLowerCase()}s carefully! 🔍`, type: "wrong" });
      setTimeout(() => {
        setWrongAnswerAnimation(false);
        setToast(null);
        setSelectedAnswer(null);
      }, 800);
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
    return <GameResult correct={correct} total={total} onRestart={handleRestart} onBack={handleBack} gameName="数形状" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Toast message={toast?.message || ""} type={toast?.type || "correct"} show={!!toast} />
      
      <div className="w-full max-w-2xl">
        <ProgressBar current={roundRef.current + 1} total={TOTAL_ROUNDS} />
      </div>

      {celebrateAnimation && <CelebrationAnimation />}

      {wrongAnswerAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-red-400/20 z-40 pointer-events-none"
        />
      )}

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
              animate={{
                opacity: 1,
                scale: wrongAnswerAnimation && selectedAnswer === option && option !== targetCount ? [1, 0.95, 1.05, 0.95, 1] : 1,
                x: wrongAnswerAnimation && selectedAnswer === option && option !== targetCount ? [0, -5, 5, -5, 5, -5, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`py-6 px-8 rounded-2xl text-3xl font-black transition-all ${
                selectedAnswer === option
                  ? selectedAnswer === targetCount
                    ? "bg-green-400 text-white shadow-xl scale-105"
                    : "bg-red-400 text-white"
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