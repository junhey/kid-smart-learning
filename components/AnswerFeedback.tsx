/**
 * AnswerFeedback Component - Enhanced answer feedback with animations and sound
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { soundFeedback } from '@/lib/sound-feedback';

interface AnswerFeedbackProps {
  isCorrect: boolean | null; // null = not answered yet
  message?: string;
  onAnimationComplete?: () => void;
}

export function AnswerFeedback({ 
  isCorrect, 
  message,
  onAnimationComplete 
}: AnswerFeedbackProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isCorrect !== null) {
      // 播放对应音效
      soundFeedback.play(isCorrect ? 'correct' : 'wrong');
      
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onAnimationComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, onAnimationComplete]);

  const correctMessages = [
    '太棒了！🎉',
    '答对了！👍',
    '真聪明！⭐',
    '干得好！💯',
    '完美！✨'
  ];

  const wrongMessages = [
    '再试试！💪',
    '加油！🌟',
    '不要气馁！😊',
    '继续努力！🚀',
    '差一点点！💫'
  ];

  const displayMessage = message || (
    isCorrect 
      ? correctMessages[Math.floor(Math.random() * correctMessages.length)]
      : wrongMessages[Math.floor(Math.random() * wrongMessages.length)]
  );

  return (
    <AnimatePresence>
      {show && isCorrect !== null && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            bounce: 0.6, 
            duration: 0.5 
          }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            animate={isCorrect ? {
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            } : {
              x: [-10, 10, -10, 10, 0],
              rotate: [-5, 5, -5, 5, 0],
            }}
            transition={{ duration: 0.5 }}
            className={`
              px-8 py-6 rounded-3xl shadow-2xl
              text-2xl font-black
              ${isCorrect 
                ? 'bg-gradient-to-br from-[#58CC02] to-[#46A302] text-white' 
                : 'bg-gradient-to-br from-[#FF4B4B] to-[#E03E3E] text-white'
              }
            `}
          >
            {displayMessage}
          </motion.div>

          {/* Particles effect for correct answer */}
          {isCorrect && (
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: '50vw', 
                    y: '50vh',
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{
                    x: `${50 + Math.cos(i * 30 * Math.PI / 180) * 30}vw`,
                    y: `${50 + Math.sin(i * 30 * Math.PI / 180) * 30}vh`,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute text-3xl"
                >
                  ⭐
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
