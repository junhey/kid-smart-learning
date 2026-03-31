"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { dailyTaskEvents } from "@/lib/daily-task-events";

interface DailyTasksContextValue {
  recordMathGame: () => void;
  recordEnglishGame: () => void;
  recordPerfectRound: () => void;
}

const DailyTasksContext = createContext<DailyTasksContextValue | null>(null);

export function DailyTasksProvider({ children }: { children: React.ReactNode }) {
  const { recordMathGame, recordEnglishGame, recordPerfectRound } = useDailyTasks();

  // Listen to global events and update tasks
  useEffect(() => {
    const unsubMath = dailyTaskEvents.onMathGame(recordMathGame);
    const unsubEnglish = dailyTaskEvents.onEnglishGame(recordEnglishGame);
    const unsubPerfect = dailyTaskEvents.onPerfectRound(recordPerfectRound);
    
    return () => {
      unsubMath();
      unsubEnglish();
      unsubPerfect();
    };
  }, [recordMathGame, recordEnglishGame, recordPerfectRound]);

  return (
    <DailyTasksContext.Provider
      value={{
        recordMathGame,
        recordEnglishGame,
        recordPerfectRound,
      }}
    >
      {children}
    </DailyTasksContext.Provider>
  );
}

export function useDailyTasksContext() {
  const context = useContext(DailyTasksContext);
  if (!context) {
    // If no context (older pages), return no-op functions
    return {
      recordMathGame: () => {},
      recordEnglishGame: () => {},
      recordPerfectRound: () => {},
    };
  }
  return context;
}
