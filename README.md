# RepoXray 🔬 — AI-Powered Code Infiltration & Roasting

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%20Flash-orange.svg)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RepoXray** is a brutally honest, AI-powered repository analyzer. By combining the GitHub REST API with Google's Gemini 3 Flash model, it performs a surgical "X-ray" scan of your codebase to identify architectural sins, spaghetti logic, and questionable life choices.

> "Your code will be judged. Harshly."

---

## 📸 Screenshots

| 01 — Landing Page |
| :---: |
| <img width="1919" height="910" alt="Screenshot 2026-04-20 133156" src="https://github.com/user-attachments/assets/8c88697b-f72e-493e-92a5-f4e480fd2149" />|

| 02 — Analysis Pipeline  |
| :---: |
| <img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/e8432031-ac6e-4ac0-beb4-7407e44cfcff" />|

| 03 — Score |
| :---: |
| <img width="1919" height="914" alt="Screenshot 2026-04-20 132921" src="https://github.com/user-attachments/assets/62ee48b6-edfa-4b57-b918-df3ad8235f0b" />|

| 04 — The Verdict |
| :---: |
| <img width="1919" height="903" alt="Screenshot 2026-04-20 132946" src="https://github.com/user-attachments/assets/8b419922-7360-4b80-8ad0-6a4754d5e23d" />|

| 05 — Detailed Roasts |
| :---: |
| <img width="1919" height="911" alt="Screenshot 2026-04-20 133002" src="https://github.com/user-attachments/assets/37a3e5c8-0d17-4493-a6ba-4dfa66e7851e" />|

---

## 🚀 Key Features

- **🔬 Deep Scan Architecture**: Infiltrates public GitHub repos to fetch metadata, READMEs, and key source files.
- **🔥 Gemini 2.5 Flash Analysis**: Leverages Google's high-speed AI to deliver surgical roasts with zero mercy.
- **📊 Structured Scoring**: Provides a 0-100 overall score and localized letter grades across 5 critical categories.
- **🎯 File-Specific Roasts**: Don't just get insulted; get told exactly which line of code is causing the problem.
- **🔁 Resilient Pipeline**: Built-in exponential backoff and retry logic for high-traffic API handling.
- **🐦 Share the Pain**: One-click sharing to Twitter/X so your peers can witness your architectural downfall.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS Modules (Glassmorphism & High-Contrast Dark Mode)
- **Animations**: Framer Motion
- **AI Engine**: Google Gemini 2.5 Flash via API
- **Data Source**: GitHub REST API (v3)

---

## ⚙️ Local Setup

### 1. Clone the Repo
```bash
git clone https://github.com/Soumik22-tech/RepoXray.git
cd RepoXray
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Get your Gemini API Key
Head over to [Google AI Studio](https://aistudio.google.com/) and grab a free API key.

### 4. Run Development Server
```bash
npm run dev
```

---

## 🧠 How It Works

RepoXray follows a stateless 4-step pipeline:
1.  **Infiltration**: Uses the GitHub API to crawl your file tree and identify core logic files.
2.  **Context Building**: Packages your code, structure, and metadata into a highly optimized prompt.
3.  **The Sentencing**: Gemini 3 Flash processes the prompt and returns a structured JSON verdict.
4.  **Visualizing Trauma**: React renders the JSON into a beautiful, shareable report.

---

## 📜 Disclaimer

RepoXray is a satirical tool. The generated roasts are intended for comedic purposes and are based on general best practices as interpreted by an AI model. RepoXray does not store your code or API keys. Analysis is performed entirely client-side.

---

## 🤝 Contributing

Contributions are welcome! If you have a better insult or a way to make the scan even more surgical, feel free to open a PR.

**Built with 🔬 by [Soumik Majumder](https://github.com/Soumik22-tech)**



