import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';

const LandingPage = ({ onRoast, status, reset }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero onRoast={onRoast} status={status} reset={reset} />
    </motion.div>
  );
};

export default LandingPage;
