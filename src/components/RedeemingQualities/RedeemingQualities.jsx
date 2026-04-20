import { motion } from 'framer-motion';
import styles from './RedeemingQualities.module.css';

const RedeemingQualities = ({ points }) => {
  if (!points || points.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.headerTitle}>ACTUALLY THOUGH...</h2>
      
      <div className={styles.list}>
        {points.map((point, i) => (
          <motion.div 
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <span className={styles.emoji}>✅</span>
            <span className={styles.text}>{point}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RedeemingQualities;
