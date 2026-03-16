"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/hooks/useReward";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import StarReward from "@/components/ui/StarReward";
import ProgressBar from "@/components/ui/ProgressBar";
import GameResult from "@/components/ui/GameResult";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { useToast } from "@/components/ui/Toast";
import shapesData from "@/data/math/shapes.json";
import { shuffleArray } from "@/lib/gameUtils";

interface Shape {
  name: string;
  emoji: string;
  sides: number;
  description: string;
  color: string;
  svgPath: string;
}

const TOTAL_ROUNDS = 10;

function ShapeSVG({ name, color }: { name: string; color: string }) {
  const size = 80;
  const fill = color;
  const stroke = "white";
  const strokeW = 3;

  switch (name) {
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill={fill} stroke={stroke} strokeWidth={strokeW} />
        </svg>
      );
    case "square":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" fill={fill} stroke={stroke} strokeWidth={strokeW} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,5 95,95 5,95" fill={fill} stroke={stroke} strokeWidth={strokeW} />
        </svg>
      );
    case "rectangle":
      return (
        <svg width={size} height={size} viewBox="0 0 100 60">
          <rect x="5" y="5" width="90" height="50" fill={fill} stroke={stroke} strokeWidth={strokeW} />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon
            points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeW}
          />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path
            d="M50,80 C20,55 5,40 5,25 C5,10 20,5 35,10 C42,13 47,18 50,22 C53,18 58,13 65,10 C80,5 95,10 95,25 C95,40 80,55 50,80 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeW}
          />
        </svg>
      );
    case "diamond":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon points="50,5 95,50 50,95 5,50" fill={fill} stroke={stroke} strokeWidth={strokeW} />
        </svg>
      );
    case "pentagon":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <polygon
            points="50,5 97,38 78,93 22,93 3,38"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeW}
          />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill={fill} stroke={stroke} strokeWidth={strokeW} />
        </svg>
      );
  }
}

interface Question {
  target: Shape;
  options: Shape[];
}

function buildQuestion(shapes: Shape[]): Question {
  const target = shapes[Math.floor(Math.random() * shapes.length)];
  const others = shuffleArray(shapes.filter((s) => s.name !== target.name)).slice(0, 3);
  return { target, options: shuffleArray([target, ...others]) };
}

export default function ShapeMatch() {
  const shapes = shapesData as Shape[];
  const [question, setQuestion] = useState<Question>(() => buildQuestion(shapes));
  const [selected, setSelected] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const roundRef = useRef(0);

  const { addStar } = useReward();
  const { speak, playCorrectSound, playWrongSound } = useSound();
  const { correct, total, recordCorrect, recordWrong, reset } = useProgress(TOTAL_ROUNDS);
  const { showCorrect, showWrong, ToastComponent } = useToast();

  const nextQuestion = useCallback(() => {
    setQuestion(buildQuestion(shapes));
    setSelected(null);
    setFeedback(null);
    setShowCelebration(false);
  }, [shapes]);

  const handleSelect = useCallback(
    (shape: Shape) => {
      if (selected) return;
      setSelected(shape.name);

      if (shape.name === question.target.name) {
        playCorrectSound();
        setFeedback("correct");
        setShowReward(true);
        setShowCelebration(true);
        addStar(1);
        recordCorrect();
        speak(`${shape.name}! Correct!`, { rate: 0.9 });
        showCorrect(`Perfect! You found the ${shape.name}!`);
        roundRef.current += 1;
        setTimeout(() => {
          setShowReward(false);
          setShowCelebration(false);
          if (roundRef.current >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            nextQuestion();
          }
        }, 1500);
      } else {
        playWrongSound();
        setFeedback("wrong");
        recordWrong();
        speak(`Try again!`, { rate: 0.9 });
        showWrong(`Not quite! The answer is ${question.target.name}.`);
        setTimeout(() => nextQuestion(), 1200);
      }
    },
    [selected, question, addStar, recordCorrect, recordWrong, speak, playCorrectSound, playWrongSound, nextQuestion, showCorrect, showWrong]
  );

  const handleRestart = useCallback(() => {
    roundRef.current = 0;
    setGameOver(false);
    reset();
    nextQuestion();
  }, [reset, nextQuestion]);

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  if (gameOver) {
    return <GameResult correct={correct} total={total} onRestart={handleRestart} onBack={handleBack} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ToastComponent />
      <StarReward show={showReward} />
      {/* Celebration animation */}
      {showCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-purple-400 border-opacity-50"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.6 }}
              className="text-8xl text-purple-500"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-purple-600 whitespace-nowrap"
            >
              Correct! Great job!
            </motion.div>
          </div>
        </motion.div>
      )}
      <ProgressBar current={total} total={TOTAL_ROUNDS} color="from-purple-400 to-violet-500" />

      <motion.div
        key={question.target.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        {/* Show name, pick shape */}
        <div className="text-center mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl inline-block">
            <p className="text-xl font-bold text-gray-600 mb-2">Find the shape:</p>
            <div className="text-5xl font-black text-purple-600 capitalize">
              {question.target.name}
            </div>
            <p className="text-gray-500 mt-2 text-lg">{question.target.description}</p>
          </div>
        </div>

        {/* Shape options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((shape) => {
            const isCorrect = shape.name === question.target.name;
            const isSelected = selected === shape.name;

            return (
              <AnimatedButton
                key={shape.name}
                variant={
                  feedback === "correct" && isSelected && isCorrect
                    ? "success"
                    : feedback === "wrong" && isSelected && !isCorrect
                    ? "danger"
                    : "ghost"
                }
                size="lg"
                playSound={false}
                onClick={() => handleSelect(shape)}
                disabled={!!selected}
                className={`
                  min-h-[100px] relative
                  ${feedback === "correct" && isSelected && isCorrect ? "scale-110" : ""}
                `}
                animate={
                  feedback === "wrong" && isSelected && !isCorrect
                    ? {
                        x: [0, -5, 5, -5, 5, 0],
                      }
                    : {}
                }
                transition={
                  feedback === "wrong" && isSelected && !isCorrect
                    ? {
                        duration: 0.5,
                        repeat: 0,
                      }
                    : {}
                }
              >
                <ShapeSVG name={shape.name} color={shape.color} />
                {feedback === "correct" && isSelected && isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl text-green-600 font-bold absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg"
                  >
                    ✓
                  </motion.div>
                )}
                {feedback === "wrong" && isSelected && !isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl text-red-600 font-bold absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg"
                  >
                    ✗
                  </motion.div>
                )}
              </AnimatedButton>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
