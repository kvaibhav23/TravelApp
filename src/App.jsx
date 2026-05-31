import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import TripChat from './pages/TripChat';
import SwipeVote from './pages/SwipeVote';
import ConsensusDashboard from './pages/ConsensusDashboard';
import Checkout from './pages/Checkout';
import AIPlanner from './pages/AIPlanner';
import ActiveTrip from './pages/ActiveTrip';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  const { state } = useApp();
  const hideNav = location.pathname === '/onboarding';

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/onboarding" element={<AnimatedPage><Onboarding /></AnimatedPage>} />
          <Route path="/chat" element={<AnimatedPage><TripChat /></AnimatedPage>} />
          <Route path="/vote" element={<AnimatedPage><SwipeVote /></AnimatedPage>} />
          <Route path="/consensus" element={<AnimatedPage><ConsensusDashboard /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/ai-planner" element={<AnimatedPage><AIPlanner /></AnimatedPage>} />
          <Route path="/trip" element={<AnimatedPage><ActiveTrip /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default App;
