import { motion } from 'framer-motion';
import styles from './RepoHeader.module.css';

const RepoHeader = ({ repo }) => {
  if (!repo) return null;

  return (
    <motion.div 
      className={styles.container}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <div className={styles.leftSide}>
        <img 
          src={`https://github.com/${repo.owner}.png?size=40`} 
          alt={`${repo.owner} avatar`}
          className={styles.avatar}
          width={40}
          height={40}
        />
        <div className={styles.repoPath}>
          <span className={styles.muted}>{repo.owner}</span> / <span className={styles.bold}>{repo.name}</span>
        </div>
        {repo.language && (
          <span className={styles.langBadge}>{repo.language}</span>
        )}
        {repo.fileTree?.totalFiles > 200 && (
          <span className={styles.largeRepoNotice}>
            Large repo — sampled first 80 files for analysis
          </span>
        )}
      </div>

      <div className={styles.rightSide}>
        <div className={styles.stat}>⭐ {repo.stars}</div>
        <div className={styles.stat}>🍴 {repo.forks}</div>
        <div className={styles.stat}>🐛 {repo.openIssues}</div>
        <div className={styles.stat}>⏱️ {repo.lastCommitRelative || repo.lastCommit}</div>
        <a 
          href={repo.url} 
          target="_blank" 
          rel="noreferrer" 
          className={styles.link}
        >
          View on GitHub →
        </a>
      </div>
    </motion.div>
  );
};

export default RepoHeader;
