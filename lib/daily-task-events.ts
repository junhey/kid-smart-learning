/**
 * Daily Tasks Global Event System
 * 
 * This allows games to notify task progress without direct hook dependencies
 */

type TaskEventListener = () => void;

const mathGameListeners: TaskEventListener[] = [];
const englishGameListeners: TaskEventListener[] = [];
const perfectRoundListeners: TaskEventListener[] = [];

export const dailyTaskEvents = {
  // Register listeners
  onMathGame: (listener: TaskEventListener) => {
    mathGameListeners.push(listener);
    return () => {
      const index = mathGameListeners.indexOf(listener);
      if (index > -1) mathGameListeners.splice(index, 1);
    };
  },
  
  onEnglishGame: (listener: TaskEventListener) => {
    englishGameListeners.push(listener);
    return () => {
      const index = englishGameListeners.indexOf(listener);
      if (index > -1) englishGameListeners.splice(index, 1);
    };
  },
  
  onPerfectRound: (listener: TaskEventListener) => {
    perfectRoundListeners.push(listener);
    return () => {
      const index = perfectRoundListeners.indexOf(listener);
      if (index > -1) perfectRoundListeners.splice(index, 1);
    };
  },
  
  // Emit events
  emitMathGame: () => {
    mathGameListeners.forEach(listener => listener());
  },
  
  emitEnglishGame: () => {
    englishGameListeners.forEach(listener => listener());
  },
  
  emitPerfectRound: () => {
    perfectRoundListeners.forEach(listener => listener());
  },
};
