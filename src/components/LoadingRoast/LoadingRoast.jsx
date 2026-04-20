import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadingMessages } from '../../data/mockRoast';
import styles from './LoadingRoast.module.css';

const getPhaseDetails = (status) => {
  if (status === 'fetching_github') {
    return {
      phase: 1,
      icon: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>,
      message: "Infiltrating GitHub servers...",
      sub: "Fetching repo metadata, README, and source files",
      progress: 25
    };
  }
  if (status === 'building_prompt') {
    return {
      phase: 2,
      icon: <path d="M12 2a6 6 0 00-6 6v2a6 6 0 000 12h12a6 6 0 000-12v-2a6 6 0 00-6-6zm0 2a4 4 0 014 4v2H8V8a4 4 0 014-4z"/>,
      message: "Constructing the roast brief...",
      sub: "Feeding your code sins to the AI",
      progress: 45
    };
  }
  if (status === 'calling_ai' || status === 'rate_limited_waiting') {
    return {
      phase: 3,
      icon: '🔥',
      message: "AI is reading",
      sub: "Gemini is judging your life choices...",
      progress: 45
    };
  }
  if (status === 'parsing') {
    return {
      phase: 4,
      icon: '⚡',
      message: "Finalizing your emotional damage...",
      sub: "Calculating scores, grades, and maximum pain",
      progress: 95
    };
  }
  return { phase: 1, message: "Loading...", sub: "", progress: 10, icon: '...' };
};

const LoadingRoast = ({ status, waitSeconds, retryAttempt }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(45);
  const [logs, setLogs] = useState([]);
  
  const phaseInfo = getPhaseDetails(status);

  // Cycling message during phase 3
  useEffect(() => {
    let interval;
    if (phaseInfo.phase === 3 && status !== 'rate_limited_waiting') {
      interval = setInterval(() => {
        setMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [phaseInfo.phase, status]);

  // Fake smooth progress upwards during Phase 3
  useEffect(() => {
    let pInterval;
    if (phaseInfo.phase === 3) {
      pInterval = setInterval(() => {
        setFakeProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 1;
        });
      }, 500);
    } else if (phaseInfo.phase === 4) {
      setFakeProgress(98);
    } else {
      setFakeProgress(phaseInfo.progress);
    }
    return () => clearInterval(pInterval);
  }, [phaseInfo.phase, phaseInfo.progress]);

  // Handle Terminal Logs
  useEffect(() => {
    const newLogs = [];
    if (phaseInfo.phase >= 1) newLogs.push({ text: "> Fetching repo metadata...", status: phaseInfo.phase > 1 ? "OK" : "PROCESSING" });
    if (phaseInfo.phase >= 2) {
      newLogs[0].status = "OK";
      newLogs.push({ text: "> Downloading README.md...", status: "OK" });
      newLogs.push({ text: "> Sampling source files...", status: "OK" });
      newLogs.push({ text: "> Building roast prompt...", status: phaseInfo.phase > 2 ? "OK" : "PROCESSING" });
    }
    if (phaseInfo.phase >= 3) {
      newLogs[3].status = "OK";
      const callStatus = status === 'rate_limited_waiting' ? "WAITING" : (phaseInfo.phase > 3 ? "OK" : "PROCESSING");
      newLogs.push({ text: "> Calling Gemini API...", status: callStatus });
    }
    if (phaseInfo.phase >= 4) {
      newLogs[4].status = "OK";
      newLogs.push({ text: "> Parsing JSON response...", status: "PROCESSING" });
    }
    setLogs(newLogs);
  }, [phaseInfo.phase, status]);

  const displayMessage = phaseInfo.phase === 3 ? loadingMessages[msgIdx] : phaseInfo.message;
  const progressVal = phaseInfo.phase === 3 ? fakeProgress : phaseInfo.progress;

  return (
    <motion.div 
      className={styles.container}
      role="status" aria-live="polite" aria-label={displayMessage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.topProgressBarWrapper}>
        <div 
          className={styles.topProgressBar}
          style={{ width: `${progressVal}%` }}
        >
          <div className={styles.progressGlow} />
        </div>
      </div>

      <div className={styles.content}>
        {status === 'rate_limited_waiting' ? (
          <div className={styles.waitingUI}>
            <div className={styles.amberGlow}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h2 className={styles.waitingTitle}>Gemini Rate Limit — Cooling Down...</h2>
            <p className={styles.waitingSub}>Free tier allows 15 requests/minute. Auto-retrying in:</p>
            
            <div className={styles.countdownNumber}>
              {waitSeconds}
            </div>
            <div className={styles.countdownUnit}>seconds</div>
            
            <div className={styles.retryAttempt}>Attempt {retryAttempt} of 4 — will retry automatically</div>
            <div className={styles.reassurance}>Do NOT close this tab. Your roast is queued and will complete.</div>
          </div>
        ) : (
          <>
            <div className={styles.iconWrapper}>
              {typeof phaseInfo.icon === 'string' ? (
                <motion.div 
                  className={phaseInfo.phase === 3 ? styles.fireIcon : styles.textIcon}
                  animate={phaseInfo.phase === 3 ? { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {phaseInfo.icon}
                </motion.div>
              ) : (
                <svg viewBox="0 0 24 24" className={styles.svgIcon} fill="currentColor">
                  {phaseInfo.icon}
                </svg>
              )}
            </div>

            <div className={styles.messageWrapper}>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={displayMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={styles.mainMessage}
                >
                  {displayMessage}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <p className={styles.subMessage}>{phaseInfo.sub}</p>
          </>
        )}

        <div className={styles.terminalPanel}>
          {logs.map((log, i) => (
            <motion.div 
              key={i} 
              className={styles.logLine}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className={styles.logText}>{log.text.padEnd(35, ' ')}</span>
              <span className={log.status === 'OK' ? styles.logOk : styles.logProcessing}>
                [{log.status}]
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingRoast;
