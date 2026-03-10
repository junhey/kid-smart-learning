"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import sentencesData from "@/data/english/sentences.json";
import { shuffleArray } from "@/lib/gameUtils";

interface SentenceData {
  id: number;
  words: string[];
  answer: string;
  emoji: string;
}

const TOTAL_ROUNDS = 8;

export default function SentenceBuilder() {
  const [sentence, setSentence] = useState<SentenceData | null>(null);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());

  const { addStar, resetStreak } = useReward();
  const { speakSentence } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextSentence = useCallback(() => {
    const available = (sentencesData as SentenceData[]).filter(
      (s) => !usedIds.has(s.id)
    );
    const pool = available.length > 0 ? available : sentencesData as SentenceData[];
    const s = pool[Math.floor(Math.random() * pool.length)];
    setSentence(s);
    setShuffled(shuffleArray([...s.words]));
    setPlaced([]);
    setFeedback(null);
    setUsedIds((prev) => new Set([...prev, s.id]));
  }, [usedIds]);

  useEffect(() => {
    nextSentence();
  }, []);

  const handleWordClick = useCallback(
    (word: string, from: "shuffled" | "placed") => {
      if (feedback) return;
      if (from === "shuffled") {
        setShuffled((prev) => {
          const idx = prev.indexOf(word);
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        });
        setPlaced((prev) => [...prev, word]);
      } else {
        setPlaced((prev) => {
          const idx = prev.indexOf(word);
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        });
        setShuffled((prev) => [...prev, word]);
      }
    },
    [feedback]
  );

  const handleCheck = useCallback(() => {
    if (!sentence || placed.length !== sentence.words.length) return;
    const userSentence = placed.join(" ");
    if (userSentence === sentence.answer) {
      setFeedback("correct");
      setShowReward(true);
      addStar(1);
      recordCorrect();
      speakSentence(sentence.answer);
      setTimeout(() => {
        setShowReward(false);
        if (total + 1 >= TOTAL_ROUNDS) {
          setGameOver(true);
        } else {
          nextSentence();
        }
      }, 2000);
    } else {
      setFeedback("wrong");
      resetStreak();
      recordWrong();
      setTimeout(() => {
        setFeedback(null);
        setPlaced([]);
        setShuffled(shuffleArray([...(sentence?.words || [])]));
      }, 1000);
    }
  }, [sentence, placed, addStar, resetStreak, recordCorrect, recordWrong, speakSentence, nextSentence, total]);

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={() => {
          reset();
          setGameOver(false);
          setUsedIds(new Set());
          nextSentence();
        }}
        onBack={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-yellow-400 to-orange-400" />

      {sentence && (
        <motion.div
          key={sentence.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="text-center mb-4">
            <span className="text-6xl">{sentence.emoji}</span>
            <p className="text-xl font-bold text-gray-600 mt-2">
              Build the sentence!
            </p>
          </div>

          {/* Placed words area */}
          <div
            className={`min-h-20 bg-white rounded-3xl p-4 shadow-xl mb-4 flex flex-wrap gap-2 items-center border-4 ${
              feedback === "correct"
                ? "border-green-400"
                : feedback === "wrong"
                ? "border-red-400 animate-shake"
                : "border-dashed border-gray-300"
            }`}
          >
            {placed.length === 0 ? (
              <p className="text-gray-400 text-lg font-semibold w-full text-center">
                Click words below to build the sentence...
              </p>
            ) : (
              placed.map((word, i) => (
                <motion.button
                  key={`placed-${i}-${word}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word, "placed")}
                  className="bg-gradient-to-b from-orange-400 to-orange-500 text-white rounded-xl px-4 py-2 font-bold text-xl shadow-md border-b-4 border-orange-700"
                >
                  {word}
                </motion.button>
              ))
            )}
          </div>

          {/* Word bank */}
          <div className="bg-blue-50 rounded-3xl p-4 mb-4 flex flex-wrap gap-2 justify-center min-h-16">
            <AnimatePresence>
              {shuffled.map((word, i) => (
                <motion.button
                  key={`bank-${i}-${word}`}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word, "shuffled")}
                  className="bg-white text-gray-800 rounded-xl px-4 py-2 font-bold text-xl shadow-md border-b-4 border-gray-200 cursor-pointer"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Check button */}
          <div className="text-center">
            <motion.button
              whileHover={placed.length === sentence.words.length ? { scale: 1.05 } : {}}
              whileTap={placed.length === sentence.words.length ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={placed.length !== sentence.words.length}
              className={`btn-kid px-10 ${
                placed.length === sentence.words.length
                  ? "bg-gradient-to-b from-green-400 to-green-500 border-green-700 text-white"
                  : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              Check! ✅
            </motion.button>
          </div>

          {feedback === "wrong" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 font-bold text-lg mt-3"
            >
              Not quite! Try again! 💪
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}
