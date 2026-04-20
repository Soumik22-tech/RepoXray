import { motion } from 'framer-motion';
import styles from './Verdict.module.css';

const Verdict = ({ text }) => {
  if (!text) return null;

  const words = text.split(' ');

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.quoteMark}>"</div>
        
        <p className={styles.verdictText}>
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.02, duration: 0.4 }}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </motion.span>
          ))}
        </p>
        
        <div className={styles.inlineAttribution}>
          <hr className={styles.separator} />
          Analysis powered by RepoXray + Gemini AI
        </div>
      </div>
      
      <a href="https://github.com/Soumik22-tech/RepoXray" target="_blank" rel="noreferrer" className={styles.watermark}>
        🔬 Powered by RepoXray
      </a>
    </section>
  );
};

export default Verdict;
