"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Toast from '@/components/ui/Toast';

interface MemoryMatchData {
  pairs: string[];
  gridSize: 6 | 8 | 10 | 12;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'correct' | 'wrong' | 'info'>('success');

  const levels: MemoryMatchData[] = [
    { pairs: ['🍎', '🍌', '🍊'], gridSize: 6, difficulty: 'easy' },
    { pairs: ['🐶', '🐱', '🐭', '🐰'], gridSize: 8, difficulty: 'medium' },
    { pairs: ['⭐', '❤️', '🌙', '☀️', '🌈'], gridSize: 10, difficulty: 'hard' },
    { pairs: ['🚗', '🚲', '✈️', '🚂', '🚢', '🚁'], gridSize: 12, difficulty: 'expert' },
  ];

  const currentData = levels[currentLevel];

  useEffect(() => {
    initializeCards();
  }, [currentLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeCards = () => {
    const pairs = currentData.pairs;
    const cardData = [...pairs, ...pairs].map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false,
    }));
    
    const shuffled = cardData.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setShowCelebration(false);
  };

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      const [firstIdx, secondIdx] = newFlipped;
      const isMatch = cards[firstIdx].content === cards[secondIdx].content;

      setTimeout(() => {
        const updatedCards = [...newCards];
        
        if (isMatch) {
          updatedCards[firstIdx].isMatched = true;
          updatedCards[secondIdx].isMatched = true;
          setMatchedPairs(matchedPairs + 1);
          
          // Show success toast
          setToastMessage('Perfect match! 🎯');
          setToastType('success');
          
          if (matchedPairs + 1 === currentData.pairs.length) {
            setShowCelebration(true);
            setTimeout(() => {
              if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
              } else {
                setCurrentLevel(0);
              }
            }, 2000);
          }
        } else {
          updatedCards[firstIdx].isFlipped = false;
          updatedCards[secondIdx].isFlipped = false;
          
          // Show error toast
          setToastMessage('Not a match! Try again! 💪');
          setToastType('wrong');
        }
        
        setCards(updatedCards);
        setFlippedIndices([]);
        setIsChecking(false);
      }, 800);
    }
  };

  const getGridCols = () => {
    switch (currentData.gridSize) {
      case 6: return 'grid-cols-3';
      case 8: return 'grid-cols-4';
      case 10: return 'grid-cols-5';
      case 12: return 'grid-cols-4';
      default: return 'grid-cols-3';
    }
  };

  const difficultyText = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6 bg-white rounded-3xl p-4 shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{moves}</div>
            <div className="text-sm text-gray-500">步数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {matchedPairs}/{currentData.pairs.length}
            </div>
            <div className="text-sm text-gray-500">配对</div>
          </div>
          <div className="px-4 py-2 bg-purple-100 rounded-full">
            <div className="text-sm font-bold text-purple-700">
              {difficultyText[currentData.difficulty]}
            </div>
          </div>
        </motion.div>

        {/* Card Grid */}
        <div className={`grid ${getGridCols()} gap-3 mb-6`}>
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              whileHover={!card.isMatched && !isChecking ? { scale: 1.05 } : {}}
              whileTap={!card.isMatched && !isChecking ? { scale: 0.95 } : {}}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || isChecking}
              className={`
                aspect-square rounded-3xl text-5xl font-bold
                transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? 'bg-white shadow-xl'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400'
                }
                ${card.isMatched ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                flex items-center justify-center
              `}
            >
              {(card.isFlipped || card.isMatched) ? card.content : '❓'}
            </motion.button>
          ))}
        </div>

        {/* Celebration */}
        {showCelebration && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-6"
          >
            <div className="text-7xl mb-2">🎉</div>
            <div className="text-3xl font-bold text-green-600">太棒了！</div>
            <div className="text-gray-600 text-lg">用 {moves} 步完成！</div>
          </motion.div>
        )}

        {/* Reset Button */}
        <AnimatedButton
          onClick={initializeCards}
          variant="primary"
          size="lg"
          className="w-full"
        >
          🔄 重新开始
        </AnimatedButton>

        {/* Toast Feedback */}
        <Toast 
          show={toastMessage !== ''}
          message={toastMessage} 
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      </div>
    </div>
  );
};

export default MemoryMatch;
