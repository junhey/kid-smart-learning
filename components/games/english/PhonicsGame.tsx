"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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

export default function PhonicsGame() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { addStar, resetStreak } = useReward();
  const { speakLetter, speakWord } = useSound();
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
    [selected, question, addStar, resetStreak, recordCorrect, recordWrong, speakWord, nextQuestion, total]
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
              <button
                onClick={() => speakLetter(question.letter)}
                className="mt-2 bg-blue-100 hover:bg-blue-200 rounded-full px-4 py-2 text-blue-700 font-bold transition-colors"
              >
                🔊 Hear it!
              </button>
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
