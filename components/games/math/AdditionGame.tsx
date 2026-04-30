"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Toast from "@/components/ui/Toast";
import { shuffleArray, randomInt } from "@/lib/gameUtils";

const EMOJIS = ["🍎", "🐶", "⭐", "🌸", "🦋", "🎈", "🍊", "🐱", "🔵", "🍓"];
const TOTAL_ROUNDS = 10;

interface Question {
  a: number;
  b: number;
  answer: number;
  isAddition: boolean;
  emoji: string;
  options: number[];
}

function buildQuestion(): Question {
  const patterns = [
    // Pattern 1: Simple addition (1-5 + 1-5, answer ≤ 10)
    () => {
      const a = randomInt(1, 5);
      const b = randomInt(1, Math.min(5, 10 - a));
      return { a, b, answer: a + b, isAddition: true };
    },
    // Pattern 2: Addition to 10 (e.g., 7+3, 6+4)
    () => {
      const a = randomInt(4, 9);
      const b = 10 - a;
      return { a, b, answer: 10, isAddition: true };
    },
    // Pattern 3: Larger single-digit addition (5-9 + 1-9, answer ≤ 18)
    () => {
      const a = randomInt(5, 9);
      const b = randomInt(1, 9);
      return { a, b, answer: a + b, isAddition: true };
    },
    // Pattern 4: Addition with carry (e.g., 8+7=15, 9+6=15)
    () => {
      const a = randomInt(6, 9);
      const b = randomInt(6, 9);
      return { a, b, answer: a + b, isAddition: true };
    },
    // Pattern 5: Simple subtraction (5-10 minus 1-5)
    () => {
      const answer = randomInt(1, 8);
      const b = randomInt(1, 5);
      const a = answer + b;
      return { a, b, answer, isAddition: false };
    },
    // Pattern 6: Subtraction from 10 (10-3, 10-7, etc.)
    () => {
      const b = randomInt(1, 9);
      const a = 10;
      return { a, b, answer: a - b, isAddition: false };
    },
    // Pattern 7: Larger subtraction (11-18 minus 1-9)
    () => {
      const a = randomInt(11, 18);
      const b = randomInt(1, Math.min(9, a - 1));
      return { a, b, answer: a - b, isAddition: false };
    },
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const { a, b, answer, isAddition } = pattern();

  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const wrongSet = new Set<number>();
  while (wrongSet.size < 3) {
    const w = randomInt(Math.max(0, answer - 3), answer + 3);
    if (w !== answer && w >= 0) wrongSet.add(w);
  }
  const options = shuffleArray([answer, ...Array.from(wrongSet)]);
  return { a, b, answer, isAddition, emoji, options };
}

export default function AdditionGame() {
  const [question, setQuestion] = useState<Question>(buildQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "correct" | "wrong" } | null>(null);
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion());
    setSelected(null);
    setShowCelebration(false);
  }, []);

  const handleSelect = useCallback(
    (num: number) => {
      if (selected !== null) return;
      setSelected(num);

      if (num === question.answer) {
        playCorrectSound();
        setShowReward(true);
        setShowCelebration(true);
        addStar(1);
        recordCorrect();
        setToast({ message: `Perfect! ${num} is correct!`, type: "correct" });
        speak(`${num}! Correct!`, { rate: 0.9 });
        roundRef.current += 1;
        setTimeout(() => {
          setShowReward(false);
          setToast(null);
          if (roundRef.current >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        playWrongSound();
        recordWrong();
        setToast({ message: `Not quite! The answer is ${question.answer}`, type: "wrong" });
        speak(`Try again!`, { rate: 0.9 });
        setTimeout(() => {
          setToast(null);
          nextQuestion();
        }, 1200);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion]
  );

  const handleRestart = () => {
    reset();
    roundRef.current = 0;
    setGameOver(false);
    nextQuestion();
  };

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={handleRestart}
        onBack={() => window.history.back()}
      gameName="加法计算"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      <Toast message={toast?.message || ""} type={toast?.type || "correct"} show={!!toast} />
      {/* Celebration animation */}
      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-green-400 border-opacity-50"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.6 }}
              className="text-8xl text-green-500"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-green-600 whitespace-nowrap"
            >
              Great Job!
            </motion.div>
          </div>
        </motion.div>
      )}
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-green-400 to-emerald-500" />

      <motion.div
        key={`${question.a}-${question.isAddition}-${question.b}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        {/* Problem display */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Group A */}
            <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
              {Array.from({ length: question.a }).map((_, i) => (
                <span key={i} className="text-3xl">{question.emoji}</span>
              ))}
            </div>

            <span className="text-5xl font-black text-gray-700">
              {question.isAddition ? "+" : "−"}
            </span>

            {/* Group B */}
            <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
              {Array.from({ length: question.b }).map((_, i) => (
                <span
                  key={i}
                  className={`text-3xl ${!question.isAddition ? "opacity-40 line-through" : ""}`}
                >
                  {question.emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="text-4xl font-black text-gray-700 border-t-4 border-gray-200 pt-4">
            {question.a} {question.isAddition ? "+" : "−"} {question.b} = ?
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((num) => {
            const isCorrect = num === question.answer;
            const isSelected = selected === num;

            return (
              <AnimatedButton
                key={num}
                variant={isSelected ? (isCorrect ? "success" : "danger") : "ghost"}
                onClick={() => handleSelect(num)}
                disabled={selected !== null}
                className="h-24 text-4xl font-black"
              >
                {num}
              </AnimatedButton>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
