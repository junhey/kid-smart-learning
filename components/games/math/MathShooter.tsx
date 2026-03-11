"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import { shuffleArray, randomInt } from "@/lib/gameUtils";

const TOTAL_ROUNDS = 10;

const BUBBLE_COLORS = [
  "from-red-400 to-red-500",
  "from-blue-400 to-blue-500",
  "from-green-400 to-green-500",
  "from-yellow-400 to-orange-400",
  "from-purple-400 to-purple-500",
  "from-pink-400 to-pink-500",
];

interface Question {
  a: number;
  b: number;
  answer: number;
  isAddition: boolean;
  options: Array<{ value: number; id: number; x: number; color: string; popped: boolean }>;
}

function buildQuestion(nextId: () => number): Question {
  const isAddition = Math.random() > 0.4;
  let a: number, b: number, answer: number;
  if (isAddition) {
    a = randomInt(1, 10);
    b = randomInt(1, 10 - a);
    answer = a + b;
  } else {
    answer = randomInt(1, 8);
    b = randomInt(1, 8);
    a = answer + b;
  }
  const wrongSet = new Set<number>();
  while (wrongSet.size < 4) {
    const w = randomInt(Math.max(0, answer - 5), answer + 5);
    if (w !== answer && w >= 0) wrongSet.add(w);
  }
  const values = shuffleArray([answer, ...Array.from(wrongSet)]);
  const options = values.map((value, i) => ({
    value,
    id: nextId(),
    x: 10 + i * 18,
    color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
    popped: false,
  }));
  return { a, b, answer, isAddition, options };
}

export default function MathShooter() {
  const idCounter = useRef(0);
  const nextId = useCallback(() => ++idCounter.current, []);
  const roundRef = useRef(0);

  const [question, setQuestion] = useState<Question>(() => buildQuestion(nextId));
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion(nextId));
    setFeedback(null);
  }, [nextId]);

  const handleRestart = useCallback(() => {
    reset();
    roundRef.current = 0;
    setGameOver(false);
    nextQuestion();
  }, [reset, nextQuestion]);

  useEffect(() => {
    speak(`${question.a} ${question.isAddition ? "plus" : "minus"} ${question.b} equals?`, { rate: 0.8 });
  }, [question.a, question.b, question.isAddition]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShoot = useCallback(
    (opt: Question["options"][0]) => {
      if (feedback || opt.popped) return;

      setQuestion((prev) => ({
        ...prev,
        options: prev.options.map((o) => (o.id === opt.id ? { ...o, popped: true } : o)),
      }));

      if (opt.value === question.answer) {
        playCorrectSound();
        setFeedback("correct");
        setShowReward(true);
        addStar(1);
        recordCorrect();
        speak(`${opt.value}! Correct!`, { rate: 0.9 });
        roundRef.current += 1;
        setTimeout(() => {
          setShowReward(false);
          if (roundRef.current >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        playWrongSound();
        setFeedback("wrong");
        recordWrong();
        speak(`Try again!`, { rate: 0.9 });
        setTimeout(() => {
          setQuestion((prev) => ({
            ...prev,
            options: prev.options.map((o) => (o.id === opt.id ? { ...o, popped: false } : o)),
          }));
          setFeedback(null);
        }, 800);
      }
    },
    [feedback, question.answer, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion]
  );

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
    <div className="max-w-3xl mx-auto">
      <StarReward show={showReward} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-pink-400 to-rose-500" />

      {/* Question */}
      <motion.div
        key={`q-${question.a}-${question.b}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center my-4"
      >
        <div className="bg-white rounded-3xl p-4 shadow-xl inline-block">
          <div className="text-5xl font-black text-gray-700">
            {question.a}{" "}
            <span className={question.isAddition ? "text-green-500" : "text-red-500"}>
              {question.isAddition ? "+" : "−"}
            </span>{" "}
            {question.b} = <span className="text-pink-500">?</span>
          </div>
          <button
            onClick={() => speak(`${question.a} ${question.isAddition ? "plus" : "minus"} ${question.b} equals?`, { rate: 0.8 })}
            className="mt-2 bg-pink-100 hover:bg-pink-200 rounded-full px-4 py-2 text-pink-700 font-bold transition-colors"
          >
            🔊 Hear it!
          </button>
        </div>
      </motion.div>

      {/* Bubbles floating up */}
      <div className="relative h-56 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-sky-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-8 text-3xl opacity-30">☁️</div>
          <div className="absolute top-4 right-12 text-4xl opacity-30">☁️</div>
        </div>

        <AnimatePresence>
          {question.options.map((opt) =>
            !opt.popped ? (
              <motion.div
                key={opt.id}
                className="absolute cursor-pointer"
                style={{ left: `${opt.x}%` }}
                initial={{ y: 250, opacity: 1 }}
                animate={{ y: -100 }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: opt.id % 5 * 0.6,
                }}
                exit={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
                onClick={() => handleShoot(opt)}
                whileHover={{ scale: 1.15 }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-b ${opt.color} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-black text-2xl">{opt.value}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`pop-${opt.id}`}
                className="absolute text-3xl pointer-events-none"
                style={{ left: `${opt.x}%`, top: "30%" }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                💥
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback === "wrong" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-500 font-bold text-xl mt-3"
          >
            Not that one! Try again! 💪
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
