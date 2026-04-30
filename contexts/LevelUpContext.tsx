/**
 * LevelUpContext - Monitors level changes and triggers celebration overlay
 *
 * Wraps the app and listens to localStorage for level changes.
 * When a new level is detected (compared to last known), shows celebration.
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LevelUpCelebration } from '@/components/ui/LevelUpCelebration';
import { LEVEL_UP_EVENT } from '@/hooks/useReward';

interface LevelUpContextValue {
  triggerLevelUp: (newLevel: number) => void;
}

const LevelUpContext = createContext<LevelUpContextValue>({
  triggerLevelUp: () => {},
});

export function useLevelUp() {
  return useContext(LevelUpContext);
}

const LAST_LEVEL_KEY = 'kid-smart-last-celebrated-level';

export function LevelUpProvider({ children }: { children: React.ReactNode }) {
  const [celebrating, setCelebrating] = useState(false);
  const [celebratingLevel, setCelebratingLevel] = useState(1);
  const lastKnownLevel = useRef<number>(1);

  // On mount, read last celebrated level and listen for level-up events
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LAST_LEVEL_KEY);
      if (stored) {
        lastKnownLevel.current = parseInt(stored, 10) || 1;
      }
    } catch {
      // ignore
    }

    // Listen for level-up events from useReward hook
    const handleLevelUp = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.level) {
        triggerLevelUp(detail.level);
      }
    };
    window.addEventListener(LEVEL_UP_EVENT, handleLevelUp);
    return () => window.removeEventListener(LEVEL_UP_EVENT, handleLevelUp);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerLevelUp = useCallback((newLevel: number) => {
    if (newLevel > lastKnownLevel.current) {
      lastKnownLevel.current = newLevel;
      setCelebratingLevel(newLevel);
      setCelebrating(true);
      try {
        localStorage.setItem(LAST_LEVEL_KEY, String(newLevel));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setCelebrating(false);
  }, []);

  return (
    <LevelUpContext.Provider value={{ triggerLevelUp }}>
      {children}
      <LevelUpCelebration
        level={celebratingLevel}
        show={celebrating}
        onDismiss={handleDismiss}
      />
    </LevelUpContext.Provider>
  );
}
