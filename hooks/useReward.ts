"use client";

import { useState, useCallback, useEffect } from "react";
import { soundFeedback } from "@/lib/sound-feedback";

export interface RewardState {
  stars: number;
  level: number;
  achievements: {
    firstStar: boolean;
    perfectRound: boolean;
    streak10: boolean;
    dailyChallengeCompleted: boolean;
  };
  streak: number;
  totalCorrect: number;
}

const STORAGE_KEY = "kid-smart-reward";

// Custom event for level-up detection (used by LevelUpContext)
export const LEVEL_UP_EVENT = 'kid-smart-level-up';

function emitLevelUp(newLevel: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(LEVEL_UP_EVENT, { detail: { level: newLevel } })
    );
  }
}

const defaultState: RewardState = {
  stars: 0,
  level: 1,
  achievements: {
    firstStar: false,
    perfectRound: false,
    streak10: false,
    dailyChallengeCompleted: false,
  },
  streak: 0,
  totalCorrect: 0,
};

function calcLevel(stars: number): number {
  return Math.min(10, Math.floor(stars / 10) + 1);
}

export function useReward() {
  const [state, setState] = useState<RewardState>(defaultState);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RewardState;
        setState(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback((next: RewardState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const addStar = useCallback(
    (count = 1) => {
      // 播放获得星星音效
      soundFeedback.play('star');
      
      setState((prev) => {
        const newStars = prev.stars + count;
        const newStreak = prev.streak + 1;
        const newTotalCorrect = prev.totalCorrect + count;
        const newLevel = calcLevel(newStars);

        const achievements = { ...prev.achievements };
        let achievement: string | null = null;

        if (!achievements.firstStar && newStars >= 1) {
          achievements.firstStar = true;
          achievement = "First Star! ⭐";
        }
        if (!achievements.streak10 && newStreak >= 10) {
          achievements.streak10 = true;
          achievement = "10 Streak! 🔥";
        }

        // Detect level-up and emit event
        if (newLevel > prev.level) {
          emitLevelUp(newLevel);
        }

        const next: RewardState = {
          ...prev,
          stars: newStars,
          level: newLevel,
          streak: newStreak,
          totalCorrect: newTotalCorrect,
          achievements,
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        if (achievement) {
          setNewAchievement(achievement);
          // 播放完成任务音效
          soundFeedback.play('complete');
          setTimeout(() => setNewAchievement(null), 3000);
        }

        return next;
      });
    },
    []
  );

  const resetStreak = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, streak: 0 };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const markPerfectRound = useCallback(() => {
    setState((prev) => {
      if (prev.achievements.perfectRound) return prev;
      const next = {
        ...prev,
        achievements: { ...prev.achievements, perfectRound: true },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      setNewAchievement("Perfect Round! 🏆");
      // 播放完成任务音效
      soundFeedback.play('complete');
      setTimeout(() => setNewAchievement(null), 3000);
      return next;
    });
  }, []);

  const markDailyChallenge = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        achievements: { ...prev.achievements, dailyChallengeCompleted: true },
      };
      save(next);
      return next;
    });
  }, [save]);

  const reset = useCallback(() => {
    save(defaultState);
  }, [save]);

  return {
    stars: state.stars,
    level: state.level,
    achievements: state.achievements,
    streak: state.streak,
    totalCorrect: state.totalCorrect,
    newAchievement,
    addStar,
    resetStreak,
    markPerfectRound,
    markDailyChallenge,
    reset,
  };
}
