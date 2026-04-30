"use client";

import { useState, useEffect } from "react";

interface StreakState {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  longestStreak: number;
  totalDaysActive: number;
}

const STORAGE_KEY = "kid-smart-streak";

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function createDefaultState(): StreakState {
  return {
    currentStreak: 0,
    lastActiveDate: "",
    longestStreak: 0,
    totalDaysActive: 0,
  };
}

export function useStreak() {
  const [state, setState] = useState<StreakState>(createDefaultState());
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const today = getTodayDate();
      const yesterday = getYesterdayDate();

      if (stored) {
        const parsed = JSON.parse(stored) as StreakState;

        if (parsed.lastActiveDate === today) {
          // Already visited today, no changes needed
          setState(parsed);
        } else if (parsed.lastActiveDate === yesterday) {
          // Visited yesterday — streak continues!
          const newStreak = parsed.currentStreak + 1;
          const newState: StreakState = {
            currentStreak: newStreak,
            lastActiveDate: today,
            longestStreak: Math.max(parsed.longestStreak, newStreak),
            totalDaysActive: parsed.totalDaysActive + 1,
          };
          setState(newState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          setIsNewDay(true);
        } else {
          // Missed a day or more — streak resets
          const newState: StreakState = {
            currentStreak: 1,
            lastActiveDate: today,
            longestStreak: parsed.longestStreak,
            totalDaysActive: parsed.totalDaysActive + 1,
          };
          setState(newState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          setIsNewDay(true);
        }
      } else {
        // First time user
        const newState: StreakState = {
          currentStreak: 1,
          lastActiveDate: today,
          longestStreak: 1,
          totalDaysActive: 1,
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        setIsNewDay(true);
      }
    } catch {
      // If error, start fresh
      const today = getTodayDate();
      const newState: StreakState = {
        currentStreak: 1,
        lastActiveDate: today,
        longestStreak: 1,
        totalDaysActive: 1,
      };
      setState(newState);
    }
  }, []);

  return {
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    totalDaysActive: state.totalDaysActive,
    isNewDay,
  };
}
