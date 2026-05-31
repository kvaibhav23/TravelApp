import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PAYMENT_METHODS, DESTINATIONS } from '../data/mockTravelData';
import '../index.css';

export default function SinglePayerCheckout() {
  const { state, dispatch } = useApp();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const itinerary = state.lockedItinerary || DESTINATIONS[0];
  const memberCount = state.groupMembers?.length || 6;
  const baseAmount = itinerary.pricePerPerson * memberCount;
  const taxes = Math.round(baseAmount * 0.12);
  const platformFee = 499;
  const totalAmount = baseAmount + taxes + platformFee;

  const handlePay = () => {
    if (!selectedMethod) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setConfirmed(true);
      dispatch({ type: 'COMPLETE_PAYMENT' });
    }, 3000);
  };

  const bookingRef = 'WZ-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  if (confirmed) {
    return (
      <motion.div
        style={styles.confirmationContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Animated checkmark */}
        <motion.div
          style={styles.checkCircle}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Check size={40} strokeWidth={3} color="white" />
          </motion.div>
        </motion.div>

        <motion.h3
          style={styles.confirmTitle}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Booking Confirmed! 🎉
        </motion.h3>

        <motion.div
          className="glass-card"
          style={styles.confirmCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div style={styles.refRow}>
            <span style={styles.refLabel}>Booking Reference</span>
            <span style={styles.refValue}>{bookingRef}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.confirmDetail}>
            <span style={styles.detailLabel}>Hotel</span>
            <span style={styles.detailValue}>{itinerary.hotel?.name || itinerary.name}</span>
          </div>
          <div style={styles.confirmDetail}>
            <span style={styles.detailLabel}>Dates</span>
            <span style={styles.detailValue}>{itinerary.dates}</span>
          </div>
          <div style={styles.confirmDetail}>
            <span style={styles.detailLabel}>Total Paid</span>
            <span style={{ ...styles.detailValue, color: 'var(--accent-emerald)' }}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </motion.div>

        <motion.div
          style={styles.securityNote}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Shield size={14} color="var(--accent-emerald)" />
          <span>Payment secured by WanderZ Shield™</span>
        </motion.div>
      </motion.div>
    );
  }

  if (processing) {
    return (
      <motion.div
        style={styles.processingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          style={styles.processingRing}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <div style={styles.ringInner} />
        </motion.div>
        <motion.p
          style={styles.processingText}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          Processing payment...
        </motion.p>
        <p style={styles.processingSubtext}>Securing your booking with {
          PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name
        }</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Cost Breakdown */}
      <div className="glass-card" style={styles.breakdownCard}>
        <div style={styles.breakdownHeader}>
          <Sparkles size={18} color="var(--accent-secondary)" />
          <h4 style={styles.breakdownTitle}>Cost Breakdown</h4>
        </div>

        <div style={styles.breakdownRows}>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>
              Base ({memberCount} members × ₹{itinerary.pricePerPerson.toLocaleString('en-IN')})
            </span>
            <span style={styles.breakdownValue}>₹{baseAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>GST (12%)</span>
            <span style={styles.breakdownValue}>₹{taxes.toLocaleString('en-IN')}</span>
          </div>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>Platform Fee</span>
            <span style={styles.breakdownValue}>₹{platformFee}</span>
          </div>
          <div style={{ ...styles.divider, margin: 'var(--space-sm) 0' }} />
          <div style={styles.breakdownRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <h4 style={styles.sectionTitle}>Select Payment Method</h4>
      <div style={styles.methodsGrid}>
        {PAYMENT_METHODS.map((method, i) => (
          <motion.div
            key={method.id}
            className={`glass-card ${selectedMethod === method.id ? 'animate-glow' : ''}`}
            style={{
              ...styles.methodCard,
              borderColor: selectedMethod === method.id ? 'var(--accent-primary)' : 'var(--glass-border)',
              background: selectedMethod === method.id
                ? 'rgba(124, 58, 237, 0.15)'
                : 'var(--glass-bg)',
              boxShadow: selectedMethod === method.id
                ? 'var(--shadow-glow)'
                : 'none',
            }}
            onClick={() => setSelectedMethod(method.id)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span style={styles.methodIcon}>{method.icon}</span>
            <span style={{
              ...styles.methodName,
              color: selectedMethod === method.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}>
              {method.name}
            </span>
            {selectedMethod === method.id && (
              <motion.div
                style={styles.selectedCheck}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check size={12} color="white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pay Button */}
      <motion.button
        className="btn btn-primary btn-lg btn-full"
        style={{
          ...styles.payButton,
          opacity: selectedMethod ? 1 : 0.5,
          pointerEvents: selectedMethod ? 'auto' : 'none',
        }}
        onClick={handlePay}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CreditCard size={20} />
        Pay ₹{totalAmount.toLocaleString('en-IN')}
        <ChevronRight size={18} />
      </motion.button>

      <div style={styles.securityNote}>
        <Shield size={14} color="var(--accent-emerald)" />
        <span>256-bit encryption · RBI compliant</span>
      </div>
    </motion.div>
  );
}

const styles = {
  breakdownCard: {
    marginBottom: 'var(--space-lg)',
  },
  breakdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-md)',
  },
  breakdownTitle: {
    fontSize: 'var(--text-lg)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  breakdownRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
  },
  breakdownValue: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  totalLabel: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-heading)',
  },
  totalValue: {
    fontSize: 'var(--text-xl)',
    fontWeight: 800,
    fontFamily: 'var(--font-heading)',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  divider: {
    height: 1,
    background: 'var(--glass-border)',
    margin: 'var(--space-md) 0',
  },
  sectionTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-md)',
  },
  methodsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-lg)',
  },
  methodCard: {
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-lg)',
    border: '2px solid',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    position: 'relative',
    transition: 'all 0.25s ease',
  },
  methodIcon: {
    fontSize: '28px',
  },
  methodName: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    textAlign: 'center',
  },
  selectedCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButton: {
    marginTop: 'var(--space-sm)',
    marginBottom: 'var(--space-md)',
  },
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xs)',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    padding: 'var(--space-sm) 0',
  },
  /* Processing */
  processingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-3xl) var(--space-lg)',
    gap: 'var(--space-lg)',
  },
  processingRing: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    border: '4px solid rgba(124,58,237,0.15)',
    borderTopColor: 'var(--accent-primary)',
    borderRightColor: 'var(--accent-secondary)',
  },
  ringInner: {},
  processingText: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-primary)',
    margin: 0,
  },
  processingSubtext: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  /* Confirmation */
  confirmationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--space-2xl) var(--space-md)',
    gap: 'var(--space-lg)',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'var(--gradient-emerald)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
  },
  confirmTitle: {
    fontSize: 'var(--text-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    margin: 0,
  },
  confirmCard: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  refRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
  },
  refValue: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-secondary)',
    letterSpacing: '1px',
  },
  confirmDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
  },
  detailValue: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
};
