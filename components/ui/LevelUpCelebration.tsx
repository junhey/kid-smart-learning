/**
 * LevelUpCelebration Component - Full-screen celebration when the child levels up
 *
 * Features:
 * - Full-screen overlay with confetti particles
 * - Animated level badge with spring physics
 * - Encouraging messages that rotate
 * - Auto-dismiss after 4 seconds OR tap to dismiss (child-friendly)
 * - Respects prefers-reduced-motion
 * - Sound integration via soundFeedback
 * - Accessible: proper ARIA roles and keyboard dismissal
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { soundFeedback } from '@/lib/sound-feedback';

interface LevelUpCelebrationProps {
  level: number;
  show: boolean;
  onDismiss: () => void;
}

// Encouraging messages per level milestone
const levelMessages: Record<number, string> = {
  2: '你迈出了第一步！🌱',
  3: '学习小达人！📖',
  4: '越来越厉害了！💪',
  5: '半路英雄！⚔️',
  6: '知识小博士！🎓',
  7: '不可思议！🌈',
  8: '超级学霸！🦸',
  9: '接近满级！🔥',
  10: '最强王者！👑',
};

const defaultMessage = '太棒了，升级啦！🎉';

// Confetti particle configuration
const confettiColors = [
  '#FF6B6B', '#FFB84D', '#FFE066', '#81C784',
  '#4DD0E1', '#A78BFA', '#FF66C4', '#58CC02',
];

function ConfettiParticle({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const color = confettiColors[index % confettiColors.length];
  const startX = Math.random() * 100; // % from left
  const delay = Math.random() * 0.6;
  const duration = 2 + Math.random() * 1.5;
  const rotation = Math.random() * 720 - 360;
  const size = 8 + Math.random() * 12;
  const shape = index % 3; // 0: square, 1: circle, 2: rectangle

  if (reducedMotion) return null;

  return (
    <motion.div
      initial={{
        x: `${startX}vw`,
        y: -20,
        rotate: 0,
        opacity: 1,
        scale: 0,
      }}
      animate={{
        y: '110vh',
        rotate: rotation,
        opacity: [1, 1, 0.8, 0],
        scale: [0, 1.2, 1, 0.6],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeIn',
      }}
      className="absolute pointer-events-none"
      style={{
        width: shape === 2 ? size * 1.5 : size,
        height: shape === 1 ? size : size * 0.6,
        backgroundColor: color,
        borderRadius: shape === 1 ? '50%' : shape === 0 ? '2px' : '1px',
      }}
      aria-hidden="true"
    />
  );
}

export function LevelUpCelebration({ level, show, onDismiss }: LevelUpCelebrationProps) {
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (show) {
      // Play celebration sound
      soundFeedback.play('complete');

      // Auto-dismiss after 4.5 seconds
      timerRef.current = setTimeout(() => {
        dismiss();
      }, 4500);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [show, dismiss]);

  // Keyboard dismiss
  useEffect(() => {
    if (!show) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, dismiss]);

  const message = levelMessages[level] || defaultMessage;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`恭喜升级到等级 ${level}`}
          onClick={dismiss}
          onTouchEnd={dismiss}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-pink-900/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Confetti Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} reducedMotion={prefersReducedMotion} />
            ))}
          </div>

          {/* Central Content */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 15 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="relative z-10 flex flex-col items-center gap-6 px-8 py-12 max-w-sm"
          >
            {/* Glow Ring */}
            <motion.div
              animate={prefersReducedMotion ? {} : {
                scale: [1, 1.15, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-300/20 to-pink-400/30 rounded-full blur-3xl"
              aria-hidden="true"
            />

            {/* Level Badge */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.4,
              }}
              className="relative"
            >
              {/* Badge outer ring */}
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -inset-4 rounded-full border-4 border-dashed border-yellow-300/50"
                aria-hidden="true"
              />

              {/* Badge body */}
              <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 border-4 border-white/50">
                {/* Inner circle */}
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full flex items-center justify-center border-2 border-yellow-400/50">
                  <div className="text-center">
                    <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">Level</div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                        delay: 0.7,
                      }}
                      className="text-4xl font-black text-orange-700"
                    >
                      {level}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Star decorations around badge */}
              {!prefersReducedMotion && [0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.div
                  key={angle}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 400 }}
                  className="absolute text-xl"
                  style={{
                    top: `${50 - 55 * Math.cos((angle * Math.PI) / 180)}%`,
                    left: `${50 + 55 * Math.sin((angle * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-hidden="true"
                >
                  ⭐
                </motion.div>
              ))}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
                🎊 升级啦！🎊
              </h2>
              <p className="text-xl font-bold text-yellow-200 drop-shadow-md">
                {message}
              </p>
            </motion.div>

            {/* Progress hint */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30"
            >
              <p className="text-sm text-white/90 text-center font-medium">
                {level < 10
                  ? `再获得 ${(level) * 10 - 0} 颗星星升到下一级！`
                  : '你已经达到最高等级！🏆'
                }
              </p>
            </motion.div>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
              className="text-white/60 text-xs font-medium"
            >
              点击任意位置继续
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
