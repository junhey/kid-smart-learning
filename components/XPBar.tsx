/**
 * XPBar Component - Experience Points Visualization
 */

'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

export function XPBar({ level, currentXP, nextLevelXP }: XPBarProps) {
  const percent = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#CE82FF] to-[#A855F7] text-white font-black text-lg shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          {level}
        </motion.div>
        
        <div className="flex-1">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Level {level}
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#CE82FF] to-[#A855F7] rounded-full"
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">XP</div>
          <div className="text-sm font-bold text-[#CE82FF]">
            {currentXP}/{nextLevelXP}
          </div>
        </div>
      </div>
    </div>
  );
}
