import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LONG_WEEKENDS, DESTINATIONS } from '../data/mockTravelData';
import '../index.css';

export default function LongWeekendDetector() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const nextWeekend = useMemo(() => {
    // Return the first upcoming long weekend (mock — always show the first one)
    return LONG_WEEKENDS[0];
  }, []);

  const adImage = useMemo(() => {
    const match = DESTINATIONS.find((d) => d.name === nextWeekend?.suggestion);
    return match?.image;
  }, [nextWeekend]);

  if (!nextWeekend || dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.15) 50%, rgba(16,185,129,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-lg)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 'var(--space-md)',
          }}
        >
          {/* Image background (matches suggested destination) */}
          {adImage && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${adImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.18,
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Background sparkle decoration */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          {/* Dismiss button */}
          <motion.button
            onClick={() => setDismissed(true)}
            whileTap={{ scale: 0.85 }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              zIndex: 2,
            }}
          >
            <X size={14} />
          </motion.button>

          {/* Header row */}
          <div className="flex items-center gap-sm mb-sm">
            <div style={{
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
            }}>
              <Calendar size={18} color="white" />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                }}
              >
                <Sparkles size={12} color="var(--accent-amber)" />
              </motion.div>
            </div>
            <div>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--accent-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Long Weekend Detected
              </span>
            </div>
          </div>

          {/* Holiday info */}
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-lg)',
            marginBottom: '4px',
          }}>
            {nextWeekend.holiday}
          </h4>
          <div className="flex items-center gap-md mb-md">
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              📅 {nextWeekend.date}
            </span>
            <span className="badge badge-emerald">
              {nextWeekend.days} days off
            </span>
          </div>

          {/* Suggestion */}
          <div className="flex items-center gap-sm mb-md" style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
          }}>
            <span style={{ fontSize: '18px' }}>✨</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Suggested: <strong style={{ color: 'var(--text-primary)' }}>{nextWeekend.suggestion}</strong>
            </span>
          </div>

          {/* CTA */}
          <motion.button
            className="btn btn-primary btn-full"
            onClick={() => navigate('/ai-planner')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontSize: 'var(--text-sm)' }}
          >
            Start Planning
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
