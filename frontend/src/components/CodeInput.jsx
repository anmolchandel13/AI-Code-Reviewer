import { useState } from "react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "typescript", label: "TypeScript", icon: "🔷" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "csharp", label: "C#", icon: "🟣" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "c", label: "C", icon: "🔧" },
  { value: "go", label: "Go", icon: "🐹" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "ruby", label: "Ruby", icon: "💎" },
  { value: "php", label: "PHP", icon: "🐘" },
  { value: "swift", label: "Swift", icon: "🐦" },
  { value: "kotlin", label: "Kotlin", icon: "🟪" },
  { value: "html", label: "HTML/CSS", icon: "🌐" },
  { value: "sql", label: "SQL", icon: "🗃️" },
  { value: "shell", label: "Shell/Bash", icon: "🖥️" },
];

const EXAMPLE_CODE = `function fibonacci(n) {
  if (n <= 0) return 0;
  if (n == 1) return 1;
  
  var result = [];
  result[0] = 0;
  result[1] = 1;
  
  for (var i = 2; i <= n; i++) {
    result[i] = result[i-1] + result[i-2];
  }
  
  return result[n];
}

// Usage
console.log(fibonacci(10))
console.log(fibonacci(-1))
console.log(fibonacci("hello"))`;

/**
 * CodeInput — Code editor panel with language selector and action buttons.
 *
 * @param {{ onAnalyze: (code: string, language: string) => void, isLoading: boolean }} props
 */
export default function CodeInput({ onAnalyze, isLoading }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isFocused, setIsFocused] = useState(false);

  const charCount = code.length;
  const lineCount = code ? code.split("\n").length : 0;

  const handleSubmit = () => {
    if (code.trim() && !isLoading) {
      onAnalyze(code, language);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch {
      // Clipboard API may fail, ignore
    }
  };

  const handleLoadExample = () => {
    setCode(EXAMPLE_CODE);
    setLanguage("javascript");
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }

    // Tab key inserts 2 spaces instead of moving focus
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      // Move cursor after the inserted spaces
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="glass-panel overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200/50 dark:border-gray-700/40">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="language-select"
            className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
          >
            Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 text-sm font-medium
                       bg-gray-100 dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       rounded-lg
                       text-gray-700 dark:text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-brand-500/50
                       transition-all duration-200 cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadExample}
            className="px-3 py-1.5 text-xs font-medium
                       text-gray-500 dark:text-gray-400
                       hover:text-brand-600 dark:hover:text-brand-400
                       hover:bg-brand-50 dark:hover:bg-brand-950/30
                       rounded-lg transition-all duration-200"
            title="Load example code"
          >
            📋 Example
          </button>
          <button
            onClick={handlePaste}
            className="px-3 py-1.5 text-xs font-medium
                       text-gray-500 dark:text-gray-400
                       hover:text-brand-600 dark:hover:text-brand-400
                       hover:bg-brand-50 dark:hover:bg-brand-950/30
                       rounded-lg transition-all duration-200"
            title="Paste from clipboard"
          >
            📎 Paste
          </button>
          {code && (
            <button
              onClick={() => setCode("")}
              className="px-3 py-1.5 text-xs font-medium
                         text-gray-500 dark:text-gray-400
                         hover:text-red-500 dark:hover:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-950/30
                         rounded-lg transition-all duration-200"
              title="Clear code"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Code editor area */}
      <div className="relative">
        {/* Focus glow border */}
        <div
          className={`absolute inset-0 rounded-none transition-opacity duration-300 pointer-events-none ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
          style={{
            boxShadow: "inset 0 0 0 1px rgba(99, 102, 241, 0.3)",
          }}
        />

        <textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={`// Paste your ${LANGUAGES.find((l) => l.value === language)?.label || ""} code here...\n// Press Ctrl+Enter to analyze\n\nfunction example() {\n  // Your code goes here\n}`}
          className="code-editor !rounded-none !border-0 !min-h-[350px] lg:!min-h-[450px]"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      {/* Footer bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-200/50 dark:border-gray-700/40">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
          <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
          <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
          <span>{charCount.toLocaleString()} chars</span>
          {charCount > 40000 && (
            <>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
              <span className="text-amber-500">⚠ Near limit (50k)</span>
            </>
          )}
        </div>

        {/* Analyze button */}
        <button
          id="analyze-button"
          onClick={handleSubmit}
          disabled={!code.trim() || isLoading}
          className="btn-glow flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Analyze Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}
