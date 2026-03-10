"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import { shuffleArray, randomInt } from "@/lib/gameUtils";

const TOTAL_ROUNDS = 10;

interface Question {
  hour: number;
  minute: number;
  answer: string;
  options: string[];
}

function buildQuestion(): Question {
  const hour = randomInt(1, 12);
  const minute = [0, 15, 30, 45][randomInt(0, 3)];
  const answer = `${hour}:${minute.toString().padStart(2, "0")}`;
  
  const wrongSet = new Set<string>();
  while (wrongSet.size < 3) {
    const wHour = randomInt(1, 12);
    const wMinute = [0, 15, 30, 45][randomInt(0, 3)];
    const w = `${wHour}:${wMinute.toString().padStart(2, "0")}`;
    if (w !== answer) wrongSet.add(w);
  }
  
  return {
    hour,
    minute,
    answer,
    options: shuffleArray([answer, ...Array.from(wrongSet)]),
  };
}

export default function ClockGame() {
  const [question, setQuestion] = useState<Question>(buildQuestion);
  const [status, setStatus] = useState<"" | "correct" | "wrong">("");
  const [shake, setShake] = useState(false);
  const questionRef = useRef(question);
  
  const { addStar } = useReward();
  const { playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset: resetProgress } = useProgress(TOTAL_ROUNDS);

  const isComplete = total >= TOTAL_ROUNDS;

  const nextQuestion = useCallback(() => {
    const q = buildQuestion();
    setQuestion(q);
    questionRef.current = q;
    setStatus("");
  }, []);

  const handleAnswer = useCallback(
    (choice: string) => {
      if (status || isComplete) return;
      const isCorrect = choice === questionRef.current.answer;
      setStatus(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        recordCorrect();
        playCorrectSound();
        addStar(1);
      } else {
        recordWrong();
        playWrongSound();
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setTimeout(nextQuestion, 1500);
    },
    [status, isComplete, recordCorrect, recordWrong, playCorrectSound, playWrongSound, addStar, nextQuestion]
  );

  const restart = () => {
    resetProgress();
    nextQuestion();
  };

  const hourAngle = (question.hour % 12) * 30 + question.minute * 0.5;
  const minuteAngle = question.minute * 6;

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center">⏰ 时钟游戏</h1>
      <ProgressBar current={correct} total={TOTAL_ROUNDS} />

      {!isComplete ? (
        <>
          <motion.div animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}>
            <div className="relative w-64 h-64 bg-white rounded-full shadow-lg border-4 border-gray-300">
              {/* Clock numbers */}
              {[12, 3, 6, 9].map((num, i) => {
                const angle = (num === 12 ? 0 : num * 30) - 90;
                const x = 120 + 90 * Math.cos((angle * Math.PI) / 180);
                const y = 120 + 90 * Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={num}
                    className="absolute text-2xl font-bold"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              
              {/* Hour hand */}
              <div
                className="absolute bg-gray-800 rounded"
                style={{
                  width: "6px",
                  height: "60px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "3px 60px",
                  transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
                }}
              />
              
              {/* Minute hand */}
              <div
                className="absolute bg-blue-600 rounded"
                style={{
                  width: "4px",
                  height: "80px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "2px 80px",
                  transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
                }}
              />
              
              {/* Center dot */}
              <div className="absolute w-4 h-4 bg-red-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          <p className="text-xl text-center">现在是几点？</p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {question.options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                disabled={!!status}
                className={`p-6 text-2xl font-bold rounded-xl shadow-md transition ${
                  status === "correct" && opt === question.answer
                    ? "bg-green-500 text-white"
                    : status === "wrong" && opt === question.answer
                    ? "bg-green-500 text-white"
                    : status && opt !== question.answer
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold">太棒了！</h2>
          <p className="text-xl">
            你答对了 {correct} / {TOTAL_ROUNDS} 题
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restart}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-lg font-bold"
          >
            再玩一次
          </motion.button>
        </div>
      )}
    </div>
  );
}
