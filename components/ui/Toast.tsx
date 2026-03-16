"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  type: "correct" | "wrong" | "info" | "success";
  message: string;
  emoji?: string;
  onClose?: () => void;
  duration?: number; // 自动关闭时间（毫秒），0 表示不自动关闭
}

const TOAST_STYLES = {
  correct: {
    bg: "bg-gradient-to-r from-green-400 to-green-500",
    border: "border-green-600",
    emoji: "🎉",
    shadow: "shadow-green-200",
  },
  wrong: {
    bg: "bg-gradient-to-r from-red-400 to-red-500",
    border: "border-red-600",
    emoji: "💡",
    shadow: "shadow-red-200",
  },
  info: {
    bg: "bg-gradient-to-r from-blue-400 to-blue-500",
    border: "border-blue-600",
    emoji: "ℹ️",
    shadow: "shadow-blue-200",
  },
  success: {
    bg: "bg-gradient-to-r from-yellow-400 to-orange-400",
    border: "border-yellow-600",
    emoji: "⭐",
    shadow: "shadow-yellow-200",
  },
};

export default function Toast({ 
  show, 
  type, 
  message, 
  emoji, 
  onClose, 
  duration = 2000 
}: ToastProps) {
  const style = TOAST_STYLES[type];
  const displayEmoji = emoji || style.emoji;

  useEffect(() => {
    if (show && duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className={`
            fixed top-8 left-1/2 -translate-x-1/2 z-[100]
            ${style.bg} ${style.shadow}
            text-white font-bold text-lg
            px-8 py-4 rounded-2xl
            shadow-2xl border-2 ${style.border}
            flex items-center gap-3
            min-w-[280px] max-w-[90vw]
          `}
        >
          <span className="text-3xl">{displayEmoji}</span>
          <span className="flex-1">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors text-2xl leading-none ml-2"
            >
              ×
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 便捷的 Hook 版本
import { useState, useCallback } from "react";

interface ToastOptions {
  duration?: number;
  emoji?: string;
}

export function useToast() {
  const [toast, setToast] = useState<{
    show: boolean;
    type: "correct" | "wrong" | "info" | "success";
    message: string;
    emoji?: string;
    duration?: number;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = useCallback(
    (
      type: "correct" | "wrong" | "info" | "success",
      message: string,
      options?: ToastOptions
    ) => {
      setToast({
        show: true,
        type,
        message,
        emoji: options?.emoji,
        duration: options?.duration ?? 2000,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const ToastComponent = useCallback(
    () => (
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        emoji={toast.emoji}
        duration={toast.duration}
        onClose={hideToast}
      />
    ),
    [toast, hideToast]
  );

  return {
    showToast,
    hideToast,
    ToastComponent,
    // 快捷方法
    showCorrect: (msg: string, opts?: ToastOptions) => showToast("correct", msg, opts),
    showWrong: (msg: string, opts?: ToastOptions) => showToast("wrong", msg, opts),
    showInfo: (msg: string, opts?: ToastOptions) => showToast("info", msg, opts),
    showSuccess: (msg: string, opts?: ToastOptions) => showToast("success", msg, opts),
  };
}
