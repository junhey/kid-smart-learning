"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import { randomInt } from "@/lib/gameUtils";

const TOTAL_ROUNDS = 10;

interface Question {
  a: number;
  b: number;
  correct: "greater" | "less";
}

function buildQuestion(): Question {
  let a = randomInt(1, 99);
  let b = randomInt(1, 99);
  while (a === b) b = randomInt(1, 99);
  return { a, b, correct: a > b ? "greater" : "less" };
}

export default function CompareNumbers() {
  const [question, setQuestion] = useState<Question>(buildQuestion);
  const [selected, setSelected] = useState<string | null>(null);
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
    (choice: "greater" | "less") => {
      if (selected) return;
      setSelected(choice);

      if (choice === question.correct) {
        playCorrectSound();
        setShowReward(true);
        addStar(1);
        recordCorrect();
        const msg =
          question.correct === "greater"
            ? `${question.a} is greater than ${question.b}!`
            : `${question.a} is less than ${question.b}!`;
        speak(msg, { rate: 0.9 });
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
          <div className="text-8xl mb-4">⚖️</div>
          <h2 className="text-4xl font-black text-orange-600 mb-2">Compare Pro!</h2>
          <p className="text-2xl text-gray-600">
            {correct}/{TOTAL_ROUNDS} correct!
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { reset(); roundRef.current = 0; setGameOver(false); nextQuestion(); }}
          className="btn-kid bg-gradient-to-b from-orange-400 to-amber-500 border-orange-700 text-white px-10"
        >
          Play Again! ⚖️
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-orange-400 to-amber-500" />

      <motion.div
        key={`${question.a}-${question.b}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <p className="text-center text-2xl font-black text-gray-700 mb-6">
          Which is true?
        </p>

        {/* Numbers display */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-6 shadow-xl text-center w-32"
          >
            <div className="text-6xl font-black text-orange-600">{question.a}</div>
          </motion.div>

          <div className="text-5xl font-black text-gray-500">?</div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 shadow-xl text-center w-32"
          >
            <div className="text-6xl font-black text-blue-600">{question.b}</div>
          </motion.div>
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-2 gap-4">
          {(["greater", "less"] as const).map((choice) => {
            const isCorrect = choice === question.correct;
            const isSelected = selected === choice;
            let cls = "answer-btn border-gray-200";
            if (choice === "greater") cls += " bg-gradient-to-b from-orange-100 to-orange-200";
            else cls += " bg-gradient-to-b from-blue-100 to-blue-200";
            if (isSelected && isCorrect) cls = "answer-btn correct";
            if (isSelected && !isCorrect) cls = "answer-btn wrong";

            return (
              <motion.button
                key={choice}
                whileHover={!selected ? { scale: 1.05, y: -3 } : {}}
                whileTap={!selected ? { scale: 0.95 } : {}}
                onClick={() => handleSelect(choice)}
                className={cls}
              >
                <div className="text-3xl mb-1">
                  {choice === "greater" ? ">" : "<"}
                </div>
                <div className="font-black text-lg">
                  {question.a} {choice === "greater" ? ">" : "<"} {question.b}
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  {question.a} is {choice} than {question.b}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
