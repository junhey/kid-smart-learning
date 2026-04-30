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
import rhymesData from "@/data/english/rhymes.json";
import { shuffleArray, pickRandom, pickRandomOne } from "@/lib/gameUtils";

interface RhymeWord {
  word: string;
  emoji: string;
}

interface RhymeGroup {
  sound: string;
  words: RhymeWord[];
}

interface Question {
  targetWord: RhymeWord;
  rhymeSound: string;
  options: RhymeWord[];
  correctAnswer: RhymeWord;
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

export default function RhymeGame() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'correct' | 'wrong' | 'info' } | null>(null);
  const { addStar } = useReward();
  const { playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, percent, isComplete } = useProgress(5);

  const generateQuestion = useCallback(() => {
    const rhymeGroup = pickRandomOne(rhymesData.rhymeGroups as RhymeGroup[]);
    const targetWord = pickRandomOne(rhymeGroup.words);
    const correctAnswer = pickRandomOne(
      rhymeGroup.words.filter((w) => w.word !== targetWord.word)
    );

    const otherGroups = rhymesData.rhymeGroups.filter(
      (g) => g.sound !== rhymeGroup.sound
    );
    const wrongWords = shuffleArray(
      otherGroups.flatMap((g) => g.words)
    ).slice(0, 2);

    const options = shuffleArray([correctAnswer, ...wrongWords]);

    setQuestion({
      targetWord,
      rhymeSound: rhymeGroup.sound,
      options,
      correctAnswer,
    });
    setSelected(null);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelect = (word: RhymeWord) => {
    if (selected !== null) return;

    setSelected(word.word);
    const correct = word.word === question?.correctAnswer.word;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      addStar();
      setShowStar(true);
      setShowCelebration(true);
      setToast({ show: true, message: "Perfect! 🎉", type: "success" });
      
      setTimeout(() => {
        setShowStar(false);
        setShowCelebration(false);
        setToast(null);
      }, 1200);
      
      recordCorrect();
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      playWrongSound();
      setToast({ show: true, message: "Try again!", type: "wrong" });
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
        setToast(null);
      }, 1000);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressBar current={total} total={5} color="purple" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            🎵 找押韵词 Find the Rhyme!
          </h2>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{question.targetWord.emoji}</div>
            <div className="text-3xl font-bold text-gray-800">
              {question.targetWord.word}
            </div>
            <div className="text-gray-600 mt-2">
              Which word rhymes with this?
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {question.options.map((word, index) => {
              const isSelected = selected === word.word;
              const showResult = isSelected && isCorrect !== null;

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selected ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(word)}
                  disabled={selected !== null}
                  animate={
                    showResult && isCorrect
                      ? { 
                          scale: [1, 1.2, 1], 
                          backgroundColor: ["rgb(168 85 247)", "rgb(34 197 94)", "rgb(168 85 247)"]
                        }
                      : showResult && !isCorrect
                      ? { 
                          x: [0, -10, 10, -10, 10, 0],
                          backgroundColor: ["rgb(168 85 247)", "rgb(239 68 68)", "rgb(168 85 247)"]
                        }
                      : {}
                  }
                  transition={
                    showResult && isCorrect
                      ? { duration: 0.5, times: [0, 0.5, 1] }
                      : showResult && !isCorrect
                      ? { duration: 0.6, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                      : {}
                  }
                  className={`
                    p-6 rounded-2xl font-bold text-lg transition-all
                    ${
                      !showResult
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : ""
                    }
                    ${showResult && isCorrect ? "bg-green-500 text-white" : ""}
                    ${showResult && !isCorrect ? "bg-red-500 text-white" : ""}
                    ${selected && !isSelected ? "opacity-50" : ""}
                    disabled:cursor-not-allowed
                  `}
                >
                  <div className="text-4xl mb-2">{word.emoji}</div>
                  <div>{word.word}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {showStar && <StarReward show={showStar} />}
        {showCelebration && <CelebrationAnimation />}
        {toast && <Toast show={toast.show} message={toast.message} type={toast.type} />}

        {isComplete && (
          <GameResult
            correct={correct}
            total={total}
            onRestart={handleRestart}
            onBack={handleBack}
          gameName="押韵游戏"
          />
        )}
      </div>
    </div>
  );
}
