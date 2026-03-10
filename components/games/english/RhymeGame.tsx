"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
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

export default function RhymeGame() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStar, setShowStar] = useState(false);
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
      setTimeout(() => setShowStar(false), 1000);
      recordCorrect();
      setTimeout(() => {
        if (total < 4) {
          generateQuestion();
        }
      }, 1500);
    } else {
      playWrongSound();
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1000);
    }
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

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-white rounded-2xl shadow-xl text-center"
          >
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              Amazing Work!
            </div>
            <div className="text-gray-600">You found all the rhymes!</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-full font-bold hover:bg-purple-600 transition-colors"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
