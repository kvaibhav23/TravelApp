import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import '../index.css';

export default function PreAuthTimer({ seconds, onExpired }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpired?.();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onExpired]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = timeLeft / seconds;

  const getColor = () => {
    if (timeLeft > 60) return 'var(--accent-emerald)';
    if (timeLeft > 30) return 'var(--accent-amber)';
    return 'var(--accent-coral)';
  };

  const isUrgent = timeLeft <= 30;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      style={styles.container}
      animate={isUrgent ? { scale: [1, 1.03, 1] } : {}}
      transition={isUrgent ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      <div style={styles.timerRing}>
        <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
          />
        </svg>
        <div style={styles.timerCenter}>
          <motion.span
            style={{ ...styles.timerValue, color: getColor() }}
            key={timeLeft}
            initial={{ scale: 1.15, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </motion.span>
        </div>
      </div>

      <div style={styles.labelRow}>
        <Clock size={14} style={{ color: getColor() }} />
        <span style={{ ...styles.labelText, color: 'var(--text-secondary)' }}>
          Time remaining for all members to authorize
        </span>
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-lg)',
  },
  timerRing: {
    position: 'relative',
    width: 130,
    height: 130,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCenter: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  timerValue: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 800,
    letterSpacing: '1px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  labelText: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
  },
};
