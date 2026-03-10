"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StarRewardProps {
  show: boolean;
  onComplete?: () => void;
}

export default function StarReward({ show, onComplete }: StarRewardProps) {
  const stars = Array.from({ length: 8 }, (_, i) => i);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          {/* Central star */}
          <motion.div
            className="text-8xl absolute"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.5, 1], rotate: [0, 360] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            ⭐
          </motion.div>

          {/* Orbiting stars */}
          {stars.map((i) => {
            const angle = (i / stars.length) * 360;
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * 120;
            const y = Math.sin(radian) * 120;
            return (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: [0, x * 0.5, x],
                  y: [0, y * 0.5, y],
                  scale: [0, 1.2, 0.8],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              >
                {i % 2 === 0 ? "⭐" : "✨"}
              </motion.div>
            );
          })}

          {/* Correct text */}
          <motion.div
            className="absolute top-1/3 text-4xl font-black text-yellow-400 drop-shadow-lg"
            style={{ WebkitTextStroke: "2px #f97316" }}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: [0, 1.3, 1], y: [-20, -60] }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            +1 ⭐
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
