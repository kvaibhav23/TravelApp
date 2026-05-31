import { useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { Heart, X, Star, MapPin, Clock, IndianRupee, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DESTINATIONS } from '../data/mockTravelData';
import '../index.css';

const SWIPE_THRESHOLD = 120;

function MicroExplainTags({ explain }) {
  if (!explain) return null;

  const tags = [];

  // Prototype: destination.explain.* can be long; we convert into compact metadata tags.
  // We keep only a short label + icon, and rely on the existing explain strings only if they’re already compact.
  if (explain.budget) {
    tags.push(
      <span key="budget" className="badge explain-budget" style={{ fontSize: 10, padding: '2px 8px' }}>
        💰 Budget
      </span>
    );
  }
  if (explain.logistics) {
    tags.push(
      <span key="logistics" className="badge explain-logistics" style={{ fontSize: 10, padding: '2px 8px' }}>
        ✈️ Logistics
      </span>
    );
  }
  if (explain.vibe) {
    tags.push(
      <span key="vibe" className="badge explain-vibe" style={{ fontSize: 10, padding: '2px 8px' }}>
        ✨ Vibe
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
      {tags.slice(0, 3)}
    </div>
  );
}

function SwipeCard({ destination, isTop, onSwipe, style }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_, info) => {
      if (info.offset.x > SWIPE_THRESHOLD) {
        onSwipe('up');
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        onSwipe('down');
      }
    },
    [onSwipe]
  );

  return (
    <motion.div
      className="swipe-card"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        ...style,
        zIndex: isTop ? 10 : 1,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: isTop ? 1 : style?.scale || 0.95, opacity: 1 }}
      animate={{
        scale: isTop ? 1 : style?.scale || 0.95,
        y: isTop ? 0 : style?.y || 10,
      }}
      exit={{
        x: x.get() > 0 ? 400 : -400,
        opacity: 0,
        rotate: x.get() > 0 ? 20 : -20,
        transition: { duration: 0.35, ease: 'easeOut' },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileDrag={{ scale: 1.03 }}
    >
      {/* LIKE / NOPE indicators */}
      <motion.div
        className="swipe-indicator swipe-indicator-like"
        style={{ opacity: isTop ? likeOpacity : 0 }}
      >
        LIKE
      </motion.div>
      <motion.div
        className="swipe-indicator swipe-indicator-nope"
        style={{ opacity: isTop ? nopeOpacity : 0 }}
      >
        NOPE
      </motion.div>

      {/* Card image */}
      <img
        src={destination.image}
        alt={destination.name}
        className="swipe-card-image"
        draggable={false}
      />

      {/* Card content */}
      <div className="swipe-card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '4px' }}>
              {destination.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              <MapPin size={14} />
              {destination.location}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: 'var(--radius-full)', color: 'var(--accent-amber)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
            <Star size={14} fill="var(--accent-amber)" />
            {destination.rating}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            <IndianRupee size={14} />
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: 'var(--text-base)' }}>
              ₹{destination.pricePerPerson.toLocaleString('en-IN')}
            </span>
            <span>/person</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            <Clock size={14} />
            {destination.duration}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
          {destination.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-primary" style={{ fontSize: '11px', padding: '2px 8px' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Metadata Tags (compact — no conversational text) */}
        <MicroExplainTags explain={destination.explain} />
      </div>
    </motion.div>
  );
}

export default function SwipeVote() {
  const { state, dispatch } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiped, setSwiped] = useState([]);

  const destinations = DESTINATIONS;
  const currentUser = state.currentUser;

  const handleSwipe = useCallback(
    (direction) => {
      const dest = destinations[currentIndex];
      if (!dest) return;

      dispatch({
        type: 'VOTE',
        payload: {
          destinationId: dest.id,
          vote: direction,
          userId: currentUser.id,
        },
      });

      setSwiped((prev) => [...prev, { id: dest.id, direction }]);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, destinations, dispatch, currentUser]
  );

  const allSwiped = currentIndex >= destinations.length;

  return (
    <div className="page">
      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={20} color="var(--accent-amber)" />
          <h1 className="page-title text-gradient" style={{ fontSize: 'var(--text-2xl)' }}>
            Vote on Destinations
          </h1>
        </div>
        <p className="page-subtitle">
          Swipe right to like, left to pass • {Math.min(currentIndex + 1, destinations.length)}/{destinations.length}
        </p>
        {/* Progress */}
        <div className="progress-bar" style={{ marginTop: '12px' }}>
          <motion.div
            className="progress-fill"
            animate={{ width: `${(currentIndex / destinations.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Card Stack */}
      {!allSwiped ? (
        <>
          <div className="card-stack">
            <AnimatePresence mode="popLayout">
              {destinations
                .slice(currentIndex, currentIndex + 3)
                .reverse()
                .map((dest, reversedIdx) => {
                  const stackSize = Math.min(destinations.length - currentIndex, 3);
                  const actualIdx = stackSize - 1 - reversedIdx;
                  const isTop = actualIdx === 0;

                  return (
                    <SwipeCard
                      key={dest.id}
                      destination={dest}
                      isTop={isTop}
                      onSwipe={handleSwipe}
                      style={{
                        scale: 1 - actualIdx * 0.05,
                        y: actualIdx * 12,
                      }}
                    />
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '24px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => handleSwipe('down')}
              className="btn"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 107, 107, 0.15)',
                border: '2px solid var(--accent-coral)',
                color: 'var(--accent-coral)',
                padding: 0,
              }}
              whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(255,107,107,0.4)' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>
            <motion.button
              onClick={() => handleSwipe('up')}
              className="btn"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                padding: 0,
              }}
              whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(16,185,129,0.4)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={28} />
            </motion.button>
          </motion.div>
        </>
      ) : (
        /* All voted state */
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="empty-state-icon"
            style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Sparkles size={40} />
          </motion.div>
          <h2 style={{ marginBottom: '8px' }}>All Voted! 🎉</h2>
          <p className="page-subtitle" style={{ marginBottom: '24px' }}>
            You've cast your votes on all {destinations.length} destinations.
            <br />
            Head over to the consensus dashboard to see the results!
          </p>
          <Link to="/consensus" style={{ textDecoration: 'none' }}>
            <motion.button
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
            >
              View Consensus
              <ArrowRight size={18} />
            </motion.button>
          </Link>

          {/* Vote Summary */}
          <div style={{ marginTop: '32px', width: '100%' }}>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Your votes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {swiped.map((s) => {
                const dest = destinations.find((d) => d.id === s.id);
                return (
                  <motion.div
                    key={s.id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={dest.image}
                        alt={dest.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                        }}
                      />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{dest.name}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--text-lg)',
                        color: s.direction === 'up' ? 'var(--accent-emerald)' : 'var(--accent-coral)',
                      }}
                    >
                      {s.direction === 'up' ? '❤️' : '❌'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
