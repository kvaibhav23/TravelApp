import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, MapPin, Hotel, Plane, CreditCard, Clock } from 'lucide-react';
import '../index.css';

const CHECKLIST_ITEMS = [
  { id: 'dates', label: 'Dates', icon: CalendarCheck, status: 'done', detail: 'Locked' },
  { id: 'destination', label: 'Destination', icon: MapPin, status: 'voting', detail: 'Voting' },
  { id: 'hotel', label: 'Hotel', icon: Hotel, status: 'pending', detail: 'Pending' },
  { id: 'flights', label: 'Flights', icon: Plane, status: 'pending', detail: 'Pending' },
  { id: 'payments', label: 'Payments', icon: CreditCard, status: 'pending', detail: '0/6' },
];

const STATUS_ICONS = {
  done: '✓',
  voting: '⏳',
  pending: '⏳',
};

const STATUS_COLORS = {
  done: 'var(--accent-emerald)',
  voting: 'var(--accent-amber)',
  pending: 'var(--text-muted)',
};

function TripHealthScore() {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const completedCount = CHECKLIST_ITEMS.filter((i) => i.status === 'done').length;
  const percent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  // Countdown: trip date is Aug 14 2025
  const tripDate = new Date('2025-08-14');
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24)));

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedPercent(percent), 300);
    return () => clearTimeout(timeout);
  }, [percent]);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <motion.div
      className="trip-health-score"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: '12px var(--space-md)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      {/* Progress Ring */}
      <div className="health-score-ring" style={{ flexShrink: 0, width: 56, height: 56 }}>
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="var(--glass-bg-strong)"
            strokeWidth="5"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="url(#healthGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-emerald)" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className="health-score-value"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
          }}
        >
          {animatedPercent}%
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{ flex: 1, display: 'flex', gap: 6, overflowX: 'auto' }}>
        {CHECKLIST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                minWidth: 52,
                padding: '4px 2px',
                borderRadius: 'var(--radius-sm)',
                background:
                  item.status === 'done'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : item.status === 'voting'
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'transparent',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={14} color={STATUS_COLORS[item.status]} />
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: STATUS_COLORS[item.status],
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: 8,
                  color: STATUS_COLORS[item.status],
                  opacity: 0.8,
                }}
              >
                {item.status === 'done' ? STATUS_ICONS.done : item.detail}
              </span>
            </div>
          );
        })}
      </div>

      {/* Days Left */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: '6px 10px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 107, 107, 0.2)',
          flexShrink: 0,
        }}
      >
        <Clock size={12} color="var(--accent-coral)" />
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--accent-coral)',
            lineHeight: 1,
          }}
        >
          {daysLeft}
        </span>
        <span style={{ fontSize: 8, color: 'var(--accent-coral)', whiteSpace: 'nowrap' }}>
          days left
        </span>
      </div>
    </motion.div>
  );
}

export default TripHealthScore;
