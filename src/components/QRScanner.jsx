import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, X, Check, Store, Users, IndianRupee, ChevronLeft, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GROUP_MEMBERS } from '../data/mockTravelData';
import '../index.css';

export default function QRScanner({ onClose }) {
  const { dispatch } = useApp();
  const [scanning, setScanning] = useState(true);
  const [merchantDetected, setMerchantDetected] = useState(false);
  const [amount, setAmount] = useState('3200');
  const [splitMode, setSplitMode] = useState('equal');
  const [selectedMembers, setSelectedMembers] = useState(GROUP_MEMBERS.map(m => m.id));
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setMerchantDetected(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSplitPay = () => {
    const numericAmount = parseInt(amount) || 0;
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: `e-${Date.now()}`,
        description: 'Beach Shack Restaurant',
        amount: numericAmount,
        paidBy: 'u1',
        time: 'Day 2, ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        icon: '🏪',
        splitBetween: selectedMembers,
      },
    });
    setPaymentDone(true);
  };

  const perPerson = selectedMembers.length > 0
    ? Math.round((parseInt(amount) || 0) / selectedMembers.length)
    : 0;

  return (
    <div className="page" style={{ paddingTop: 'var(--space-md)' }}>
      {/* Header */}
      <div className="flex items-center gap-sm mb-lg">
        <button className="btn btn-ghost btn-icon" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>
            <span className="text-gradient">Scan & Pay</span>
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Scan merchant QR to split payment
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Scanning State */}
        {scanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div className="scanner-frame">
              <div
                className="scanner-corner scanner-corner-tl"
                style={{ borderRadius: '4px 0 0 0' }}
              />
              <div
                className="scanner-corner scanner-corner-tr"
                style={{ borderRadius: '0 4px 0 0' }}
              />
              <div
                className="scanner-corner scanner-corner-bl"
                style={{ borderRadius: '0 0 0 4px' }}
              />
              <div
                className="scanner-corner scanner-corner-br"
                style={{ borderRadius: '0 0 4px 0' }}
              />
              <div className="scanner-line" />
              {/* Inner area */}
              <div style={{
                position: 'absolute',
                inset: '20px',
                background: 'rgba(124, 58, 237, 0.03)',
                borderRadius: 'var(--radius-sm)',
              }} />
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-md)' }}
            >
              <ScanLine size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Point camera at merchant QR code...
            </motion.p>
          </motion.div>
        )}

        {/* Merchant Detected */}
        {merchantDetected && !paymentDone && (
          <motion.div
            key="merchant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-md"
          >
            {/* Merchant Card */}
            <motion.div
              className="glass-card-elevated"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-md)',
                }}
              >
                <Store size={28} style={{ color: 'var(--accent-emerald)' }} />
              </motion.div>
              <span className="badge badge-emerald mb-sm">Merchant Detected</span>
              <h3 style={{ fontWeight: 700, marginTop: 'var(--space-sm)' }}>Beach Shack Restaurant</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Palolem Beach, South Goa
              </p>
            </motion.div>

            {/* Amount Input */}
            <div className="glass-card">
              <div className="flex items-center gap-sm mb-sm">
                <IndianRupee size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Amount</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-heading)',
                }}>₹</span>
                <input
                  type="number"
                  className="input"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{
                    paddingLeft: '40px',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    textAlign: 'left',
                  }}
                />
              </div>
            </div>

            {/* Split Mode */}
            <div className="glass-card">
              <div className="flex items-center gap-sm mb-md">
                <Users size={16} style={{ color: 'var(--accent-secondary)' }} />
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Split Options</span>
              </div>
              <div className="flex gap-sm mb-md">
                {['equal', 'custom'].map(mode => (
                  <button
                    key={mode}
                    className={`chip ${splitMode === mode ? 'active' : ''}`}
                    onClick={() => setSplitMode(mode)}
                    style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize' }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Member Selection */}
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-sm)',
                fontWeight: 500,
              }}>
                Select members to split between:
              </p>
              <div className="flex flex-col gap-xs">
                {GROUP_MEMBERS.map(m => {
                  const isSelected = selectedMembers.includes(m.id);
                  return (
                    <motion.button
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected
                          ? '1px solid rgba(124, 58, 237, 0.4)'
                          : '1px solid var(--glass-border)',
                        background: isSelected
                          ? 'rgba(124, 58, 237, 0.1)'
                          : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: 'var(--radius-xs)',
                        border: isSelected
                          ? '2px solid var(--accent-primary)'
                          : '2px solid var(--glass-border)',
                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                      }}>
                        {isSelected && <Check size={12} color="white" />}
                      </div>
                      <div className="avatar avatar-sm" style={{ background: m.color, width: '28px', height: '28px', fontSize: '10px' }}>
                        {m.avatar}
                      </div>
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        flex: 1,
                        textAlign: 'left',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}>
                        {m.name}
                      </span>
                      {isSelected && (
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--accent-secondary)',
                          fontWeight: 600,
                          fontFamily: 'var(--font-heading)',
                        }}>
                          ₹{perPerson.toLocaleString('en-IN')}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Summary + Pay Button */}
            <div className="glass-card" style={{
              background: 'rgba(124, 58, 237, 0.08)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
            }}>
              <div className="flex justify-between mb-sm">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Total</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  ₹{(parseInt(amount) || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between mb-md">
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Per person</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--accent-secondary)' }}>
                  ₹{perPerson.toLocaleString('en-IN')} × {selectedMembers.length}
                </span>
              </div>
              <motion.button
                className="btn btn-primary btn-lg btn-full"
                onClick={handleSplitPay}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={selectedMembers.length === 0}
                style={{ opacity: selectedMembers.length === 0 ? 0.5 : 1 }}
              >
                Split & Pay ₹{(parseInt(amount) || 0).toLocaleString('en-IN')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {paymentDone && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-md)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-lg)',
              }}
            >
              <CheckCircle2 size={40} style={{ color: 'var(--accent-emerald)' }} />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: 'var(--space-sm)' }}
            >
              Payment Split Successfully!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-sm)' }}
            >
              ₹{(parseInt(amount) || 0).toLocaleString('en-IN')} split between {selectedMembers.length} members
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-xl)' }}
            >
              Beach Shack Restaurant · Palolem Beach
            </motion.p>

            <motion.button
              className="btn btn-primary btn-lg"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileTap={{ scale: 0.97 }}
            >
              Back to Trip
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
