/**
 * Mascot Component - Professor Hoot 🦉
 * Intelligent companion that provides encouragement
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'encouraging' | 'excited' | 'thinking';
  autoHide?: boolean;
  hideDuration?: number;
}

const moodEmojis = {
  happy: '🦉',
  encouraging: '💪🦉',
  excited: '🎉🦉',
  thinking: '🤔🦉',
};

const moodColors = {
  happy: 'from-[#FF9600] to-[#FF6600]',
  encouraging: 'from-[#1CB0F6] to-[#1899D6]',
  excited: 'from-[#58CC02] to-[#46A302]',
  thinking: 'from-[#CE82FF] to-[#A855F7]',
};

export function Mascot({ 
  message, 
  mood = 'happy',
  autoHide = true,
  hideDuration = 3000 
}: MascotProps) {
  const [showBubble, setShowBubble] = useState(!!message);

  useEffect(() => {
    if (message && autoHide) {
      setShowBubble(true);
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, hideDuration);
      return () => clearTimeout(timer);
    }
  }, [message, autoHide, hideDuration]);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <div className="relative">
        {/* Speech Bubble */}
        <AnimatePresence>
          {showBubble && message && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="absolute bottom-full right-0 mb-4 w-64"
            >
              <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-gray-100 relative">
                <p className="text-sm font-medium text-gray-800">
                  {message}
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white transform rotate-45 border-r-2 border-b-2 border-gray-100" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Owl Avatar */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`
            w-20 h-20 
            bg-gradient-to-br ${moodColors[mood]}
            rounded-full 
            flex items-center justify-center 
            text-4xl 
            shadow-2xl
            border-4 border-white
            cursor-pointer
            hover:scale-110
            transition-transform
          `}
          onClick={() => message && setShowBubble(!showBubble)}
        >
          {moodEmojis[mood]}
        </motion.div>

        {/* Glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className={`
            absolute inset-0 
            rounded-full 
            bg-gradient-to-br ${moodColors[mood]}
            opacity-50
            blur-xl
            -z-10
          `}
        />
      </div>
    </div>
  );
}

// Preset messages helper
export const mascotMessages = {
  welcome: '嗨！我是 Professor Hoot！让我们一起学习吧！',
  correct3: '哇！你连续答对3题了！太厉害了！🎉',
  wrong1: '没关系，每个人都会犯错。再试一次！💪',
  gameComplete: '恭喜你完成游戏！你真是太棒了！🏆',
  newAchievement: '哇！你解锁了新成就！继续加油！⭐',
  levelUp: '升级啦！你现在更厉害了！🚀',
  needBreak: '学了这么久，要不要休息一下？🌈',
};
