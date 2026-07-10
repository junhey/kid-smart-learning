"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  shape: "circle" | "star" | "diamond" | "hexagon";
  rotation: number;
  rotationSpeed: number;
  pulse: number;
  pulseSpeed: number;
}

interface DynamicBackgroundProps {
  theme?: "default" | "math" | "english" | "celebration";
  density?: "low" | "medium" | "high";
  className?: string;
}

const themeColors: Record<string, string[]> = {
  default: [
    "#FF6B9D", "#C44DFF", "#4DC9F6", "#FFB84D",
    "#81C784", "#FF8A65", "#9575CD", "#4DD0E1",
  ],
  math: [
    "#FF6B35", "#FF8C42", "#FFB84D", "#FFD166",
    "#FF5722", "#FF9800", "#FFC107", "#FFAB40",
  ],
  english: [
    "#4DC9F6", "#1CB0F6", "#42A5F5", "#64B5F6",
    "#2979FF", "#448AFF", "#82B1FF", "#40C4FF",
  ],
  celebration: [
    "#FFD700", "#FF6B9D", "#00E676", "#FF4081",
    "#69F0AE", "#FFAB40", "#7C4DFF", "#40C4FF",
  ],
};

export default function DynamicBackground({
  theme = "default",
  density = "medium",
  className = "",
}: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const particleCount = {
    low: 15,
    medium: 30,
    high: 50,
  }[density];

  const initParticles = useCallback(
    (width: number, height: number) => {
      const colors = themeColors[theme];
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const shapes: Particle["shape"][] = [
          "circle",
          "star",
          "diamond",
          "hexagon",
        ];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.2,
          size: Math.random() * 14 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.25 + 0.08,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.005,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
      particlesRef.current = particles;
    },
    [theme, particleCount]
  );

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rotation: number
  ) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes + rotation;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  const drawDiamond = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.restore();
  };

  const drawHexagon = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    });

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.pulse += p.pulseSpeed;

        // Wrap around edges
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        // Mouse interaction: slight attraction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += (dx / dist) * 0.02;
          p.vy += (dy / dist) * 0.02;
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        // Clamp velocity
        p.vx = Math.max(-1, Math.min(1, p.vx));
        p.vy = Math.max(-1, Math.min(1, p.vy));

        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;
        const currentSize = p.size * pulseScale;
        const alpha = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

        ctx.save();
        ctx.globalAlpha = alpha;

        // Draw connection lines to nearby particles
        for (let j = 0; j < particles.length; j++) {
          if (j <= (particles.indexOf(p) + 5) % particles.length) continue;
          const other = particles[j];
          const ldx = p.x - other.x;
          const ldy = p.y - other.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = alpha * 0.15 * (1 - ldist / 100);
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = alpha;
          }
        }

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        switch (p.shape) {
          case "star":
            drawStar(ctx, p.x, p.y, currentSize, p.rotation);
            ctx.fill();
            break;
          case "diamond":
            drawDiamond(ctx, p.x, p.y, currentSize, p.rotation);
            ctx.fill();
            break;
          case "hexagon":
            drawHexagon(ctx, p.x, p.y, currentSize, p.rotation);
            ctx.stroke();
            break;
          default:
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
      }

      // Draw subtle gradient overlay for depth
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      );

      const themeGradients: Record<string, [string, string]> = {
        default: ["rgba(255,255,255,0.03)", "rgba(200,180,255,0.06)"],
        math: ["rgba(255,255,255,0.03)", "rgba(255,180,100,0.06)"],
        english: ["rgba(255,255,255,0.03)", "rgba(100,200,255,0.06)"],
        celebration: ["rgba(255,255,255,0.05)", "rgba(255,215,0,0.08)"],
      };

      const [gStart, gEnd] = themeGradients[theme] || themeGradients.default;
      gradient.addColorStop(0, gStart);
      gradient.addColorStop(1, gEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme, particleCount, initParticles, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
