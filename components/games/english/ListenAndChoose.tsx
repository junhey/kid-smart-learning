"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import Toast from "@/components/ui/Toast";
import wordsData from "@/data/english/words.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface WordItem {
  word: string;
  emoji: string;
}

const TOTAL_ROUNDS = 10;
const CATEGORIES = ["animals", "fruits", "colors", "objects"] as const;

function getAllWords(): WordItem[] {
  const all: WordItem[] = [];
  for (const cat of CATEGORIES) {
    all.push(...(wordsData[cat] as WordItem[]));
  }
  return all;
}

interface Question {
  target: WordItem;
  options: WordItem[];
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
          className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-7xl"
        >
          🎯
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function ListenAndChoose() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "wrong">("success");

  const { addStar, resetStreak } = useReward();
  const { speakWord, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    const all = getAllWords();
    const target = all[Math.floor(Math.random() * all.length)];
    const others = pickRandom(all.filter((w) => w.word !== target.word), 3);
    const q: Question = { target, options: shuffleArray([target, ...others]) };
    setQuestion(q);
    setSelected(null);
    setHasSpoken(false);
    setTimeout(() => {
      speakWord(q.target.word);
      setHasSpoken(true);
    }, 500);
  }, [speakWord]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleListen = useCallback(() => {
    if (question) {
      speakWord(question.target.word);
      setHasSpoken(true);
    }
  }, [question, speakWord]);

  const handleSelect = useCallback(
    (opt: WordItem) => {
      if (selected || !hasSpoken) return;
      setSelected(opt.word);

      if (opt.word === question?.target.word) {
        setShowReward(true);
        setShowCelebration(true);
        setToastMessage("Perfect! You got it! 🎯");
        setToastType("success");
        playCorrectSound();
        addStar(1);
        recordCorrect();
        setTimeout(() => {
          setShowReward(false);
          setShowCelebration(false);
          setToastMessage("");
          if (total + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        setToastMessage("Not quite! Try again! 💪");
        setToastType("wrong");
        playWrongSound();
        resetStreak();
        recordWrong();
        setTimeout(() => {
          setToastMessage("");
          nextQuestion();
        }, 1200);
      }
    },
    [selected, hasSpoken, question, playCorrectSound, playWrongSound, addStar, resetStreak, recordCorrect, recordWrong, nextQuestion, total]
  );

  const handleRestart = useCallback(() => {
    reset();
    setGameOver(false);
    nextQuestion();
  }, [reset, nextQuestion]);

  const handleBack = useCallback(() => {
    window.location.href = "/games";
  }, []);

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={handleRestart}
        onBack={handleBack}
      gameName="听力选择"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      {showCelebration && <CelebrationAnimation />}
      <Toast message={toastMessage} type={toastType} show={toastMessage !== ""} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-purple-400 to-pink-400" />

      {question && (
        <motion.div
          key={question.target.word}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center my-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl inline-block">
              <p className="text-xl font-bold text-gray-600 mb-4">
                Listen and pick the right picture!
              </p>
              <motion.button
                onClick={handleListen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={!hasSpoken ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: !hasSpoken ? Infinity : 0 }}
                className="bg-gradient-to-b from-purple-400 to-purple-500 text-white rounded-full px-8 py-4 text-2xl font-black shadow-lg border-b-4 border-purple-700"
              >
                🔊 Listen!
              </motion.button>
              {!hasSpoken && (
                <p className="text-sm text-gray-400 mt-2">
                  Press the button to hear the word!
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((opt) => {
              const isCorrect = opt.word === question.target.word;
              const isSelected = selected === opt.word;
              let cls = "answer-btn bg-white border-gray-200";
              if (isSelected && isCorrect) cls = "answer-btn correct";
              if (isSelected && !isCorrect) cls = "answer-btn wrong";
              if (!hasSpoken) cls += " opacity-60";

              return (
                <motion.button
                  key={opt.word}
                  whileHover={!selected && hasSpoken ? { scale: 1.05, y: -3 } : {}}
                  whileTap={!selected && hasSpoken ? { scale: 0.95 } : {}}
                  onClick={() => handleSelect(opt)}
                  className={cls}
                  disabled={!hasSpoken}
                  animate={
                    isSelected && isCorrect
                      ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
                      : isSelected && !isCorrect
                      ? { x: [0, -10, 10, -10, 0] }
                      : {}
                  }
                  transition={
                    isSelected && isCorrect
                      ? { duration: 0.6, times: [0, 0.4, 1] }
                      : isSelected && !isCorrect
                      ? { duration: 0.5 }
                      : {}
                  }
                >
                  <div className="text-5xl">{opt.emoji}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
