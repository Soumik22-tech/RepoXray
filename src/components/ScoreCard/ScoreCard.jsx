import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor, getScoreTagline } from '../../utils/helpers';
import { useCountUp } from '../../hooks/useCountUp';
import styles from './ScoreCard.module.css';

const ScoreCard = ({ score, roastTitle }) => {
  const displayScore = useCountUp(score, 1800);
  const color = getScoreColor(score);
  const tagline = getScoreTagline(score);

  return (
    <section className={styles.container}>
      <motion.div 
        className={styles.titleWrapper}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className={styles.roastTitle}>"{roastTitle}"</span>
      </motion.div>

      <div className={styles.scoreRow} aria-label={`Overall score: ${score} out of 100`} role="text">
        <motion.div 
          className={styles.scoreNumber}
          style={{ 
            color, 
            filter: `drop-shadow(0 0 20px ${color}60)` 
          }}
          animate={{ filter: [`drop-shadow(0 0 20px ${color}60)`, `drop-shadow(0 0 60px ${color}a0)`, `drop-shadow(0 0 20px ${color}60)`] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {displayScore}
        </motion.div>
        <span className={styles.scoreLabel}>/ 100</span>
      </div>

      <div className={styles.tagline}>{tagline}</div>

      <div className={styles.barWrapper}>
        <motion.div 
          className={styles.barFill}
          initial={{ width: "0%" }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ background: `linear-gradient(90deg, ${color}40, ${color})` }}
        />
      </div>
    </section>
  );
};

export default ScoreCard;
