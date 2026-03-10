"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  color = "from-yellow-400 to-orange-400",
  showLabel = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm font-bold text-gray-600">
          <span>
            {current}/{total}
          </span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full flex items-center justify-end pr-2`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {percentage > 15 && (
            <motion.span
              className="text-white font-black text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {percentage}%
            </motion.span>
          )}
        </motion.div>
      </div>
      {/* Star markers */}
      <div className="flex justify-between mt-1">
        {[25, 50, 75, 100].map((mark) => (
          <motion.span
            key={mark}
            className={`text-lg transition-all duration-300 ${
              percentage >= mark ? "opacity-100" : "opacity-20"
            }`}
            animate={percentage >= mark ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            ⭐
          </motion.span>
        ))}
      </div>
    </div>
  );
}
