import { motion } from 'framer-motion';
import { getSeverityColor } from '../../utils/helpers';
import styles from './RoastCards.module.css';

const RoastCards = ({ roasts }) => {
  if (!roasts || roasts.length === 0) return null;

  return (
    <section className={styles.section}>
      <motion.h2 
        className={styles.headerTitle}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        CRITICAL VULNERABILITIES
      </motion.h2>

      <div className={styles.list}>
        {roasts.map((roast, i) => {
          const sevColor = getSeverityColor(roast.severity);
          return (
            <motion.div 
              key={i}
              className={`${styles.card}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              style={{ '--severity-color': sevColor }}
            >
              <div className={styles.sweepLine} style={{ animationDelay: `${i * 0.1 + 0.3}s`, backgroundColor: sevColor }} />
              
              <div className={styles.cardHeader}>
                <div className={styles.severityBadge} style={{ color: sevColor, borderColor: sevColor }}>
                  {roast.severity}
                </div>
                {roast.file && (
                  <div className={styles.filePath}>{roast.file}</div>
                )}
              </div>
              
              <h3 className={styles.roastCategory}>{roast.category}</h3>
              <p className={styles.roastBurn}>{roast.burn}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RoastCards;
