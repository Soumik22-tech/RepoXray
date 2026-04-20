import { motion } from 'framer-motion';
import RepoHeader from '../components/RepoHeader/RepoHeader';
import ScoreCard from '../components/ScoreCard/ScoreCard';
import GradeGrid from '../components/GradeGrid/GradeGrid';
import RoastCards from '../components/RoastCards/RoastCards';
import RedeemingQualities from '../components/RedeemingQualities/RedeemingQualities';
import Verdict from '../components/Verdict/Verdict';
import ShareButton from '../components/ShareButton/ShareButton';
import styles from './ResultsPage.module.css';

const ResultsPage = ({ data, onRetry }) => {
  if (!data) return null;

  return (
    <motion.main 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <RepoHeader repo={data.repo} />
      
      <div className={styles.content}>
        <ScoreCard score={data.overallScore} roastTitle={data.roastTitle} />
        <GradeGrid grades={data.grades} />
        <RoastCards roasts={data.roasts} />
        <RedeemingQualities points={data.redeeming} />
        <Verdict text={data.verdict} />
        <ShareButton 
          score={data.overallScore} 
          roastTitle={data.roastTitle}
          verdict={data.verdict} 
          onRetry={onRetry} 
        />
      </div>
    </motion.main>
  );
};

export default ResultsPage;
