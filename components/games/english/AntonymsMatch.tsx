"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
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

  const nextRound = useCallback(() => {
    if (roundRef.current >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }
    setQuestion(buildQuestion());
    setSelected(null);
    setShowReward(false);
  }, []);

  const handleSelect = (option: string) => {
    if (selected || !question) return;
    setSelected(option);
    if (option === question.correctAnswer) {
      playCorrectSound();
      recordCorrect();
      addStar(1);
      setShowReward(true);
      roundRef.current++;
      setTimeout(nextRound, 1500);
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
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">🎉 游戏结束！</h2>
          <p className="text-2xl">正确：{correct} / {TOTAL_ROUNDS}</p>
        </motion.div>
        <button
          onClick={handleRestart}
          className="px-8 py-4 text-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:scale-105 transition-transform"
        >
          再玩一次
        </button>
      </div>
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
          return (
            <motion.button
              key={option}
              whileHover={{ scale: selected ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option)}
              className={`
                p-8 text-3xl font-bold rounded-2xl transition-all
                ${isCorrect ? "bg-green-500 text-white" : ""}
                ${isWrong ? "bg-red-500 text-white" : ""}
                ${!selected ? "bg-white hover:bg-blue-50 border-4 border-blue-300" : ""}
              `}
              disabled={!!selected}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {showReward && <StarReward show={showReward} />}
    </div>
  );
}
