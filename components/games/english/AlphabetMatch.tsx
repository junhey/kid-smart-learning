"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";

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
import alphabetData from "@/data/english/alphabet.json";
import { shuffleArray, pickRandom } from "@/lib/gameUtils";

interface AlphabetItem {
  letter: string;
  name: string;
  word: string;
  emoji: string;
  sound: string;
}

interface Question {
  target: AlphabetItem;
  correctAnswer: string;
  options: string[];
}

const TOTAL_ROUNDS = 10;

function buildQuestion(): Question {
  const target = pickRandom(alphabetData as AlphabetItem[], 1)[0];
  const correctAnswer = target.name;
  
  // 生成3个不正确答案
  const allNames = alphabetData.map(item => item.name);
  const wrongOptions = allNames
    .filter(name => name !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const options = shuffleArray([correctAnswer, ...wrongOptions]);
  
  return {
    target,
    correctAnswer,
    options
  };
}

export default function AlphabetMatch() {
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
      setTimeout(() => setGameOver(true), 1500);
      return;
    }
    setQuestion(buildQuestion());
    setSelected(null);
    setShowReward(false);
  }, []);

  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongAnswerAnimation, setWrongAnswerAnimation] = useState(false);
  const [showCelebrationFull, setShowCelebrationFull] = useState(false);

  const handleSelect = (option: string) => {
    if (selected || !question) return;
    
    setSelected(option);
    if (option === question.correctAnswer) {
      playCorrectSound();
      recordCorrect();
      addStar(1);
      setShowReward(true);
      setShowCelebration(true);
      setShowCelebrationFull(true);
      setTimeout(() => {
        setShowCelebration(false);
        setShowCelebrationFull(false);
      }, 1200);
    } else {
      playWrongSound();
      setWrongAnswerAnimation(true);
      setTimeout(() => setWrongAnswerAnimation(false), 600);
    }
    
    roundRef.current++;
    setTimeout(nextRound, selected === question.correctAnswer ? 1500 : 1200);
  };

  const handleRestart = () => {
    roundRef.current = 0;
    setGameOver(false);
    reset();
    setQuestion(buildQuestion());
    setSelected(null);
    setShowReward(false);
    setWrongAnswerAnimation(false);
    setShowCelebrationFull(false);
  };

  useEffect(() => {
    setQuestion(buildQuestion());
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* 游戏标题和进度 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🔠</span>
              字母配对
            </h1>
            <p className="text-gray-600 text-sm">选择字母的正确读音</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">第 {roundRef.current + 1}/{TOTAL_ROUNDS} 关</p>
              <ProgressBar current={roundRef.current} total={TOTAL_ROUNDS} />
            </div>
            <div className="bg-white px-3 py-1 rounded-2xl shadow-duolingo-card border border-duolingo-100">
              <div className="flex items-center gap-1">
                <span className="text-lg text-yellow-500">⭐</span>
                <span className="font-bold text-gray-700">{correct}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 目标字母卡 - 使用Duolingo圆角卡片样式 */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="bg-white rounded-4xl p-8 shadow-duolingo-card border-2 border-duolingo-200 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-sm bg-duolingo-50 px-3 py-1 rounded-full font-medium">
            目标
          </div>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={showCelebration ? {
                  scale: [1, 1.2, 0.9, 1.1, 1]
                } : {}}
                transition={{ duration: 0.7 }}
                className="text-7xl font-bold text-duolingo-600"
              >
                {question.target.letter}
              </motion.div>
              <div className="text-4xl">{question.target.emoji}</div>
            </div>
            <div className="space-y-2">
              <p className="text-xl text-gray-700 font-medium">
                这个字母的正确读音是？
              </p>
              <p className="text-gray-500 text-sm">
                {question.target.word} ({question.target.sound})
              </p>
            </div>
          </div>
        </motion.div>

        {/* StarReward动画 */}
        <StarReward show={showReward} />
        
        {/* 庆祝动画 */}
        {showCelebrationFull && <CelebrationAnimation />}
        
        {/* 错误答案动画遮罩 */}
        {wrongAnswerAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-400/20 z-40 pointer-events-none"
          />
        )}

        {/* 选项按钮 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {question.options.map((option, index) => {
            const isSelected = selected === option;
            const isCorrect = option === question.correctAnswer;
            const isDisabled = selected !== null;
            
            return (
              <motion.button
                key={index}
                initial={{ scale: 1 }}
                animate={isSelected && !isCorrect ? {
                  x: [0, -10, 10, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.6 }}
                whileHover={!isDisabled ? { scale: 1.03 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option)}
                disabled={isDisabled}
                className={`p-6 rounded-3xl text-lg font-medium transition-all duration-300 shadow-duolingo-card border-2
                  ${isDisabled 
                    ? isCorrect 
                      ? 'bg-duolingo-50 border-duolingo-400 text-duolingo-700' 
                      : isSelected
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-gray-100 border-gray-200 text-gray-500'
                    : 'bg-white border-duolingo-100 hover:bg-duolingo-50 hover:border-duolingo-300 cursor-pointer' 
                  }`}
              >
                {option}
                {isSelected && (
                  <div className="mt-2 text-sm">
                    {isCorrect ? (
                      <span className="text-duolingo-600 flex items-center justify-center gap-1">
                        <span className="text-xl">✓</span> 正确！
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center justify-center gap-1">
                        <span className="text-xl">✗</span> 不对
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}