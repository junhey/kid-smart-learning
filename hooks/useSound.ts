"use client";

import { useState, useCallback } from "react";

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

function playTone(freq1: number, freq2: number, duration: number, gainVal: number) {
  try {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq1, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + duration);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context not available
  }
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
    playTone(440, 880, 0.3, 0.3);
  }, []);

  const playWrongSound = useCallback(() => {
    playTone(300, 200, 0.3, 0.3);
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
    cancel,
    isSpeaking,
  };
}
