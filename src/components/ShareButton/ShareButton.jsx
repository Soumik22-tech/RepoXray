import { motion } from 'framer-motion';
import { getScoreColor } from '../../utils/helpers';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import styles from './ShareButton.module.css';

const ShareButton = ({ score, roastTitle, verdict, onRetry }) => {
  const [copyState, setCopyState] = useState('default'); // default, copying, copied

  const handleCopy = async () => {
    setCopyState('copying');
    const textToCopy = `My repo scored ${score}/100 on RepoXray 🔬\n"${roastTitle}"\n"${verdict}"\nGet your code X-rayed: repoxray.dev`;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Clipboard not supported');
      }
      setCopyState('copied');
      
      confetti({
        particleCount: 80,
        colors: ['#ff4500', '#ff8c00', '#ffd700', '#ff2d55', '#ffffff'],
        origin: { x: 0.5, y: 0.7 },
        spread: 70,
        startVelocity: 35,
        decay: 0.9,
        ticks: 100
      });
      
      setTimeout(() => setCopyState('default'), 2500);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setCopyState('default');
    }
  };

  const tweetText = encodeURIComponent(`My repo just got X-rayed by RepoXray 🔬\nScore: ${score}/100 — "${roastTitle}"\nGet yours scanned 👉 repoxray.dev`);

  return (
    <section className={styles.container}>
      <div className={styles.scoreBadge}>
        {score}/100 🔥 {roastTitle}
      </div>

      <motion.button 
        className={`${styles.primaryBtn} ${copyState === 'copied' ? styles.copied : ''}`}
        onClick={handleCopy}
        disabled={copyState === 'copying'}
        whileTap={{ scale: 0.97 }}
      >
        {copyState === 'default' && "🔥 SHARE MY ROAST"}
        {copyState === 'copying' && "COPYING..."}
        {copyState === 'copied' && "✅ COPIED — NOW SHOW YOUR FRIENDS"}
      </motion.button>

      <motion.button 
        className={styles.secondaryBtn}
        onClick={onRetry}
        whileTap={{ scale: 0.97 }}
      >
        ROAST ANOTHER REPO
      </motion.button>
      
      <div className={styles.socialRow}>
        <motion.button 
          className={styles.socialBtn}
          onClick={handleCopy}
          whileTap={{ scale: 0.97 }}
          aria-label="Copy roast to clipboard"
        >
          <span>📋</span> Copy
        </motion.button>
        <motion.a 
          className={styles.socialBtn}
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.97 }}
          aria-label="Share on Twitter"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Tweet
        </motion.a>
        <motion.a 
          className={styles.socialBtn}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Frepoxray.dev`}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.97 }}
          aria-label="Share on LinkedIn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share
        </motion.a>
      </div>
    </section>
  );
};

export default ShareButton;
