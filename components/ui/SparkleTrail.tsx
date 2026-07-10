"use client";

import { useEffect, useRef } from "react";

interface SparkleTrailProps {
  className?: string;
}

export default function SparkleTrail({ className = "" }: SparkleTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle-particle";
      sparkle.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(200,200,255,0));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: sparkle-fade 0.8s ease-out forwards;
      `;
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 800);
    };

    // Throttle for performance
    let ticking = false;
    const throttledMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", throttledMove);
    return () => window.removeEventListener("mousemove", throttledMove);
  }, []);

  return (
    <div ref={containerRef} className={`fixed inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <style jsx global>{`
        @keyframes sparkle-fade {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
