/**
 * ProgressBar Component - Visual Progress Indicator
 */

'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ 
  current, 
  total, 
  showLabel = true,
  className = '' 
}: ProgressBarProps) {
  const percent = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            进度
          </span>
          <span className="text-sm font-bold text-[#58CC02]">
            {current}/{total}
          </span>
        </div>
      )}
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#58CC02] to-[#89E219] rounded-full"
        />
      </div>

      {showLabel && (
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">{percent}%</span>
        </div>
      )}
    </div>
  );
}
