import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './HowItWorksPage.module.css';

const steps = [
  {
    num: "01",
    label: "STEP 01 — DATA COLLECTION",
    title: "We Infiltrate Your Repo",
    desc: "RepoXray calls the GitHub API to fetch everything it needs to judge you. Repo metadata, your README (or lack of one), the full file tree, language breakdown, and the source files most likely to contain your sins. We cap ourselves at 4 API calls so GitHub doesn't hate us.",
    pills: ["GitHub REST API", "raw.githubusercontent.com", "4 calls max", "No auth needed"]
  },
  {
    num: "02",
    label: "STEP 02 — AI ANALYSIS",
    title: "Gemini Reads Your Crimes",
    desc: "All collected data is fed to Google's Gemini 2.5 Flash model with a carefully engineered prompt that instructs it to think like a brutally honest senior engineer with 20 years of experience and zero patience for bad practices. The AI evaluates README quality, code structure, dependencies, and developer experience.",
    pills: ["Gemini 2.5 Flash", "Your API Key", "Free Tier", "1 API Call"]
  },
  {
    num: "03",
    label: "STEP 03 — STRUCTURED SCORING",
    title: "The Verdict Is Calculated",
    desc: "Gemini returns a structured JSON response with an overall score from 0 to 100, individual letter grades across 5 categories, 5 specific roast points referencing actual files in your repo, 2 genuine compliments (if deserved), and one final verdict sentence that summarizes your architectural choices in the harshest possible terms.",
    pills: ["5 Grade Categories", "0-100 Score", "File-Specific Roasts", "JSON Output"]
  },
  {
    num: "04",
    label: "STEP 04 — RESULTS",
    title: "Face Your Code's Consequences",
    desc: "Results appear in a shareable report with your overall score, category grades, specific roast cards pointing to real files, and a quotable verdict. Share it on Twitter to warn other developers. Or keep it private and cry quietly while refactoring.",
    pills: ["Shareable Report", "Twitter Share", "Copy to Clipboard", "No data stored"]
  }
];

const faqs = [
  {
    q: "Is my code stored anywhere?",
    a: "No. RepoXray never stores your code. The GitHub data is fetched client-side, sent to Gemini via your own API key, and discarded after the analysis. We never see your code."
  },
  {
    q: "Do I need a GitHub account?",
    a: "No. RepoXray only reads public repositories using the unauthenticated GitHub API. No login, no OAuth, no account required."
  },
  {
    q: "Why do I need a Gemini API key?",
    a: "To keep RepoXray free, AI calls go through your personal Gemini key. Google's free tier gives you 1,500 requests per day at no cost. Get yours at aistudio.google.com in under 2 minutes."
  },
  {
    q: "What repos work best?",
    a: "Public repos between 10KB and 50MB with JavaScript, TypeScript, Python, Go, Rust, or Java as the primary language. Very large repos (500MB+) may return partial analysis due to API limits."
  },
  {
    q: "Is the roast actually useful or just mean?",
    a: "Both. Every roast references a specific file or pattern found in your actual repo. The goal is brutal honesty with surgical precision — not random insults. Most developers who use RepoXray come back to check if their score improved after refactoring."
  }
];

const HowItWorksPage = () => {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <section className={styles.hero}>
        <h1 className={`${styles.title} gradient-text`}>HOW REPOXRAY WORKS</h1>
        <p className={styles.subtitle}>Four steps from repo URL to brutal truth</p>
      </section>

      <section className={styles.stepsSection}>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepCard}>
            <div className={styles.stepNumber}>{step.num}</div>
            <div className={styles.stepContent}>
              <span className={styles.stepLabel}>{step.label}</span>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepDescription}>{step.desc}</p>
              <div className={styles.pills}>
                {step.pills.map((pill, pIdx) => (
                  <span key={pIdx} className={styles.pill}>{pill}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.faqHeader}>FREQUENTLY ASKED QUESTIONS</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Q: {faq.q}</h3>
              <p className={styles.faqAnswer}>A: {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>READY TO GET ROASTED?</h2>
        <Link to="/" className={styles.ctaBtn}>ANALYZE MY REPO 🔥</Link>
      </section>
    </motion.div>
  );
};

export default HowItWorksPage;
