"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import alphabetData from "@/data/english/alphabet.json";
import wordsData from "@/data/english/words.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface AlphabetItem {
  letter: string;
  name: string;
  word: string;
  emoji: string;
}

interface WordItem {
  word: string;
  emoji: string;
}

interface Question {
  letter: string;
  correct: WordItem;
  options: WordItem[];
}

const TOTAL_ROUNDS = 10;

function getAllWords(): WordItem[] {
  const all: WordItem[] = [];
  const cats = ["animals", "fruits", "objects", "family"] as const;
  for (const cat of cats) {
    all.push(...(wordsData[cat] as WordItem[]));
  }
  return all;
}

function buildQuestion(): Question {
  const alphabet = alphabetData as AlphabetItem[];
  const allWords = getAllWords();

  // Pick a letter that has a matching word starting with it
  let letter: string;
  let correct: WordItem | undefined;
  let attempts = 0;

  do {
    const al = alphabet[Math.floor(Math.random() * alphabet.length)];
    letter = al.letter;
    correct = allWords.find(
      (w) => w.word[0].toUpperCase() === letter
    );
    attempts++;
  } while (!correct && attempts < 30);

  // Fallback: use letter A -> apple
  if (!correct) {
    letter = "A";
    correct = { word: "apple", emoji: "🍎" };
  }

  const others = pickRandom(
    allWords.filter((w) => w.word[0].toUpperCase() !== letter),
    3
  );
  return { letter, correct, options: shuffleArray([correct, ...others]) };
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

export default function PhonicsGame() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const { addStar, resetStreak } = useReward();
  const { speakLetter, speakWord, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);

  const nextQuestion = useCallback(() => {
    const q = buildQuestion();
    setQuestion(q);
    setSelected(null);
    setTimeout(() => speakLetter(q.letter), 400);
  }, [speakLetter]);

  useEffect(() => {
    nextQuestion();
  }, []);

  const handleSelect = useCallback(
    (opt: WordItem) => {
      if (selected) return;
      setSelected(opt.word);
      speakWord(opt.word);

      if (opt.word === question?.correct.word) {
        setShowReward(true);
        setShowCelebration(true);
        playCorrectSound();
        addStar(1);
        recordCorrect();
        setTimeout(() => {
          setShowReward(false);
          setShowCelebration(false);
          if (total + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1800);
      } else {
        playWrongSound();
        resetStreak();
        recordWrong();
        setTimeout(() => nextQuestion(), 1500);
      }
    },
    [selected, question, addStar, resetStreak, recordCorrect, recordWrong, speakWord, nextQuestion, total, playCorrectSound, playWrongSound]
  );

  if (gameOver) {
    return (
      <GameResult
        correct={correct}
        total={TOTAL_ROUNDS}
        onRestart={() => {
          reset();
          setGameOver(false);
          nextQuestion();
        }}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {showCelebration && <CelebrationAnimation />}
      <StarReward show={showReward} />
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-blue-400 to-indigo-500" />

      {question && (
        <motion.div
          key={question.letter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center my-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl inline-block">
              <p className="text-xl font-bold text-gray-600 mb-2">
                Which one starts with...
              </p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-8xl font-black text-blue-600"
                style={{ fontFamily: "Fredoka One, cursive" }}
              >
                {question.letter}
              </motion.div>
              <motion.button
                onClick={() => speakLetter(question.letter)}
                className="mt-2 bg-blue-100 hover:bg-blue-200 rounded-full px-4 py-2 text-blue-700 font-bold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔊 Hear it!
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((opt) => {
              const isCorrect = opt.word === question.correct.word;
              const isSelected = selected === opt.word;
              let cls = "answer-btn bg-white border-gray-200 text-gray-700";
              if (isSelected && isCorrect) cls = "answer-btn correct";
              if (isSelected && !isCorrect) cls = "answer-btn wrong";

              return (
                <motion.button
                  key={opt.word}
                  whileHover={!selected ? { scale: 1.05, y: -3 } : {}}
                  whileTap={!selected ? { scale: 0.95 } : {}}
                  onClick={() => handleSelect(opt)}
                  className={cls}
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
                  <div className="text-4xl">{opt.emoji}</div>
                  <div className="font-bold capitalize text-lg">{opt.word}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
