'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Toast from '@/components/ui/Toast';
import { soundEffects } from '@/utils/soundEffects';
import './WordSpell.css';

// Simple 3-4 letter words from our existing vocabulary
const SPELL_WORDS = [
  { word: 'cat', emoji: '🐱', hint: 'animal' },
  { word: 'dog', emoji: '🐶', hint: 'animal' },
  { word: 'bird', emoji: '🐦', hint: 'animal' },
  { word: 'fish', emoji: '🐟', hint: 'animal' },
  { word: 'frog', emoji: '🐸', hint: 'animal' },
  { word: 'bear', emoji: '🐻', hint: 'animal' },
  { word: 'duck', emoji: '🦆', hint: 'animal' },
  { word: 'cow', emoji: '🐮', hint: 'animal' },
  { word: 'pig', emoji: '🐷', hint: 'animal' },
  { word: 'red', emoji: '🔴', hint: 'color' },
  { word: 'blue', emoji: '🔵', hint: 'color' },
  { word: 'sun', emoji: '☀️', hint: 'nature' },
  { word: 'moon', emoji: '🌙', hint: 'nature' },
  { word: 'tree', emoji: '🌳', hint: 'nature' },
  { word: 'star', emoji: '⭐', hint: 'nature' },
];

const WordSpell: React.FC = () => {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'correct' | 'wrong'; message: string }>({
    show: false,
    type: 'correct',
    message: ''
  });
  const [shake, setShake] = useState(false);

  const currentWord = SPELL_WORDS[currentWordIndex];

  useEffect(() => {
    // Game initialized
  }, []);

  const handleSubmit = () => {
    if (userInput.toLowerCase() === currentWord.word) {
      soundEffects.playCorrect();
      setScore(score + 10);
      setToast({ show: true, type: 'correct', message: `✨ Correct! "${currentWord.word}"` });
      setTimeout(() => {
        setUserInput('');
        setToast({ show: false, type: 'correct', message: '' });
        if (currentWordIndex < SPELL_WORDS.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
        } else {
          setToast({ show: true, type: 'success', message: `🎉 You finished! Score: ${score + 10}` });
        }
      }, 1500);
    } else {
      soundEffects.playWrong();
      setShake(true);
      setToast({ show: true, type: 'wrong', message: 'Try again!' });
      setTimeout(() => {
        setShake(false);
        setToast({ show: false, type: 'wrong', message: '' });
      }, 1000);
    }
  };

  return (
    <div className="word-spell-container">
      <div className="word-spell-header">
        <AnimatedButton onClick={() => router.push('/english')} variant="secondary">
          ← Back
        </AnimatedButton>
        <div className="score">⭐ Score: {score}</div>
      </div>

      <h1 className="word-spell-title">Spell the Word!</h1>

      <div className={`word-spell-card ${shake ? 'shake' : ''}`}>
        <div className="emoji-display">{currentWord.emoji}</div>
        <div className="hint-text">({currentWord.hint})</div>
        
        <input
          type="text"
          className="spell-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type the word..."
          autoFocus
        />

        <AnimatedButton onClick={handleSubmit} disabled={!userInput}>
          Check ✓
        </AnimatedButton>

        <div className="progress-text">
          Word {currentWordIndex + 1} of {SPELL_WORDS.length}
        </div>
      </div>

      {toast.show && <Toast show={toast.show} type={toast.type} message={toast.message} />}
    </div>
  );
};

export default WordSpell;
