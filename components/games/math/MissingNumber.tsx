import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './MissingNumber.css';

interface MissingNumberProps {
  onComplete: () => void;
}

interface Question {
  sequence: (number | null)[];
  answer: number;
  missingIndex: number;
}

const MissingNumber: React.FC<MissingNumberProps> = ({ onComplete }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'wrong' | null>(null);

  const totalRounds = 5;

  // 生成题目：多种数字序列模式
  const generateQuestion = (): Question => {
    const patternType = Math.floor(Math.random() * 10); // 0-9 共10种模式
    let start: number, end: number, step: number;

    if (patternType < 2) {
      // 模式1-2: 简单连续 1-5 或 1-6
      start = 1;
      end = patternType === 0 ? 5 : 6;
      step = 1;
    } else if (patternType < 4) {
      // 模式3-4: 中等连续 1-8 或 1-10
      start = 1;
      end = patternType === 2 ? 8 : 10;
      step = 1;
    } else if (patternType === 4) {
      // 模式5: 偶数 2,4,6,8,10
      start = 2;
      end = 10;
      step = 2;
    } else if (patternType === 5) {
      // 模式6: 奇数 1,3,5,7,9
      start = 1;
      end = 9;
      step = 2;
    } else if (patternType === 6) {
      // 模式7: 5的倍数 5,10,15,20
      start = 5;
      end = 20;
      step = 5;
    } else if (patternType === 7) {
      // 模式8: 10的倍数 10,20,30,40
      start = 10;
      end = 40;
      step = 10;
    } else if (patternType === 8) {
      // 模式9: 3的倍数 3,6,9,12,15
      start = 3;
      end = 15;
      step = 3;
    } else {
      // 模式10: 倒数序列 10,9,8,7,6
      start = 10;
      end = 6;
      step = -1;
    }

    const sequence: number[] = [];
    if (step > 0) {
      for (let i = start; i <= end; i += step) {
        sequence.push(i);
      }
    } else {
      for (let i = start; i >= end; i += step) {
        sequence.push(i);
      }
    }

    // 随机选择一个位置作为缺失（不选首尾）
    const missingIndex = Math.floor(Math.random() * (sequence.length - 2)) + 1;
    const answer = sequence[missingIndex];
    const seqWithGap = sequence.map((n, i) => (i === missingIndex ? null : n));

    return { sequence: seqWithGap, answer, missingIndex };
  };

  // 生成选项：正确答案 + 3个干扰项
  const generateOptions = (answer: number): number[] => {
    const opts = new Set<number>([answer]);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2; // -2 到 +2
      const candidate = answer + offset;
      if (candidate > 0 && candidate !== answer) {
        opts.add(candidate);
      }
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const q = generateQuestion();
    setQuestion(q);
    setOptions(generateOptions(q.answer));
  }, [round]);

  const handleAnswer = (selected: number) => {
    if (!question || selectedAnswer !== null) return;

    setSelectedAnswer(selected);
    const isCorrect = selected === question.answer;

    if (isCorrect) {
      setFeedbackState('correct');
      setScore(score + 1);

      // 音效
      const correctSound = new Audio('/sounds/correct.mp3');
      correctSound.play().catch(() => {});

      // 延迟后进入下一轮或完成
      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          setShowCelebration(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setTimeout(onComplete, 3000);
        } else {
          setRound(round + 1);
          setSelectedAnswer(null);
          setFeedbackState(null);
        }
      }, 1200);
    } else {
      setFeedbackState('wrong');
      const wrongSound = new Audio('/sounds/wrong.mp3');
      wrongSound.play().catch(() => {});

      // 错误后重置选择，允许再次尝试
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedbackState(null);
      }, 1000);
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="missing-number-container">
      <div className="missing-number-header">
        <h2>找出缺失的数字 🔢</h2>
        <div className="score-display">
          第 {round + 1}/{totalRounds} 题 | ⭐ {score}
        </div>
      </div>

      <div className="sequence-display">
        {question.sequence.map((num, idx) => (
          <motion.div
            key={idx}
            className={`sequence-box ${num === null ? 'missing' : ''}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            {num !== null ? num : '?'}
          </motion.div>
        ))}
      </div>

      <div className="options-grid">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === question.answer;
          let buttonClass = 'option-button';

          if (isSelected && feedbackState === 'correct') {
            buttonClass += ' correct';
          } else if (isSelected && feedbackState === 'wrong') {
            buttonClass += ' wrong';
          }

          return (
            <motion.button
              key={opt}
              className={buttonClass}
              onClick={() => handleAnswer(opt)}
              disabled={selectedAnswer !== null}
              whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
              whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
              animate={
                isSelected && feedbackState === 'wrong'
                  ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } }
                  : {}
              }
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="celebration-content"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <div className="celebration-icon">🎉</div>
              <h2>太棒了！</h2>
              <p>你答对了 {score}/{totalRounds} 题！</p>
              <div className="stars">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissingNumber;
