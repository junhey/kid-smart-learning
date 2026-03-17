"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { useToast } from '@/components/ui/Toast';

interface Pattern {
  sequence: string[];
  answer: string;
  options: string[];
}

const patterns: Pattern[] = [
  // AB规律 (简单交替)
  { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', options: ['🔵', '🔴', '🟡', '🟢'] },
  { sequence: ['🐶', '🐱', '🐶', '🐱', '🐶'], answer: '🐱', options: ['🐱', '🐶', '🐭', '🐰'] },
  { sequence: ['1️⃣', '2️⃣', '1️⃣', '2️⃣', '1️⃣'], answer: '2️⃣', options: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'] },
  { sequence: ['🅰️', '🅱️', '🅰️', '🅱️', '🅰️'], answer: '🅱️', options: ['🅰️', '🅱️', '🅲️', '🅳️'] },
  { sequence: ['🌸', '🌺', '🌸', '🌺', '🌸'], answer: '🌺', options: ['🌸', '🌺', '🌻', '🌹'] },
  
  // AAB规律 (双A单B)
  { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['⭐', '🌙', '☀️', '🌟'] },
  { sequence: ['🍎', '🍎', '🍌', '🍎', '🍎'], answer: '🍌', options: ['🍎', '🍌', '🍇', '🍓'] },
  { sequence: ['🐻', '🐻', '🐰', '🐻', '🐻'], answer: '🐰', options: ['🐻', '🐰', '🦊', '🐼'] },
  { sequence: ['🟦', '🟦', '🟨', '🟦', '🟦'], answer: '🟨', options: ['🟦', '🟨', '🟥', '🟩'] },
  { sequence: ['🏀', '🏀', '⚽', '🏀', '🏀'], answer: '⚽', options: ['🏀', '⚽', '🏈', '⚾'] },
  
  // ABB规律 (单A双B)
  { sequence: ['🔴', '🔵', '🔵', '🔴', '🔵'], answer: '🔵', options: ['🔴', '🔵', '🟡', '🟢'] },
  { sequence: ['🌻', '🌹', '🌹', '🌻', '🌹'], answer: '🌹', options: ['🌻', '🌹', '🌺', '🌸'] },
  { sequence: ['🐸', '🐢', '🐢', '🐸', '🐢'], answer: '🐢', options: ['🐸', '🐢', '🐍', '🦎'] },
  { sequence: ['🍓', '🍇', '🍇', '🍓', '🍇'], answer: '🍇', options: ['🍓', '🍇', '🍊', '🍋'] },
  { sequence: ['⚡', '🌟', '🌟', '⚡', '🌟'], answer: '🌟', options: ['⚡', '🌟', '💫', '✨'] },
  
  // ABC规律 (三元素循环)
  { sequence: ['🟥', '🟦', '🟩', '🟥', '🟦'], answer: '🟩', options: ['🟥', '🟦', '🟩', '🟨'] },
  { sequence: ['🍎', '🍌', '🍇', '🍎', '🍌'], answer: '🍇', options: ['🍎', '🍌', '🍇', '🍓'] },
  { sequence: ['🐕', '🐈', '🐇', '🐕', '🐈'], answer: '🐇', options: ['🐕', '🐈', '🐇', '🐦'] },
  { sequence: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣'], answer: '3️⃣', options: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'] },
  { sequence: ['🌞', '🌙', '⭐', '🌞', '🌙'], answer: '⭐', options: ['🌞', '🌙', '⭐', '☁️'] },
  
  // AABB规律 (双双交替)
  { sequence: ['🦋', '🦋', '🐝', '🐝', '🦋'], answer: '🦋', options: ['🦋', '🐝', '🐞', '🦗'] },
  { sequence: ['🎈', '🎈', '🎁', '🎁', '🎈'], answer: '🎈', options: ['🎈', '🎁', '🎂', '🎉'] },
  { sequence: ['🔔', '🔔', '🎵', '🎵', '🔔'], answer: '🔔', options: ['🔔', '🎵', '🎶', '🎸'] },
  { sequence: ['🌊', '🌊', '🏔️', '🏔️', '🌊'], answer: '🌊', options: ['🌊', '🏔️', '🌋', '🏝️'] },
  
  // ABCD规律 (四元素循环)
  { sequence: ['🌸', '🌺', '🌻', '🌹', '🌸'], answer: '🌺', options: ['🌸', '🌺', '🌻', '🌹'] },
  { sequence: ['🎨', '🖌️', '✏️', '🖍️', '🎨'], answer: '🖌️', options: ['🎨', '🖌️', '✏️', '🖍️'] },
  { sequence: ['🚗', '🚕', '🚙', '🚌', '🚗'], answer: '🚕', options: ['🚗', '🚕', '🚙', '🚌'] },
  
  // ABBA规律 (镜像对称)
  { sequence: ['🍎', '🍌', '🍌', '🍎', '🍎'], answer: '🍌', options: ['🍎', '🍌', '🍇', '🍓'] },
  { sequence: ['🐘', '🦒', '🦒', '🐘', '🐘'], answer: '🦒', options: ['🐘', '🦒', '🦓', '🦏'] },
  
  // AAB + AAB循环 (复合规律)
  { sequence: ['🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', options: ['🔵', '🔴', '🟡', '🟢'] },
  { sequence: ['🎯', '🎯', '🎪', '🎯', '🎯'], answer: '🎪', options: ['🎯', '🎪', '🎭', '🎬'] },
  
  // 递增规律 (数字序列)
  { sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], answer: '6️⃣', options: ['5️⃣', '6️⃣', '7️⃣', '8️⃣'] },
];

export const PatternMatch: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { playCorrectSound, playWrongSound } = useSound();
  const { showCorrect, showWrong, ToastComponent } = useToast();

  useEffect(() => {
    loadNewPattern();
  }, []);

  const loadNewPattern = () => {
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(randomPattern);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer || !currentPattern) return;

    setSelectedAnswer(answer);
    const correct = answer === currentPattern.answer;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      setScore(score + 1);
      showCorrect('Perfect! You found the pattern! 🎉');
      setTimeout(() => {
        loadNewPattern();
      }, 1500);
    } else {
      playWrongSound();
      showWrong('Try again! Look at the pattern closely! 🔍');
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  if (!currentPattern) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 p-8 flex flex-col">
      <ToastComponent />
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-white mb-2">🔍 Pattern Match</h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
          <span className="text-white text-2xl font-bold">⭐ {score}</span>
        </div>
      </motion.div>

      {/* Pattern Sequence */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl"
      >
        <p className="text-white text-2xl font-bold text-center mb-6">
          What comes next?
        </p>
        <div className="flex justify-center items-center gap-4 mb-4">
          {currentPattern.sequence.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center text-5xl shadow-lg"
            >
              {item}
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: currentPattern.sequence.length * 0.1 }}
            className="bg-white/50 rounded-2xl w-20 h-20 flex items-center justify-center text-5xl border-4 border-dashed border-white"
          >
            ❓
          </motion.div>
        </div>
      </motion.div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto w-full">
        {currentPattern.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const showFeedback = isSelected && isCorrect !== null;

          return (
            <motion.button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={selectedAnswer !== null}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
                x: showFeedback && !isCorrect ? [0, -10, 10, -10, 10, 0] : 0,
                backgroundColor: showFeedback
                  ? isCorrect
                    ? 'rgba(34, 197, 94, 0.9)'
                    : 'rgba(239, 68, 68, 0.9)'
                  : 'rgba(255, 255, 255, 0.9)',
              }}
              transition={{
                delay: index * 0.1,
                x: { duration: 0.5 },
              }}
              whileHover={{ scale: selectedAnswer ? 1 : 1.05 }}
              whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
              className="aspect-square rounded-3xl shadow-xl flex items-center justify-center text-6xl font-bold transition-all disabled:cursor-not-allowed"
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PatternMatch;
