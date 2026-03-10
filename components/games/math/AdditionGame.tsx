"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
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
  const [gameOver, setGameOver] = useState(false);
  const roundRef = useRef(0);

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

      if (num === question.answer) {
        playCorrectSound();
        setShowReward(true);
        addStar(1);
        recordCorrect();
        speak(`${num}! Correct!`, { rate: 0.9 });
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
        recordWrong();
        speak(`Try again!`, { rate: 0.9 });
        setTimeout(() => nextQuestion(), 1200);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion]
  );

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">➕</div>
          <h2 className="text-4xl font-black text-green-600 mb-2">Math Genius!</h2>
          <p className="text-2xl text-gray-600">
            {correct}/{TOTAL_ROUNDS} correct!
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { reset(); roundRef.current = 0; setGameOver(false); nextQuestion(); }}
          className="btn-kid bg-gradient-to-b from-green-400 to-green-500 border-green-700 text-white px-10"
        >
          Play Again! ➕
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
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
