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
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "correct" | "wrong" | "info">("success");
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion());
    setSelected(null);
    setShowCelebration(false);
    setToastMessage("");
  }, []);

  const handleRestart = useCallback(() => {
    reset();
    roundRef.current = 0;
    setGameOver(false);
    nextQuestion();
  }, [reset, nextQuestion]);

  const handleSelect = useCallback(
    (choice: "greater" | "less") => {
      if (selected) return;
      setSelected(choice);

      if (choice === question.correct) {
        playCorrectSound();
        setShowReward(true);
        setShowCelebration(true);
        addStar(1);
        recordCorrect();
        const msg =
          question.correct === "greater"
            ? `Perfect! ${question.a} is greater than ${question.b}!`
            : `Perfect! ${question.a} is less than ${question.b}!`;
        setToastMessage(msg);
        setToastType("success");
        speak(msg, { rate: 0.9 });
        roundRef.current += 1;
        setTimeout(() => {
          setShowReward(false);
          setShowCelebration(false);
          if (roundRef.current >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        playWrongSound();
        recordWrong();
        const correctMsg =
          question.correct === "greater"
            ? `Not quite! The correct answer is ${question.a} > ${question.b}.`
            : `Not quite! The correct answer is ${question.a} < ${question.b}.`;
        setToastMessage(correctMsg);
        setToastType("wrong");
        speak(`Try again!`, { rate: 0.9 });
        setTimeout(() => nextQuestion(), 1200);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion]
  );

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={handleRestart}
        onBack={() => window.history.back()}
      gameName="比大小"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      <Toast message={toastMessage} type={toastType} show={!!toastMessage} onClose={() => setToastMessage("")} />
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
              className="absolute inset-0 rounded-full border-4 border-amber-500 border-opacity-50"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.6 }}
              className="text-8xl text-amber-500"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-amber-600 whitespace-nowrap"
            >
              Excellent! Perfect!
            </motion.div>
          </div>
        </motion.div>
      )}
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
            
            let variant: "primary" | "success" | "danger" = "primary";
            if (isSelected && isCorrect) variant = "success";
            if (isSelected && !isCorrect) variant = "danger";

            return (
              <AnimatedButton
                key={choice}
                onClick={() => handleSelect(choice)}
                variant={variant}
                disabled={!!selected}
                className={choice === "greater" ? "bg-gradient-to-b from-orange-100 to-orange-200" : "bg-gradient-to-b from-blue-100 to-blue-200"}
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
              </AnimatedButton>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
