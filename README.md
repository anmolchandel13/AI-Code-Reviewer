# 🔍 AI Code Reviewer

An interactive, premium-grade web application that leverages **Google Gemini (3.5 Flash)** to analyze source code, detect bugs/vulnerabilities, grade code quality, provide actionable optimization recommendations, and generate a refactored code output. 

Designed with a sleek **dark-first glassmorphism user interface** built using **React 19** and **Tailwind CSS v3**, backed by a fast **Express.js** server.

---

## ✨ Features

- **Multi-Language Support**: Choose from 16+ programming languages (JavaScript, Python, Java, Go, Rust, C++, C#, HTML/CSS, SQL, Bash, etc.).
- **Interactive Monospace Editor**: Support for standard editor ergonomics (Tab indentation, character & line count, quick example loading, clipboard pasting, and `Ctrl + Enter` analysis shortcut).
- **Interactive Quality Scoring**: Circular animated quality score metric indicator dynamically colored based on code grade.
- **Detailed Score Breakdown**: Individual grades for *Readability, Efficiency, Best Practices, Error Handling, and Maintainability*.
- **Bug Finder Dashboard**: Structured listing of issues categorized by severity (Critical 🔴, Warning 🟡, Info 🔵) with corresponding line numbers.
- **Actionable Suggestions**: Clear, descriptive recommendations on code structure, optimization, and standards compliance.
- **Refactored Code Generator**: Automatically generates cleaner, refactored code with one-click clipboard copying.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** (Single Page App)
- **Vite** (Build Tool)
- **Tailwind CSS v3** (Aesthetics & Animations)
- **PostCSS / Autoprefixer**

### Backend
- **Express.js** / **Node.js**
- **Google Gen AI SDK** (`@google/generative-ai`)
- **CORS** & **Dotenv**

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine. You can verify with:
```bash
node -v
npm -v
```

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ai-code-reviewer.git
   cd ai-code-reviewer
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory (using `.env.example` as a template):
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     PORT=5000
     ```
     *(Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey))*

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

---

### Running the Application

You need to run both the backend and frontend development servers.

#### Start Backend
```bash
cd backend
npm run dev
```
The backend server will run at `http://localhost:5000`.

#### Start Frontend
```bash
cd frontend
npm run dev
```
The frontend application will compile and open at `http://localhost:3000`.

---

## 📁 Project Structure

```text
├── backend/
│   ├── .env.example       # Example environment variables template
│   ├── .gitignore         # Backend Git ignores (.env, node_modules)
│   ├── package.json       # Backend configuration & script definitions
│   └── server.js          # Express app configured with Gemini API
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (ScoreRing, CodeInput, etc.)
│   │   ├── App.jsx        # Main application shell & state orchestration
│   │   ├── index.css      # Core style declarations & tailwind layers
│   │   └── main.jsx       # Entry mounting script
│   ├── index.html         # HTML Document root
│   ├── package.json       # Frontend packages & scripts
│   ├── postcss.config.js  # PostCSS config
│   ├── tailwind.config.js # Tailwind color tokens & animations config
│   └── vite.config.js     # Dev proxy & build pipeline config
└── .gitignore             # Root level Git ignores
```

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
