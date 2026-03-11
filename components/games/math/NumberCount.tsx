"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import { shuffleArray, randomInt } from "@/lib/gameUtils";

const EMOJIS = ["🍎", "🐶", "⭐", "🌸", "🦋", "🎈", "🍊", "🐱", "🔵", "🍓"];
const TOTAL_ROUNDS = 10;

interface Question {
  count: number;
  emoji: string;
  options: number[];
}

function buildQuestion(): Question {
  const count = randomInt(1, 15);
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const wrongSet = new Set<number>();
  while (wrongSet.size < 3) {
    const w = randomInt(Math.max(1, count - 4), count + 4);
    if (w !== count) wrongSet.add(w);
  }
  const options = shuffleArray([count, ...Array.from(wrongSet)]);
  return { count, emoji, options };
}

export default function NumberCount() {
  const [question, setQuestion] = useState<Question>(buildQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion());
    setSelected(null);
  }, []);

  const handleSelect = useCallback(
    (num: number) => {
      if (selected !== null) return;
      setSelected(num);

      if (num === question.count) {
        playCorrectSound();
        setShowReward(true);
        addStar(1);
        recordCorrect();
        speak(`${num}! Correct!`, { rate: 0.9 });
        setTimeout(() => {
          setShowReward(false);
          if (total + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        playWrongSound();
        recordWrong();
        speak(`Let's try again. Count again!`, { rate: 0.8 });
        setTimeout(() => nextQuestion(), 1200);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion, total]
  );

  const handleRestart = () => {
    reset();
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
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-cyan-400 to-blue-400" />

      <motion.div
        key={`${question.count}-${question.emoji}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <p className="text-center text-2xl font-black text-gray-700 mb-4">
          How many {question.emoji}?
        </p>

        {/* Emoji display */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 min-h-32 flex flex-wrap gap-2 justify-center items-center">
          {Array.from({ length: question.count }).map((_, i) => (
            <motion.span
              key={i}
              className="text-4xl select-none"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.5 }}
            >
              {question.emoji}
            </motion.span>
          ))}
        </div>

        {/* Number options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((num) => {
            const isCorrect = num === question.count;
            const isSelected = selected === num;
            let cls = "answer-btn bg-white border-gray-200 text-gray-800 text-4xl font-black";
            if (isSelected && isCorrect) cls = "answer-btn correct text-4xl font-black";
            if (isSelected && !isCorrect) cls = "answer-btn wrong text-4xl font-black";

            return (
              <motion.button
                key={num}
                whileHover={selected === null ? { scale: 1.08, y: -4 } : {}}
                whileTap={selected === null ? { scale: 0.95 } : {}}
                onClick={() => handleSelect(num)}
                className={cls}
              >
                {num}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
