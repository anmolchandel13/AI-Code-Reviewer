import { useEffect, useRef, useState } from "react";

/**
 * ScoreRing — Animated circular SVG progress ring.
 * Displays a quality score from 1-10 with color-coded fill.
 *
 * @param {{ score: number, size?: number, strokeWidth?: number, label?: string }} props
 */
export default function ScoreRing({ score, size = 140, strokeWidth = 10, label = "Quality Score" }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 10) * circumference;

  // Score-based color
  const getColor = (s) => {
    if (s <= 3) return { ring: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" };        // Red
    if (s <= 5) return { ring: "#f97316", glow: "rgba(249, 115, 22, 0.3)" };       // Orange
    if (s <= 7) return { ring: "#eab308", glow: "rgba(234, 179, 8, 0.3)" };        // Yellow
    if (s <= 9) return { ring: "#22c55e", glow: "rgba(34, 197, 94, 0.3)" };        // Green
    return { ring: "#10b981", glow: "rgba(16, 185, 129, 0.3)" };                    // Emerald
  };

  const color = getColor(score);

  useEffect(() => {
    let start = null;
    const duration = 1200;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const ratio = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - ratio, 3);

      setProgress(eased * score);
      setAnimatedScore(Math.round(eased * score * 10) / 10);

      if (ratio < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40 transition-all duration-1000"
          style={{ backgroundColor: color.glow }}
        />

        <svg width={size} height={size} className="relative -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-800"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.ring}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke 0.5s ease",
              filter: `drop-shadow(0 0 6px ${color.glow})`,
            }}
          />
        </svg>

        {/* Score number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums animate-count-up"
            style={{ color: color.ring }}
          >
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            / 10
          </span>
        </div>
      </div>

      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}
