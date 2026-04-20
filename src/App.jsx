import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import ResultsPage from './pages/ResultsPage';
import LoadingRoast from './components/LoadingRoast/LoadingRoast';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import HowItWorksPage from './pages/HowItWorksPage';
import Footer from './components/Footer/Footer';
import { useRoast } from './hooks/useRoast';

function MainRoastView({ status, roastData, error, loadingMessage, waitSeconds, retryAttempt, roast, reset }) {
  const isIdle = status === 'idle';
  const isLoading = ['fetching_github', 'building_prompt', 'calling_ai', 'parsing', 'rate_limited_waiting'].includes(status);
  const isError = status === 'error';
  const isResults = status === 'done';

  return (
    <AnimatePresence mode="wait">
      {isIdle && (
        <LandingPage key="landing" onRoast={roast} status={status} reset={reset} />
      )}
      {isLoading && (
        <LoadingRoast key="loading" status={status} waitSeconds={waitSeconds} retryAttempt={retryAttempt} />
      )}
      {isError && (
        <ErrorDisplay key="error" error={error} onRetry={reset} />
      )}
      {isResults && (
        <ResultsPage 
          key="results" 
          data={roastData} 
          onRetry={reset} 
        />
      )}
    </AnimatePresence>
  );
}

function App() {
  const { status, roastData, error, loadingMessage, waitSeconds, retryAttempt, roast, reset } = useRoast();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <MainRoastView 
                  status={status} 
                  roastData={roastData} 
                  error={error} 
                  loadingMessage={loadingMessage} 
                  waitSeconds={waitSeconds} 
                  retryAttempt={retryAttempt} 
                  roast={roast} 
                  reset={reset} 
                />
              } 
            />
            <Route path="/how" element={<HowItWorksPage />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

export default App;
