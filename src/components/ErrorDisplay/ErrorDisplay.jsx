import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ErrorDisplay.module.css';

const ErrorDisplay = ({ error, onRetry }) => {
  const [exhaustCountdown, setExhaustCountdown] = useState(120);

  const getErrorTitle = (msgStr) => {
    if (msgStr.includes('exhausted')) return "Rate Limit Exhausted";
    if (msgStr.includes('Your Gemini API key is invalid')) return "Bad API Key";
    if (msgStr.includes('does not have permission')) return "Key Has No Access";
    if (msgStr.includes('rate limit hit')) return "Slow Down, Cowboy"; 
    if (msgStr.includes('GitHub repo not found')) return "Repo Not Found";
    if (msgStr.includes('private')) return "That Repo Is Hiding";
    if (msgStr.includes('malformed') || msgStr.includes('extract')) return "AI Had a Brain Fart";
    if (msgStr.includes('moment')) return "Gemini Is Down";
    if (msgStr.includes('slow with large') || msgStr.includes('TIMEOUT')) return "Request Timed Out";
    if (msgStr.includes('internet')) return "No Internet";
    return "Something Broke";
  };

  const getHelpTips = (title) => {
    switch (title) {
      case "Bad API Key":
      case "Key Has No Access":
        return [
          "Visit aistudio.google.com to check your key",
          "Make sure you copied the full key starting with AIza"
        ];
      case "Slow Down, Cowboy":
        return [
          "Free tier allows 15 requests per minute",
          "Wait 60 seconds and try again"
        ];
      case "That Repo Is Hiding":
        return [
          "Only public GitHub repos can be roasted",
          "Check the repo visibility in GitHub Settings"
        ];
      case "Repo Not Found":
        return [
          "Double-check the URL format: github.com/owner/repo",
          "Make sure the repo has not been deleted"
        ];
      case "Rate Limit Exhausted":
        return [
          "Wait 2-3 minutes before trying again",
          "Free tier resets every 60 seconds (15 req/min)",
          "Consider testing with a smaller repo first"
        ];
      case "Request Timed Out":
        return [
          "Gemini can be slow with large repos",
          "Try again — it usually works on retry"
        ];
      case "No Internet":
        return [
          "Check your internet connection",
          "Disable VPN if you are using one"
        ];
      default:
        return [
          "Double-check your inputs and try again",
          "If this persists, report an issue on GitHub"
        ];
    }
  };

  const title = getErrorTitle(error?.message || '');
  const tips = getHelpTips(title);

  useEffect(() => {
    if (title === "Rate Limit Exhausted") {
      const intv = setInterval(() => {
        setExhaustCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intv);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intv);
    }
  }, [title]);

  return (
    <motion.div 
      className={styles.container}
      role="alert" 
      aria-live="assertive"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <motion.svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={styles.icon}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </motion.svg>

      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{error?.message || "An unknown error occurred"}</p>
      
      <div className={styles.tips}>
        {tips.map((tip, i) => (
          <div key={i} className={styles.tipItem}>
            <span className={styles.arrow}>→</span> {tip}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {title === "Rate Limit Exhausted" && exhaustCountdown > 0 ? (
           <div className={styles.countdownText}>
             You can retry in: <strong>{exhaustCountdown} seconds</strong>
           </div>
        ) : (
          <motion.button 
            className={`${styles.primaryBtn} ${title === "Rate Limit Exhausted" ? styles.readyPulse : ''}`} 
            onClick={onRetry}
            whileTap={{ scale: 0.97 }}
          >
            {title === "Rate Limit Exhausted" && exhaustCountdown === 0 ? "READY — TRY NOW" : "TRY AGAIN"}
          </motion.button>
        )}
        <motion.a 
          className={styles.ghostBtn}
          href="https://github.com/Soumik22-tech/RepoXray/issues" 
          target="_blank" 
          rel="noreferrer"
          whileTap={{ scale: 0.97 }}
        >
          REPORT ISSUE
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ErrorDisplay;
