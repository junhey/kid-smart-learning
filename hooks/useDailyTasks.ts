"use client";

import { useState, useCallback, useEffect } from "react";

export interface DailyTask {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  xp: number;
  progress: number;
  total: number;
  color: string;
  bgColor: string;
  type: "math" | "english" | "perfect";
}

export interface DailyTasksState {
  date: string; // YYYY-MM-DD
  tasks: DailyTask[];
  mathGamesPlayed: number;
  englishGamesPlayed: number;
  perfectRoundsAchieved: number;
}

const STORAGE_KEY = "kid-smart-daily-tasks";

// Get today's date in YYYY-MM-DD format (local timezone)
function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function createDefaultTasks(): DailyTask[] {
  return [
    {
      id: "math-master",
      emoji: "🧮",
      title: "数学小达人",
      subtitle: "完成 3 局数学游戏",
      xp: 150,
      progress: 0,
      total: 3,
      color: "from-orange-400 to-red-400",
      bgColor: "from-orange-50 to-red-50",
      type: "math",
    },
    {
      id: "english-daily",
      emoji: "🔤",
      title: "英语每日练",
      subtitle: "完成 2 局英语游戏",
      xp: 100,
      progress: 0,
      total: 2,
      color: "from-blue-400 to-cyan-400",
      bgColor: "from-blue-50 to-cyan-50",
      type: "english",
    },
    {
      id: "perfectionist",
      emoji: "⭐",
      title: "完美主义者",
      subtitle: "获得 1 次满分",
      xp: 200,
      progress: 0,
      total: 1,
      color: "from-purple-400 to-pink-400",
      bgColor: "from-purple-50 to-pink-50",
      type: "perfect",
    },
  ];
}

function createDefaultState(): DailyTasksState {
  return {
    date: getTodayDate(),
    tasks: createDefaultTasks(),
    mathGamesPlayed: 0,
    englishGamesPlayed: 0,
    perfectRoundsAchieved: 0,
  };
}

export function useDailyTasks() {
  const [state, setState] = useState<DailyTasksState>(createDefaultState());
  const [taskCompleted, setTaskCompleted] = useState<string | null>(null);

  // Load from localStorage and check if we need to reset for a new day
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const today = getTodayDate();
      
      if (stored) {
        const parsed = JSON.parse(stored) as DailyTasksState;
        
        // If stored date is different from today, reset to new day
        if (parsed.date !== today) {
          const fresh = createDefaultState();
          setState(fresh);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        } else {
          setState(parsed);
        }
      }
    } catch {
      // If error, start fresh
      setState(createDefaultState());
    }
  }, []);

  const save = useCallback((next: DailyTasksState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  // Record a math game completion
  const recordMathGame = useCallback(() => {
    setState((prev) => {
      const mathGamesPlayed = prev.mathGamesPlayed + 1;
      const tasks = prev.tasks.map((task) => {
        if (task.type === "math") {
          const newProgress = Math.min(task.total, mathGamesPlayed);
          const wasCompleted = task.progress >= task.total;
          const isNowCompleted = newProgress >= task.total;
          
          if (!wasCompleted && isNowCompleted) {
            setTaskCompleted(task.title);
            setTimeout(() => setTaskCompleted(null), 3000);
          }
          
          return { ...task, progress: newProgress };
        }
        return task;
      });

      const next = { ...prev, tasks, mathGamesPlayed };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Record an English game completion
  const recordEnglishGame = useCallback(() => {
    setState((prev) => {
      const englishGamesPlayed = prev.englishGamesPlayed + 1;
      const tasks = prev.tasks.map((task) => {
        if (task.type === "english") {
          const newProgress = Math.min(task.total, englishGamesPlayed);
          const wasCompleted = task.progress >= task.total;
          const isNowCompleted = newProgress >= task.total;
          
          if (!wasCompleted && isNowCompleted) {
            setTaskCompleted(task.title);
            setTimeout(() => setTaskCompleted(null), 3000);
          }
          
          return { ...task, progress: newProgress };
        }
        return task;
      });

      const next = { ...prev, tasks, englishGamesPlayed };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Record a perfect round achievement
  const recordPerfectRound = useCallback(() => {
    setState((prev) => {
      const perfectRoundsAchieved = prev.perfectRoundsAchieved + 1;
      const tasks = prev.tasks.map((task) => {
        if (task.type === "perfect") {
          const newProgress = Math.min(task.total, perfectRoundsAchieved);
          const wasCompleted = task.progress >= task.total;
          const isNowCompleted = newProgress >= task.total;
          
          if (!wasCompleted && isNowCompleted) {
            setTaskCompleted(task.title);
            setTimeout(() => setTaskCompleted(null), 3000);
          }
          
          return { ...task, progress: newProgress };
        }
        return task;
      });

      const next = { ...prev, tasks, perfectRoundsAchieved };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Calculate completion stats
  const completedTasksCount = state.tasks.filter((t) => t.progress >= t.total).length;
  const totalTasksCount = state.tasks.length;

  return {
    tasks: state.tasks,
    completedCount: completedTasksCount,
    totalCount: totalTasksCount,
    taskCompleted,
    recordMathGame,
    recordEnglishGame,
    recordPerfectRound,
  };
}
