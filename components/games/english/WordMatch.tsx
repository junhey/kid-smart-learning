"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
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
  const [gameOver, setGameOver] = useState(false);
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
        addStar(1);
        recordCorrect();
        speak(`${word.word}! Correct!`, { rate: 0.9 });
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
        setTimeout(() => {
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
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
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
            {question.options.map((opt) => {
              const isCorrect = opt.word === question.target.word;
              const isSelected = selected === opt.word;
              let className = "answer-btn bg-white border-gray-200 text-gray-700";
              if (isSelected && isCorrect) className = "answer-btn correct";
              if (isSelected && !isCorrect) className = "answer-btn wrong";

              return (
                <motion.button
                  key={opt.word}
                  whileHover={!selected ? { scale: 1.05, y: -3 } : {}}
                  whileTap={!selected ? { scale: 0.95 } : {}}
                  onClick={() => handleSelect(opt)}
                  className={className}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="font-black capitalize text-xl">{opt.word}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
