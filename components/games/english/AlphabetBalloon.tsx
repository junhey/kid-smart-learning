"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import Toast from "@/components/ui/Toast";
import alphabetData from "@/data/english/alphabet.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface AlphabetItem {
  letter: string;
  name: string;
  word: string;
  emoji: string;
}

interface Balloon {
  id: number;
  letter: string;
  x: number;
  color: string;
  speed: number;
  popped: boolean;
  isCorrect: boolean;
}

const BALLOON_COLORS = [
  "from-red-400 to-red-500",
  "from-blue-400 to-blue-500",
  "from-green-400 to-green-500",
  "from-yellow-400 to-orange-400",
  "from-purple-400 to-purple-500",
  "from-pink-400 to-pink-500",
  "from-cyan-400 to-cyan-500",
];

const TOTAL_ROUNDS = 10;

export default function AlphabetBalloon() {
  const [target, setTarget] = useState<AlphabetItem | null>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [toastType, setToastType] = useState<"correct" | "wrong" | null>(null);
  const [showToast, setShowToast] = useState(false);
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const generateRound = useCallback(() => {
    const pool = alphabetData as AlphabetItem[];
    const correctItem = pool[Math.floor(Math.random() * pool.length)];
    const others = pickRandom(
      pool.filter((a) => a.letter !== correctItem.letter),
      4
    );
    const allLetters = shuffleArray([correctItem, ...others]);

    const newBalloons: Balloon[] = allLetters.map((item, i) => ({
      id: Date.now() + i,
      letter: item.letter,
      x: 8 + i * 16,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      speed: 6 + Math.random() * 4,
      popped: false,
      isCorrect: item.letter === correctItem.letter,
    }));

    setTarget(correctItem);
    setBalloons(newBalloons);
    setFeedback(null);

    setTimeout(() => {
      speak(`Find the letter ${correctItem.letter}. ${correctItem.letter} for ${correctItem.word}`, { rate: 0.8 });
    }, 300);
  }, [speak]);

  useEffect(() => {
    generateRound();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePop = useCallback(
    (balloon: Balloon) => {
      if (feedback || balloon.popped) return;

      setBalloons((prev) =>
        prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
      );

      if (balloon.isCorrect) {
        playCorrectSound();
        setFeedback("correct");
        setShowReward(true);
        setToastType("correct");
        setShowToast(true);
        addStar(1);
        recordCorrect();
        speak(`Great job! ${target?.letter} for ${target?.word}!`, { rate: 0.9 });
        roundRef.current += 1;
        setTimeout(() => {
          setShowReward(false);
          setShowToast(false);
          if (roundRef.current >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            generateRound();
          }
        }, 1500);
      } else {
        playWrongSound();
        setFeedback("wrong");
        setToastType("wrong");
        setShowToast(true);
        speak("Try again!", { rate: 0.9 });
        recordWrong();
        setTimeout(() => {
          setBalloons((prev) =>
            prev.map((b) =>
              b.id === balloon.id ? { ...b, popped: false } : b
            )
          );
          setFeedback(null);
          setShowToast(false);
        }, 800);
      }
    },
    [feedback, target, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, generateRound]
  );

  const handleRestart = () => {
    reset();
    roundRef.current = 0;
    setGameOver(false);
    setFeedback(null);
    generateRound();
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
    <div className="max-w-3xl mx-auto">
      <StarReward show={showReward} />
      <Toast
        type={toastType || "correct"}
        message={toastType === "correct" ? "Perfect! 🎉" : "Try again!"}
        show={showToast}
      />

      <ProgressBar current={total} total={TOTAL_ROUNDS} />

      {target && (
        <motion.div
          key={target.letter}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center my-6"
        >
          <div className="bg-white rounded-3xl p-6 shadow-xl inline-block">
            <p className="text-xl font-bold text-gray-600 mb-2">
              Pop the balloon with letter:
            </p>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-8xl font-black text-orange-500"
              style={{ fontFamily: "Fredoka One, cursive" }}
            >
              {target.letter}
            </motion.div>
            <p className="text-2xl font-bold text-gray-500 mt-1">
              {target.emoji} {target.word}
            </p>
            <button
              onClick={() => speak(`${target.letter}. ${target.letter} for ${target.word}`, { rate: 0.8 })}
              className="mt-2 bg-sky-100 hover:bg-sky-200 rounded-full px-4 py-2 text-sky-700 font-bold text-lg transition-colors"
            >
              🔊 Hear it!
            </button>
          </div>
        </motion.div>
      )}

      {/* Balloons area */}
      <div className="relative h-64 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-200 to-sky-100">
        <div className="absolute top-3 left-8 text-4xl opacity-30 pointer-events-none">☁️</div>
        <div className="absolute top-6 right-10 text-5xl opacity-30 pointer-events-none">☁️</div>
        <AnimatePresence>
          {balloons.map((balloon) =>
            !balloon.popped ? (
              <motion.div
                key={balloon.id}
                className="absolute cursor-pointer"
                style={{ left: `${balloon.x}%`, bottom: 0 }}
                initial={{ y: 300, opacity: 1 }}
                animate={{ y: -280 }}
                transition={{
                  duration: balloon.speed,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: balloon.id % 5 * 0.5,
                }}
                exit={{ scale: [1, 1.5, 0], opacity: 0 }}
                onClick={() => handlePop(balloon)}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className={`w-16 h-20 bg-gradient-to-b ${balloon.color} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-black text-2xl">
                    {balloon.letter}
                  </span>
                </div>
                <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
              </motion.div>
            ) : (
              <motion.div
                key={`pop-${balloon.id}`}
                className="absolute text-4xl pointer-events-none"
                style={{ left: `${balloon.x}%`, top: "40%" }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4 text-2xl font-bold text-red-500"
          >
            Not that one! Try again! 💪
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
