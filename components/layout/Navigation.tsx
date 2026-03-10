"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavigationProps {
  onBack: (() => void) | null;
  title: string;
}

export default function Navigation({ onBack, title }: NavigationProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center gap-4 mb-6"
    >
      {onBack ? (
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white rounded-2xl px-4 py-3 font-bold text-lg shadow-md text-gray-700 flex items-center gap-2 border-b-4 border-gray-200"
        >
          ← Back
        </motion.button>
      ) : (
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white rounded-2xl px-4 py-3 font-bold text-lg shadow-md text-gray-700 flex items-center gap-2 border-b-4 border-gray-200"
          >
            🏠 Home
          </motion.div>
        </Link>
      )}
      <h2 className="text-2xl font-black text-gray-700 flex-1">{title}</h2>
    </motion.div>
  );
}
