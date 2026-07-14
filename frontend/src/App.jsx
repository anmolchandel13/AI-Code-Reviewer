import { useState, useEffect } from "react";
import Header from "./components/Header";
import CodeInput from "./components/CodeInput";
import ResultsPanel from "./components/ResultsPanel";
import LoadingState from "./components/LoadingState";

/**
 * App — Main application shell.
 * Orchestrates code input → API call → results display.
 */
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleAnalyze = async (code, language) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`);
      }

      setResults(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure the backend is running on port 5000."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-pink-500/8 dark:bg-pink-500/3 blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column — Code Input */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {/* Right column — Results */}
          <div>
            {/* Error state */}
            {error && (
              <div className="glass-panel p-5 animate-fade-in border-red-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">⚠️</span>
                  <div>
                    <h3 className="text-sm font-semibold text-red-500 dark:text-red-400">
                      Analysis Failed
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {error}
                    </p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-3 text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && <LoadingState />}

            {/* Results */}
            {results && !isLoading && <ResultsPanel results={results} />}

            {/* Empty state — shown when nothing is happening */}
            {!results && !isLoading && !error && (
              <div className="glass-panel p-8 sm:p-12 animate-fade-in">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mb-5 animate-float">
                    <svg
                      className="w-10 h-10 text-brand-500 dark:text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Ready to Review
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                    Paste your code on the left, select the language, and hit{" "}
                    <span className="font-semibold text-brand-500">
                      Analyze Code
                    </span>{" "}
                    to get an AI-powered review in seconds.
                  </p>

                  <div className="flex items-center gap-6 mt-6 text-xs text-gray-400 dark:text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span>🐛</span>
                      <span>Bug Detection</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📊</span>
                      <span>Quality Scoring</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Auto-Refactor</span>
                    </div>
                  </div>

                  <div className="mt-6 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-xs text-gray-400 dark:text-gray-500 font-mono">
                    Ctrl + Enter to analyze
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600">
        Built with React + Gemini AI &nbsp;•&nbsp; AI Code Reviewer
      </footer>
    </div>
  );
}
