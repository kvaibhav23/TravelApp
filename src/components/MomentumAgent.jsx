import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, AlertTriangle, TrendingUp, Check, X, Send, Clock
} from 'lucide-react';
import '../index.css';

const NUDGES = [
  {
    id: 'n1',
    icon: <Clock size={20} />,
    iconBg: 'rgba(245, 158, 11, 0.2)',
    iconColor: 'var(--accent-amber)',
    message: 'Poll inactive for 24h — send a reminder to the group?',
    urgency: 'medium',
  },
  {
    id: 'n2',
    icon: <AlertTriangle size={20} />,
    iconBg: 'rgba(255, 107, 107, 0.2)',
    iconColor: 'var(--accent-coral)',
    message: "2 members haven't authorized payment — nudge them?",
    urgency: 'high',
  },
  {
    id: 'n3',
    icon: <TrendingUp size={20} />,
    iconBg: 'rgba(245, 158, 11, 0.2)',
    iconColor: 'var(--accent-amber)',
    message: 'Prices increased by 8% since last check — book now?',
    urgency: 'high',
  },
];

export default function MomentumAgent() {
  const [nudgeStates, setNudgeStates] = useState({});
  // 'visible' (default) | 'sent' | 'dismissed'

  const getState = (id) => nudgeStates[id] || 'visible';

  const handleSendNudge = (id) => {
    setNudgeStates(prev => ({ ...prev, [id]: 'sent' }));
  };

  const handleDismiss = (id) => {
    setNudgeStates(prev => ({ ...prev, [id]: 'dismissed' }));
  };

  const visibleNudges = NUDGES.filter(n => getState(n.id) !== 'dismissed');

  if (visibleNudges.length === 0) return null;

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {/* Header */}
      <div className="flex items-center gap-sm mb-sm" style={{ padding: '0 var(--space-xs)' }}>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <Bell size={16} style={{ color: 'var(--accent-amber)' }} />
        </motion.div>
        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--accent-amber)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Momentum Nudges
        </span>
      </div>

      <div className="flex flex-col gap-sm">
        <AnimatePresence>
          {visibleNudges.map((nudge, idx) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
              style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="wait">
                {getState(nudge.id) === 'visible' ? (
                  <motion.div
                    key="content"
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                      <div style={{
                        background: nudge.iconBg,
                        borderRadius: 'var(--radius-md)',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: nudge.iconColor,
                      }}>
                        {nudge.icon}
                      </div>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        lineHeight: 1.4,
                        flex: 1,
                      }}>
                        {nudge.message}
                      </p>
                    </div>
                    <div className="flex gap-sm" style={{ marginLeft: '48px' }}>
                      <motion.button
                        className="btn btn-sm"
                        onClick={() => handleSendNudge(nudge.id)}
                        whileTap={{ scale: 0.93 }}
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: 'var(--accent-amber)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        <Send size={12} /> Send Nudge
                      </motion.button>
                      <motion.button
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleDismiss(nudge.id)}
                        whileTap={{ scale: 0.93 }}
                        style={{ fontSize: 'var(--text-xs)' }}
                      >
                        <X size={12} /> Dismiss
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-sm"
                    style={{ justifyContent: 'center', padding: 'var(--space-xs) 0' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                    >
                      <Check size={18} style={{ color: 'var(--accent-emerald)' }} />
                    </motion.div>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--accent-emerald)',
                      fontWeight: 500,
                    }}>
                      Nudge sent to the group!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
