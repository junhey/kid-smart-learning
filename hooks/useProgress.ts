"use client";

import { useState, useCallback } from "react";

export interface GameProgress {
  currentQuestion: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  isComplete: boolean;
}

export function useProgress(totalQuestions = 10) {
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [total, setTotal] = useState(0);

  const recordCorrect = useCallback(() => {
    setCorrect((c) => c + 1);
    setTotal((t) => t + 1);
  }, []);

  const recordWrong = useCallback(() => {
    setWrong((w) => w + 1);
    setTotal((t) => t + 1);
  }, []);

  const reset = useCallback(() => {
    setCorrect(0);
    setWrong(0);
    setTotal(0);
  }, []);

  const percent =
    totalQuestions > 0 ? Math.round((total / totalQuestions) * 100) : 0;

  const isComplete = total >= totalQuestions;

  return {
    correct,
    wrong,
    total,
    percent,
    isComplete,
    recordCorrect,
    recordWrong,
    reset,
    // Legacy compat
    progress: {
      currentQuestion: total,
      totalQuestions,
      correctCount: correct,
      wrongCount: wrong,
      isComplete,
    },
  };
}
