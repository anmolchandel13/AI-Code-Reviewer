import { useState } from "react";
import ScoreRing from "./ScoreRing";

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "bugs", label: "Bugs", icon: "🐛" },
  { id: "suggestions", label: "Suggestions", icon: "💡" },
  { id: "improved", label: "Improved Code", icon: "✨" },
];

/**
 * ResultsPanel — Displays code analysis results in a tabbed interface.
 *
 * @param {{ results: object }} props
 */
export default function ResultsPanel({ results }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  if (!results) return null;

  const {
    bugs = [],
    qualityScore = 5,
    scoreBreakdown = {},
    suggestions = [],
    improvedCode = "",
    summary = "",
  } = results;

  const bugCounts = {
    critical: bugs.filter((b) => b.severity === "critical").length,
    warning: bugs.filter((b) => b.severity === "warning").length,
    info: bugs.filter((b) => b.severity === "info").length,
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(improvedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail
    }
  };

  return (
    <div className="glass-panel overflow-hidden animate-slide-up">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200/50 dark:border-gray-700/40 px-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id ? "tab-btn-active" : ""
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === "bugs" && bugs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/15 text-red-400">
                {bugs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 sm:p-6">
        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="animate-fade-in space-y-6">
            {/* Score + Summary row */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={qualityScore} />

              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {summary}
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                  {bugCounts.critical > 0 && (
                    <span className="badge-critical">
                      🔴 {bugCounts.critical} Critical
                    </span>
                  )}
                  {bugCounts.warning > 0 && (
                    <span className="badge-warning">
                      🟡 {bugCounts.warning} Warnings
                    </span>
                  )}
                  {bugCounts.info > 0 && (
                    <span className="badge-info">
                      🔵 {bugCounts.info} Info
                    </span>
                  )}
                  {bugs.length === 0 && (
                    <span className="badge-info">✅ No issues found</span>
                  )}
                </div>
              </div>
            </div>

            {/* Score breakdown bars */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Score Breakdown
              </h3>
              <div className="stagger-children space-y-2.5">
                {Object.entries(scoreBreakdown).map(([key, value]) => (
                  <ScoreBar key={key} label={formatKey(key)} score={value} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Bugs Tab ── */}
        {activeTab === "bugs" && (
          <div className="animate-fade-in">
            {bugs.length === 0 ? (
              <EmptyState
                icon="🎉"
                title="No bugs found!"
                description="Your code looks clean. Great job!"
              />
            ) : (
              <div className="stagger-children space-y-3">
                {bugs.map((bug, index) => (
                  <BugCard key={index} bug={bug} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Suggestions Tab ── */}
        {activeTab === "suggestions" && (
          <div className="animate-fade-in">
            {suggestions.length === 0 ? (
              <EmptyState
                icon="👏"
                title="No suggestions"
                description="Your code follows best practices."
              />
            ) : (
              <div className="stagger-children space-y-3">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    suggestion={suggestion}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Improved Code Tab ── */}
        {activeTab === "improved" && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Refactored Code
              </h3>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                           text-gray-500 dark:text-gray-400
                           hover:text-brand-600 dark:hover:text-brand-400
                           hover:bg-brand-50 dark:hover:bg-brand-950/30
                           rounded-lg transition-all duration-200"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <pre className="improved-code-block max-h-[500px] overflow-auto">
              <code>{improvedCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────── */

function ScoreBar({ label, score }) {
  const percentage = (score / 10) * 100;
  const getBarColor = (s) => {
    if (s <= 3) return "from-red-500 to-red-400";
    if (s <= 5) return "from-orange-500 to-amber-400";
    if (s <= 7) return "from-yellow-500 to-yellow-400";
    return "from-green-500 to-emerald-400";
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(score)} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-xs font-bold text-gray-600 dark:text-gray-300 text-right tabular-nums">
        {score}
      </span>
    </div>
  );
}

function BugCard({ bug, index }) {
  const severityConfig = {
    critical: {
      badge: "badge-critical",
      icon: "🔴",
      bg: "bg-red-500/5 border-red-500/10",
    },
    warning: {
      badge: "badge-warning",
      icon: "🟡",
      bg: "bg-amber-500/5 border-amber-500/10",
    },
    info: {
      badge: "badge-info",
      icon: "🔵",
      bg: "bg-blue-500/5 border-blue-500/10",
    },
  };

  const config = severityConfig[bug.severity] || severityConfig.info;

  return (
    <div
      className={`p-4 rounded-xl border ${config.bg} transition-all duration-200 hover:scale-[1.01]`}
    >
      <div className="flex flex-wrap items-start gap-2">
        <span className={config.badge}>
          {config.icon} {bug.severity}
        </span>
        {bug.line && (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-gray-200/60 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400">
            Line {bug.line}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {bug.description}
      </p>
    </div>
  );
}

function SuggestionCard({ suggestion, index }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10 transition-all duration-200 hover:scale-[1.01]">
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 text-brand-500 text-xs font-bold shrink-0">
        {index + 1}
      </span>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">
        {suggestion}
      </p>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-5xl mb-4 animate-float">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  );
}

/* ─── Helpers ─────────────────────────── */

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
