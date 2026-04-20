import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './URLInput.module.css';

const URLInput = ({ onRoast, status, reset }) => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('repoxray_api_key') || '');
  const [urlError, setUrlError] = useState('');
  const [urlShake, setUrlShake] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [ghToken, setGhToken] = useState(localStorage.getItem('repoxray_gh_token') || '');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const cleanInput = (str) => str.replace(/<[^>]*>/g, '').trim();

  const validateURL = (val) => {
    if (!val) return false;
    let clean = val;
    clean = clean.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
    clean = clean.replace(/\.git$/, '');
    clean = clean.replace(/\/$/, '');
    
    // Test for format: github.com/owner/repo
    const regex = /^github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(\/.*)?$/;
    if (!regex.test(clean)) {
      if (/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(clean)) {
        // Just owner/repo — fix it for user implicitly
        return `https://github.com/${clean}`;
      }
      return false;
    }
    
    return `https://${clean}`;
  };

  const validateApiKey = (val) => {
    return val && val.startsWith('AIza') && val.length > 30;
  };

  const handleBlur = () => {
    if (!url.trim()) return;
    const validated = validateURL(url.trim());
    if (!validated) {
      setUrlError("That does not look like a GitHub URL. Try: github.com/owner/repo");
    } else {
      setUrlError('');
      setUrl(validated);
    }
  };

  const handleGhTokenChange = (e) => {
    const val = e.target.value;
    setGhToken(val);
    if (val) {
      localStorage.setItem('repoxray_gh_token', val);
    } else {
      localStorage.removeItem('repoxray_gh_token');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (status !== 'idle' && status !== 'error') return;

    const sanitizedUrl = cleanInput(url);
    const sanitizedKey = cleanInput(apiKey);

    const validatedUrl = validateURL(sanitizedUrl);
    if (!validatedUrl) {
      setUrlError("That does not look like a GitHub URL. Try: github.com/owner/repo");
      setUrlShake(true);
      setTimeout(() => setUrlShake(false), 500);
      return;
    }
    setUrlError('');
    setUrl(validatedUrl);

    const isMock = typeof window !== 'undefined' && window.location.search.includes('mock=true');
    
    if (!isMock && !validateApiKey(sanitizedKey)) {
      setKeyError(true);
      return;
    }
    setKeyError(false);
    
    await onRoast(validatedUrl, sanitizedKey);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && status !== 'idle' && status !== 'error' && status !== 'done' && status !== undefined) {
        setShowCancelConfirm(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  const loadingPhases = ['fetching_github', 'building_prompt', 'calling_ai', 'parsing'];
  const isLoading = loadingPhases.includes(status);

  const getBtnText = () => {
    if (status === 'error') return 'ROAST IT';
    if (status === 'fetching_github') return 'CHECKING...';
    if (isLoading) return 'ROASTING...';
    return 'ROAST IT';
  };

  return (
    <div className={styles.container}>
      <motion.form 
        className={`${styles.form} ${urlShake ? styles.errorShake : ''}`}
        onSubmit={handleSubmit}
        animate={urlShake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.inputsContainer}>
          <div className={styles.stepBox}>
            <label className={styles.stepLabel}>① GITHUB REPO URL</label>
            <input
              type="text"
              className={`${styles.stepInput} ${urlError ? styles.errorBorder : ''}`}
              placeholder="https://github.com/owner/repo"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setHasStartedTyping(true);
                if (urlError) setUrlError('');
              }}
              onBlur={handleBlur}
              disabled={isLoading}
            />
            {urlError && <p className={styles.inlineError}>{urlError}</p>}
            
            <AnimatePresence>
              {!hasStartedTyping && (
                <motion.div 
                  className={styles.suggestions}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button type="button" onClick={() => { setUrl('torvalds/linux'); setHasStartedTyping(true); handleBlur(); }}>Try: torvalds/linux</button>
                  <span className={styles.pipe}>|</span>
                  <button type="button" onClick={() => { setUrl('facebook/react'); setHasStartedTyping(true); handleBlur(); }}>Try: facebook/react</button>
                  <span className={styles.pipe}>|</span>
                  <button type="button" onClick={() => { setUrl('vercel/next.js'); setHasStartedTyping(true); handleBlur(); }}>Try: vercel/next.js</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className={styles.stepBox}>
            <label className={styles.stepLabel}>② GEMINI API KEY</label>
            <div className={styles.passwordWrapper}>
               <input 
                 type={showKey ? "text" : "password"} 
                 className={`${styles.stepInput} ${styles.apiKeyInput} ${keyError ? styles.errorBorder : ''}`}
                 placeholder="AIzaSy... (free at aistudio.google.com)"
                 value={apiKey}
                 onChange={(e) => {
                   setApiKey(e.target.value);
                   if (keyError) setKeyError(false);
                 }}
                 disabled={isLoading}
               />
               <button 
                 type="button" 
                 className={styles.showHideBtn} 
                 onClick={() => setShowKey(!showKey)}
                 disabled={isLoading}
               >
                 {showKey ? "HIDE" : "SHOW"}
               </button>
            </div>
             {keyError && <p className={styles.inlineError}>Key should start with AIza and be ~39 characters</p>}
             {!keyError && apiKey.startsWith('AIza') && apiKey.length > 30 && <p className={styles.inlineSuccess}>Key format looks valid</p>}
             
             <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className={styles.apiLink}>
               🔑 Get a free Gemini API key → aistudio.google.com
             </a>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
             {isLoading ? 'X-RAYING...' : 'X-RAY MY REPO 🔬'}
          </button>
          
          <p className={styles.helperText}>
            Works with any public GitHub repo • Free • No account needed
          </p>
        </div>
      </motion.form>
      
      <div className={styles.hintsWrapper}>
        <p className={styles.hint}>Works with any public GitHub repo</p>
        <button 
          className={styles.settingsToggle} 
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Toggle Settings"
          type="button"
        >
          ⚙️ Settings
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className={styles.settingsPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.settingsContent}>
              <label className={styles.label}>
                GitHub Personal Access Token (optional)
              </label>
              <input 
                type="password" 
                className={styles.tokenInput} 
                placeholder="ghp_xxxxxxxxxxxx"
                value={ghToken}
                onChange={handleGhTokenChange}
              />
              <p className={styles.tokenHint}>
                Increases rate limit from 60 to 5000 req/hr. Token only used for GitHub API calls. Never stored on server.
                <br />
                <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className={styles.link}>
                  How to create a token →
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div className={styles.modalBg} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className={styles.modalContent}>
               <p>Cancel this roast?</p>
               <div className={styles.modalBtns}>
                 <button onClick={() => { reset(); setShowCancelConfirm(false); }}>Yes</button>
                 <button onClick={() => setShowCancelConfirm(false)}>No</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLInput;
