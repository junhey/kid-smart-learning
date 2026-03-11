"use client";

import { useState, useCallback } from "react";
import { getSoundManager, playCorrect, playWrong, playClick } from "@/lib/sounds";

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSound() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.8;
    utterance.pitch = options?.pitch ?? 1.2;
    utterance.volume = options?.volume ?? 1;
    utterance.lang = "en-US";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakLetter = useCallback(
    (letter: string) => speak(letter, { rate: 0.7, pitch: 1.3 }),
    [speak]
  );

  const speakWord = useCallback(
    (word: string) => speak(word, { rate: 0.7, pitch: 1.2 }),
    [speak]
  );

  const speakNumber = useCallback(
    (num: number) => speak(num.toString(), { rate: 0.8, pitch: 1.1 }),
    [speak]
  );

  const speakSentence = useCallback(
    (sentence: string) => speak(sentence, { rate: 0.7, pitch: 1.0 }),
    [speak]
  );

  const playCorrectSound = useCallback(() => {
    playCorrect();
  }, []);

  const playWrongSound = useCallback(() => {
    playWrong();
  }, []);

  const playClickSound = useCallback(() => {
    playClick();
  }, []);

  const playSuccessSound = useCallback(() => {
    const soundManager = getSoundManager();
    soundManager.play('success');
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    speakLetter,
    speakWord,
    speakNumber,
    speakSentence,
    playCorrectSound,
    playWrongSound,
    playClickSound,
    playSuccessSound,
    cancel,
    isSpeaking,
  };
}
