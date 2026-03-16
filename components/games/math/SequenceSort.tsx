"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrect, playWrong } from '@/lib/sounds';

interface SequenceItem {
  id: string;
  value: string;
  correctPosition: number;
}

interface SequenceData {
  type: 'numbers' | 'alphabet' | 'size';
  items: string[];
  instruction: string;
}

const sequenceData: SequenceData[] = [
  { type: 'numbers', items: ['1', '2', '3', '4'], instruction: '按从小到大排序数字' },
  { type: 'numbers', items: ['5', '6', '7', '8'], instruction: '按从小到大排序数字' },
  { type: 'numbers', items: ['8', '7', '6', '5'], instruction: '按从大到小排序数字' },
  { type: 'numbers', items: ['10', '9', '8', '7'], instruction: '按从大到小排序数字' },
  { type: 'alphabet', items: ['A', 'B', 'C', 'D'], instruction: '按字母顺序排序' },
  { type: 'alphabet', items: ['E', 'F', 'G', 'H'], instruction: '按字母顺序排序' },
  { type: 'size', items: ['🐜', '🐕', '🐘', '🦒'], instruction: '按体型从小到大排序' },
  { type: 'size', items: ['⚪', '🔵', '🟢', '🔴'], instruction: '按大小从小到大排序' },
];

export function SequenceSort({ onComplete }: { onComplete: () => void }) {
  const [currentData, setCurrentData] = useState<SequenceData | null>(null);
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    loadNewSequence();
  }, []);

  const loadNewSequence = () => {
    const data = sequenceData[Math.floor(Math.random() * sequenceData.length)];
    const shuffled = [...data.items]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: `item-${index}`,
        value,
        correctPosition: data.items.indexOf(value),
      }));
    
    setCurrentData(data);
    setItems(shuffled);
    setSelectedId(null);
    setFeedback(null);
  };

  const handleItemClick = (id: string) => {
    if (selectedId === null) {
      setSelectedId(id);
    } else if (selectedId === id) {
      setSelectedId(null);
    } else {
      // Swap items
      const idx1 = items.findIndex(item => item.id === selectedId);
      const idx2 = items.findIndex(item => item.id === id);
      const newItems = [...items];
      [newItems[idx1], newItems[idx2]] = [newItems[idx2], newItems[idx1]];
      setItems(newItems);
      setSelectedId(null);
    }
  };

  const checkAnswer = () => {
    const isCorrect = items.every((item, index) => item.correctPosition === index);
    
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      setShowCelebration(true);
      playCorrect();

      setTimeout(() => {
        setShowCelebration(false);
        if (attempts + 1 >= 5) {
          onComplete();
        } else {
          loadNewSequence();
        }
      }, 2000);
    } else {
      setFeedback('wrong');
      playWrong();
      setTimeout(() => setFeedback(null), 600);
    }
  };

  if (!currentData) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 p-4">
      <div className="text-white text-2xl font-bold mb-4">🔢 序列排序</div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
        <div className="text-white text-lg font-semibold">得分: {score}/{attempts}</div>
      </div>

      <div className="bg-white/90 rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-xl font-bold text-purple-600 mb-2">
            {currentData.instruction}
          </div>
          <div className="text-sm text-gray-500">点击两个项目交换位置</div>
        </div>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              animate={
                selectedId === item.id
                  ? { scale: 1.1, boxShadow: '0 0 0 4px rgba(147, 51, 234, 0.5)' }
                  : feedback === 'wrong'
                  ? { x: [-5, 5, -5, 5, 0], rotate: [-2, 2, -2, 2, 0] }
                  : { scale: 1 }
              }
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                w-20 h-20 rounded-2xl text-3xl font-bold
                flex items-center justify-center
                transition-all duration-200
                ${selectedId === item.id 
                  ? 'bg-purple-500 text-white ring-4 ring-purple-300' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600'
                }
                shadow-lg
              `}
            >
              {item.value}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={checkAnswer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-green-500 hover:to-green-600 transition-all"
        >
          检查答案 ✓
        </motion.button>
      </div>

      <AnimatePresence>
        {showCelebration && (
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
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.2 }}
              className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-7xl"
            >
              🎉
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
