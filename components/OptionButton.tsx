/**
 * OptionButton Component - Interactive answer option
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface OptionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isCorrect?: boolean;
  isWrong?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
}

export function OptionButton({
  children,
  onClick,
  isCorrect = false,
  isWrong = false,
  isSelected = false,
  disabled = false,
  className = '',
}: OptionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyle = () => {
    if (isCorrect) {
      return 'bg-gradient-to-b from-[#58CC02] to-[#46A302] border-[#3D8A00] text-white animate-bounce-correct';
    }
    if (isWrong) {
      return 'bg-gradient-to-b from-[#FF4B4B] to-[#E03E3E] border-[#C92A2A] text-white animate-shake';
    }
    if (isSelected) {
      return 'bg-[#E5E5E5] border-gray-400 text-gray-800';
    }
    return 'bg-white border-gray-300 hover:border-gray-400 text-gray-800 hover:bg-gray-50';
  };

  return (
    <motion.button
      onClick={() => {
        if (!disabled) {
          setIsPressed(true);
          onClick();
          setTimeout(() => setIsPressed(false), 200);
        }
      }}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        w-full rounded-2xl p-4
        border-2 border-b-4
        font-bold text-lg
        transition-all duration-200
        ${isPressed && !isCorrect && !isWrong ? 'translate-y-1 border-b-2' : ''}
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        ${getButtonStyle()}
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
        {isCorrect && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            ✓
          </motion.span>
        )}
        {isWrong && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            ✗
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}
