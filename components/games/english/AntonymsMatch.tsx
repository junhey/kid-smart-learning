"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import antonymsData from "@/src/data/antonyms.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface AntonymPair {
  word: string;
  antonym: string;
}

interface Question {
  target: string;
  correctAnswer: string;
  options: string[];
}

const TOTAL_ROUNDS = 10;

function buildQuestion(): Question {
  const pair = pickRandom(antonymsData as AntonymPair[], 1)[0];
  const target = pair.word;
  const correctAnswer = pair.antonym;
  const otherPairs = (antonymsData as AntonymPair[]).filter(p => p.word !== target);
  const wrongOptions = pickRandom(otherPairs, 3).map(p => p.antonym);
  return {
    target,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...wrongOptions])
  };
}

export default function AntonymsMatch() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { playCorrectSound, playWrongSound } = useSound();
  const { correct, recordCorrect, reset } = useProgress(TOTAL_ROUNDS);

  const handleBack = () => {
    window.location.href = "/";
  };

  const nextRound = useCallback(() => {
    if (roundRef.current >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }
    setQuestion(buildQuestion());
    setSelected(null);
    setShowReward(false);
  }, []);

  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelect = (option: string) => {
    if (selected || !question) return;
    setSelected(option);
    if (option === question.correctAnswer) {
      playCorrectSound();
      recordCorrect();
      addStar(1);
      setShowReward(true);
      setShowCelebration(true);
      roundRef.current++;
      setTimeout(() => {
        setShowCelebration(false);
        nextRound();
      }, 1500);
    } else {
      playWrongSound();
      setTimeout(() => setSelected(null), 600);
    }
  };

  const handleRestart = () => {
    roundRef.current = 0;
    reset();
    setGameOver(false);
    nextRound();
  };

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={handleRestart}
        onBack={handleBack}
      />
    );
  }

  if (!question) return null;

  return (
    <div className="flex flex-col h-full p-8 space-y-6">
      <ProgressBar current={roundRef.current} total={TOTAL_ROUNDS} />
      
      <motion.div
        key={question.target}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <p className="text-lg text-gray-600 mb-2">找出反义词</p>
        <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {question.target}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = selected && option === question.correctAnswer;
          const isWrong = isSelected && option !== question.correctAnswer;
          const isInactive = selected && !isSelected && !isCorrect;
          
          return (
            <motion.button
              key={option}
              whileHover={{ scale: selected || isInactive ? 1 : 1.05 }}
              whileTap={{ scale: selected || isInactive ? 1 : 0.95 }}
              animate={
                isCorrect
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 0.6 }
                    }
                  : isWrong
                  ? {
                      x: [0, -10, 10, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }
                  : {}
              }
              onClick={() => handleSelect(option)}
              className={`
                p-8 text-3xl font-bold rounded-3xl transition-all duration-300
                ${isCorrect ? "bg-green-400 shadow-lg shadow-green-200 text-white" : ""}
                ${isWrong ? "bg-red-400 shadow-lg shadow-red-200 text-white" : ""}
                ${isInactive ? "opacity-50 bg-gray-100 border-2 border-gray-300" : ""}
                ${!selected ? "bg-white hover:bg-blue-50 border-4 border-blue-300 shadow-md" : ""}
              `}
              disabled={!!selected}
            >
              <motion.div
                animate={
                  isCorrect
                    ? {
                        scale: [1, 1.3, 1],
                        transition: { duration: 0.4, delay: 0.2 }
                      }
                    : {}
                }
              >
                {option}
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {showReward && <StarReward show={showReward} />}
      
      {/* Duolingo风格成功反馈 */}
      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1] }}
            className="rounded-full bg-green-400/90 shadow-2xl p-16"
          >
            <div className="text-white text-8xl">✓</div>
          </motion.div>
          
          {/* 庆祝粒子效果 */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.sin(i * 72) * 120,
                y: Math.cos(i * 72) * 120,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ duration: 1.2, delay: i * 0.1 }}
              className="absolute w-12 h-12 bg-yellow-300/80 rounded-full flex items-center justify-center"
            >
              <div className="text-2xl">✨</div>
            </motion.div>
          ))}
          
          {/* "正确!" 文字 */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-1/4 text-5xl font-bold text-white bg-green-500/80 py-4 px-8 rounded-full shadow-lg"
          >
            正确!
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
