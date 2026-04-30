"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import Toast from "@/components/ui/Toast";
import { shuffleArray, randomInt } from "@/lib/gameUtils";

const TOTAL_ROUNDS = 10;

interface Question {
  hour: number;
  minute: number;
  answer: string;
  options: string[];
}

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
        
        {/* Floating "Great Job!" */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -30, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 text    text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 font-black text-5xl"
        >
          Great Job!
        </motion.div>
      </div>
    </AnimatePresence>
  );
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"correct" | "wrong">("correct");
  const questionRef = useRef(question);
  
  const { addStar } = useReward();
  const { playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset: resetProgress } = useProgress(TOTAL_ROUNDS);

  const isComplete = total >= TOTAL_ROUNDS;

  // 控制庆祝动画显示
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

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
        setCorrectCount(c => c + 1);
        setToastMessage(`Perfect! It's ${questionRef.current.answer}! 🎯`);
        setToastType("correct");
        setShowToast(true);
        if (correctCount + 1 > 0 && (correctCount + 1) % 3 === 0) {
          setShowCelebration(true);
        }
      } else {
        recordWrong();
        playWrongSound();
        setShake(true);
        setCorrectCount(0);
        setToastMessage("Try again! Look at the clock hands! ⏰");
        setToastType("wrong");
        setShowToast(true);
        setTimeout(() => setShake(false), 500);
      }
      setTimeout(() => {
        setShowToast(false);
        nextQuestion();
      }, 1500);
    },
    [status, isComplete, recordCorrect, recordWrong, playCorrectSound, playWrongSound, addStar, nextQuestion, correctCount]
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

      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      {showCelebration && <CelebrationAnimation />}

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
              <motion.div
                key={opt}
                animate={status === "wrong" && opt !== question.answer && shake ? 
                  { rotate: [0, -5, 5, -5, 5, 0], scale: [1, 0.95, 1] } : 
                  status === "correct" && opt === question.answer ?
                  { scale: [1, 1.15, 1], backgroundColor: "#4ade80" } :
                  {}
                }
                transition={shake ? { duration: 0.5, repeat: 0 } : status === "correct" && opt === question.answer ? { duration: 0.6, repeat: 0 } : {}}
              >
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!status}
                  className={`p-6 text-2xl font-bold rounded-xl shadow-md transition-all duration-300 ${
                    status === "correct" && opt === question.answer
                      ? "bg-green-500 text-white ring-4 ring-green-300 ring-opacity-50 rounded-2xl"
                      : status === "wrong" && opt === question.answer
                      ? "bg-green-500 text-white"
                      : status === "wrong" && opt !== question.answer
                      ? "bg-red-400 text-white ring-2 ring-red-300"
                      : status && opt !== question.answer
                      ? "bg-gray-300 text-gray-500"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95"
                  }`}
                >
                  {opt}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <GameResult 
          correct={correct}
          total={TOTAL_ROUNDS}
          onRestart={restart}
          gameName="认时钟"
          onBack={function() {
            // 实际项目中会导航到主菜单
            window.location.href = "/play";
          }}
        />
      )}
    </div>
  );
}
