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
import wordsData from "@/data/english/words.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface WordItem {
  word: string;
  emoji: string;
}

interface Question {
  target: WordItem;
  options: WordItem[];
}

const TOTAL_ROUNDS = 10;
const CATEGORIES = ["animals", "fruits", "colors", "family", "objects"] as const;

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
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl"
        >
          🎯
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getAllWords(): WordItem[] {
  const all: WordItem[] = [];
  for (const cat of CATEGORIES) {
    all.push(...(wordsData[cat] as WordItem[]));
  }
  return all;
}

function buildQuestion(): Question {
  const all = getAllWords();
  const target = all[Math.floor(Math.random() * all.length)];
  const others = pickRandom(
    all.filter((w) => w.word !== target.word),
    3
  );
  return { target, options: shuffleArray([target, ...others]) };
}

export default function WordMatch() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongAnswerAnimation, setWrongAnswerAnimation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "correct" | "wrong">("success");
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    const q = buildQuestion();
    setQuestion(q);
    setSelected(null);
    setTimeout(() => speak(q.target.word, { rate: 0.8 }), 400);
  }, [speak]);

  useEffect(() => {
    nextQuestion();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback(
    (word: WordItem) => {
      if (selected) return;
      setSelected(word.word);

      if (word.word === question?.target.word) {
        playCorrectSound();
        setShowReward(true);
        setShowCelebration(true);
        setToastMessage("Perfect! 🎉");
        setToastType("correct");
        setShowToast(true);
        addStar(1);
        recordCorrect();
        speak(`${word.word}! Correct!`, { rate: 0.9 });
        roundRef.current += 1;
        
        if (roundRef.current >= TOTAL_ROUNDS) {
          setTimeout(() => setGameOver(true), 2000);
        } else {
          setTimeout(() => {
            setShowReward(false);
            setShowCelebration(false);
            setShowToast(false);
            nextQuestion();
          }, 1500);
        }
      } else {
        playWrongSound();
        recordWrong();
        setWrongAnswerAnimation(true);
        setToastMessage("Try again!");
        setToastType("wrong");
        setShowToast(true);
        setTimeout(() => {
          setWrongAnswerAnimation(false);
          setSelected(null);
          setShowToast(false);
          nextQuestion();
        }, 1200);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion]
  );

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={() => {
          reset();
          roundRef.current = 0;
          setGameOver(false);
          nextQuestion();
        }}
        onBack={() => window.location.href = "/"}
        gameName="单词配对"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      <Toast show={showToast} message={toastMessage} type={toastType} />
      
      {showCelebration && <CelebrationAnimation />}

      {wrongAnswerAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-red-400/20 z-40 pointer-events-none"
        />
      )}
      <ProgressBar current={total} total={TOTAL_ROUNDS} />

      {question && (
        <motion.div
          key={question.target.word}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Show emoji, ask for word */}
          <div className="text-center my-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl inline-block">
              <p className="text-xl font-bold text-gray-600 mb-3">
                What is this?
              </p>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                {question.target.emoji}
              </motion.div>
              <button
                onClick={() => speak(question.target.word, { rate: 0.8 })}
                className="bg-sky-100 hover:bg-sky-200 rounded-full px-4 py-2 text-sky-700 font-bold transition-colors"
              >
                🔊 Hear it!
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {question.options.map((opt, index) => {
                const isCorrect = opt.word === question.target.word;
                const isSelected = selected === opt.word;
                let className = "answer-btn bg-white border-gray-200 text-gray-700";
                if (isSelected && isCorrect) className = "answer-btn correct";
                if (isSelected && !isCorrect) className = "answer-btn wrong";

                return (
                  <motion.button
                    key={`${opt.word}-${index}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: isSelected && isCorrect ? [1, 1.15, 1] : 
                             wrongAnswerAnimation && isSelected && !isCorrect ? [1, 0.95, 1.05, 0.95, 1] : 1,
                      x: wrongAnswerAnimation && isSelected && !isCorrect ? [0, -5, 5, -5, 5, -5, 0] : 0
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!selected ? { scale: 1.05, y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" } : {}}
                    whileTap={!selected ? { scale: 0.95 } : {}}
                    onClick={() => handleSelect(opt)}
                    className={className}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="font-black capitalize text-xl">{opt.word}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
