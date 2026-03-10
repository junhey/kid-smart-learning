"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
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

export default function ListenAndChoose() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const { addStar, resetStreak } = useReward();
  const { speakWord } = useSound();
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
  }, []);

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
        addStar(1);
        recordCorrect();
        setTimeout(() => {
          setShowReward(false);
          if (total + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        resetStreak();
        recordWrong();
        setTimeout(() => nextQuestion(), 1200);
      }
    },
    [selected, hasSpoken, question, addStar, resetStreak, recordCorrect, recordWrong, nextQuestion, total]
  );

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">👂</div>
          <h2 className="text-4xl font-black text-purple-600 mb-2">Great Ears!</h2>
          <p className="text-2xl text-gray-600">
            {correct}/{TOTAL_ROUNDS} correct!
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { reset(); setGameOver(false); nextQuestion(); }}
          className="btn-kid bg-gradient-to-b from-purple-400 to-purple-500 border-purple-700 text-white px-10"
        >
          Play Again! 👂
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StarReward show={showReward} />
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
