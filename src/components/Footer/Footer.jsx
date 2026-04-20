import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h2 className={`${styles.brandName} gradient-text`}>🔬 REPOXRAY</h2>
            <p className={styles.brandTagline}>AI-Powered Repo X-Ray Scans</p>
            <p className={styles.copyright}>© 2026 RepoXray. Built with 🔬 and zero mercy.</p>
          </div>
          
          <div className={styles.column}>
            <h3 className={styles.colTitle}>NAVIGATE</h3>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Home → /</Link></li>
              <li><Link to="/how" className={styles.navLink}>How It Works → /how</Link></li>
              <li>
                <a 
                  href="https://github.com/Soumik22-tech/RepoXray" 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.navLink}
                >
                  Star on GitHub → github.com
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.colTitle}>BUILT WITH</h3>
            <div className={styles.pillsList}>
              <span className={styles.pill}>React 18</span>
              <span className={styles.pill}>Vite</span>
              <span className={styles.pill}>Gemini 2.5 Flash</span>
              <span className={styles.pill}>GitHub API</span>
              <span className={styles.pill}>Framer Motion</span>
              <span className={styles.pill}>CSS Modules</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.disclaimer}>RepoXray is not responsible for developer tears.</p>
          <a 
            href="https://github.com/Soumik22-tech/RepoXray" 
            target="_blank" 
            rel="noreferrer" 
            className={styles.sourceLink}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            View Source
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
