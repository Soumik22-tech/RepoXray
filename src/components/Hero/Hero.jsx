import { motion } from 'framer-motion';
import URLInput from '../URLInput/URLInput';
import styles from './Hero.module.css';

const Hero = ({ onRoast, status, reset }) => {
  const particles = Array.from({ length: 12 });

  return (
    <div className={styles.heroContainer}>
      <div className={styles.scanlines} />
      
      <div className={styles.embersContainer}>
        {particles.map((_, i) => (
          <div 
            key={i} 
            className={`${styles.ember} ${i % 2 === 0 ? styles.round : styles.square}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.5,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <motion.h1 
          className={styles.headline}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          YOUR CODE WILL BE <br />
          <span className="gradient-text">JUDGED. HARSHLY.</span>
        </motion.h1>

        <motion.p 
          className={styles.subheadline}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Paste a public GitHub repo URL below. We'll read the code, analyze the architecture, 
          and tell you exactly why your approach is wrong. No feelings spared.
        </motion.p>

        <motion.div 
          className={styles.inputWrapper}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <URLInput onRoast={onRoast} status={status} reset={reset} />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
