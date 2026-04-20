import { motion } from 'framer-motion';
import { getGradeColor } from '../../utils/helpers';
import styles from './GradeGrid.module.css';

const GradeGrid = ({ grades }) => {
  if (!grades || grades.length === 0) return null;

  return (
    <section className={styles.section}>
      <motion.h2 
        className={styles.headerTitle}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        ARCHITECTURE GRADES
      </motion.h2>

      <div className={styles.grid}>
        {grades.map((item, i) => {
          const gColor = getGradeColor(item.score);
          return (
            <motion.div 
              key={i}
              className={styles.card}
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              style={{ '--grade-color': gColor }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.score}>{item.score}/100</span>
              </div>
              <div className={styles.gradeBox}>
                {item.grade}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default GradeGrid;
