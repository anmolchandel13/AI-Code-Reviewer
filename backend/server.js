// ===================================
// AI Code Reviewer - Backend Server
// ===================================
// This Express server receives code from the frontend,
// sends it to Google Gemini for analysis, and returns
// structured review results.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json({ limit: "1mb" })); // Parse JSON bodies up to 1MB

// ---- Initialize Gemini AI ----
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
  console.warn(
    "\n⚠️  WARNING: GEMINI_API_KEY is not set or is still the placeholder value."
  );
  console.warn(
    "   Get your free key at: https://aistudio.google.com/apikey"
  );
  console.warn("   Then add it to backend/.env\n");
}

// ---- Health Check Endpoint ----
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Code Reviewer API is running",
    hasApiKey: !!GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here",
  });
});

// ---- Main Code Analysis Endpoint ----
app.post("/api/analyze", async (req, res) => {
  try {
    const { code, language } = req.body;

    // --- Input Validation ---
    if (!code || code.trim().length === 0) {
      return res.status(400).json({
        error: "Code is required. Please paste some code to analyze.",
      });
    }

    if (!language) {
      return res.status(400).json({
        error: "Programming language is required. Please select a language.",
      });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
      return res.status(500).json({
        error:
          "Gemini API key is not configured. Please add your API key to the .env file.",
      });
    }

    // Limit code length to prevent abuse (roughly ~50KB)
    if (code.length > 50000) {
      return res.status(400).json({
        error:
          "Code is too long. Please limit your input to under 50,000 characters.",
      });
    }

    console.log(
      `📝 Analyzing ${language} code (${code.length} chars)...`
    );

    // --- Call Gemini API ---
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Craft a detailed prompt to get structured JSON output
    const prompt = `You are an expert senior software engineer performing a thorough code review.
Analyze the following ${language} code and return your review as a **valid JSON object** (no markdown fences, no extra text outside the JSON).

The JSON must have exactly this structure:
{
  "bugs": [
    {
      "line": <line number or null if not applicable>,
      "severity": "<critical|warning|info>",
      "description": "<clear description of the bug or issue>"
    }
  ],
  "qualityScore": <number from 1 to 10>,
  "scoreBreakdown": {
    "readability": <1-10>,
    "efficiency": <1-10>,
    "bestPractices": <1-10>,
    "errorHandling": <1-10>,
    "maintainability": <1-10>
  },
  "suggestions": [
    "<specific, actionable improvement suggestion>"
  ],
  "improvedCode": "<the complete refactored/improved version of the code>",
  "summary": "<a brief 2-3 sentence overall summary of the code quality>"
}

Rules:
- "bugs" should list ALL bugs, potential issues, anti-patterns, and code smells you find. If the code is clean, return an empty array.
- "qualityScore" is an overall score from 1 (terrible) to 10 (excellent).
- "scoreBreakdown" rates the code across 5 dimensions.
- "suggestions" should contain 3 to 5 specific, actionable suggestions for improvement.
- "improvedCode" should be a cleaner, refactored version of the code with your suggestions applied. Preserve the original functionality.
- "summary" gives a brief overall assessment.
- Return ONLY the JSON object. No markdown code fences, no explanations outside JSON.

Here is the ${language} code to review:

${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // --- Parse the AI response ---
    // Sometimes Gemini wraps output in markdown code fences, so we strip them
    text = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response as JSON:");
      console.error("Raw response:", text.substring(0, 500));
      return res.status(500).json({
        error:
          "The AI returned an unexpected format. Please try again.",
        rawResponse: text.substring(0, 1000),
      });
    }

    // --- Validate and sanitize the response structure ---
    const sanitizedAnalysis = {
      bugs: Array.isArray(analysis.bugs) ? analysis.bugs : [],
      qualityScore:
        typeof analysis.qualityScore === "number"
          ? Math.min(10, Math.max(1, analysis.qualityScore))
          : 5,
      scoreBreakdown: analysis.scoreBreakdown || {
        readability: 5,
        efficiency: 5,
        bestPractices: 5,
        errorHandling: 5,
        maintainability: 5,
      },
      suggestions: Array.isArray(analysis.suggestions)
        ? analysis.suggestions
        : ["No suggestions available."],
      improvedCode:
        typeof analysis.improvedCode === "string"
          ? analysis.improvedCode
          : "// No improved code generated",
      summary:
        typeof analysis.summary === "string"
          ? analysis.summary
          : "Analysis complete.",
    };

    console.log(
      `✅ Analysis complete. Score: ${sanitizedAnalysis.qualityScore}/10, Bugs found: ${sanitizedAnalysis.bugs.length}`
    );

    res.json(sanitizedAnalysis);
  } catch (error) {
    console.error("❌ Error during analysis:", error.message);

    // Handle specific Gemini API errors
    if (error.message?.includes("API_KEY_INVALID")) {
      return res.status(401).json({
        error:
          "Invalid Gemini API key. Please check your API key in the .env file.",
      });
    }

    if (error.message?.includes("QUOTA_EXCEEDED") || error.message?.includes("429")) {
      return res.status(429).json({
        error:
          "API rate limit reached. Please wait a moment and try again.",
      });
    }

    res.status(500).json({
      error: "An unexpected error occurred during code analysis. Please try again.",
    });
  }
});

// ---- Start the Server ----
app.listen(PORT, () => {
  console.log(`\n🚀 AI Code Reviewer API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `   API Key configured: ${
      !!GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here"
        ? "✅ Yes"
        : "❌ No — add it to .env"
    }\n`
  );
});
