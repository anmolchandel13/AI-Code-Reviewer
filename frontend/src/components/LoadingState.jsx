import { useState, useEffect } from "react";

const MESSAGES = [
  { icon: "🔍", text: "Scanning for bugs and issues..." },
  { icon: "📐", text: "Evaluating code architecture..." },
  { icon: "⚡", text: "Checking performance patterns..." },
  { icon: "🛡️", text: "Analyzing error handling..." },
  { icon: "✨", text: "Generating improvement suggestions..." },
  { icon: "🔧", text: "Crafting improved code..." },
];

/**
 * LoadingState — Displays animated loading indicators while the API is processing.
 */
export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-8 animate-fade-in">
      {/* Shimmer skeleton blocks */}
      <div className="space-y-6">
        {/* Fake score ring skeleton */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-[10px] border-gray-200 dark:border-gray-800 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Animated message */}
          <div className="flex items-center gap-3 mt-2" key={messageIndex}>
            <span className="text-2xl animate-bounce-soft">
              {MESSAGES[messageIndex].icon}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-fade-in">
              {MESSAGES[messageIndex].text}
            </span>
          </div>
        </div>

        {/* Skeleton bars */}
        <div className="space-y-3 mt-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer"
                style={{
                  width: `${60 + Math.random() * 30}%`,
                  backgroundSize: "200% 100%",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-1.5 pt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-500 animate-bounce-soft"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
