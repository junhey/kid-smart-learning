"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { useToast } from "@/components/ui/Toast";
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongAnimation, setWrongAnimation] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);
  const { showCorrect, showWrong, ToastComponent } = useToast();

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
        setShowCelebration(true);
        showCorrect(`Perfect! ${num} is correct!`);
        addStar(1);
        recordCorrect();
        speak(`${num}! Correct!`, { rate: 0.9 });
        setTimeout(() => {
          setShowReward(false);
          setShowCelebration(false);
          if (total + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1800);
      } else {
        playWrongSound();
        recordWrong();
        showWrong(`Not quite! Try counting again!`);
        speak(`Let's try again. Count again!`, { rate: 0.8 });
        setWrongAnimation(true);
        setTimeout(() => {
          setWrongAnimation(false);
          nextQuestion();
        }, 1600);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion, total, showCorrect, showWrong]
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
      <ToastComponent />
      <StarReward show={showReward} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-cyan-400 to-blue-400" />

      {/* Duolingo风格成功反馈 */}
      {showCelebration && (
        <motion.div
          key="celebration"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
            className="rounded-full bg-green-400/90 shadow-2xl p-12"
          >
            <div className="text-white text-6xl">✓</div>
          </motion.div>
          
          {/* 庆祝粒子效果 */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.sin(i * 72) * 80,
                y: Math.cos(i * 72) * 80,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute w-8 h-8 bg-yellow-300/80 rounded-full flex items-center justify-center"
            >
              <div className="text-xl">✨</div>
            </motion.div>
          ))}
          
          {/* "Great job!" 文字 */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-1/4 text-4xl font-bold text-white bg-green-500/80 py-3 px-6 rounded-full shadow-lg"
          >
            Great job!
          </motion.div>
        </motion.div>
      )}

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
        <motion.div
          className="grid grid-cols-2 gap-4"
          animate={wrongAnimation ? { 
            x: [0, -10, 10, -10, 10, 0] 
          } : {}}
          transition={wrongAnimation ? {
            duration: 0.6,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
          } : {}}
        >
          {question.options.map((num) => {
            const isCorrect = num === question.count;
            const isSelected = selected === num;

            return (
              <AnimatedButton
                key={num}
                variant={
                  isSelected && isCorrect
                    ? "success"
                    : isSelected && !isCorrect
                    ? "danger"
                    : "ghost"
                }
                size="lg"
                onClick={() => handleSelect(num)}
                disabled={selected !== null}
                className={`text-4xl font-black h-24 ${
                  isSelected && isCorrect ? "ring-4 ring-green-300" : ""
                } ${
                  isSelected && !isCorrect ? "ring-4 ring-red-300" : ""
                }`}
                playSound={false}
              >
                {num}
              </AnimatedButton>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
