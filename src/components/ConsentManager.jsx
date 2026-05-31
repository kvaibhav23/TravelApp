import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Trash2, AlertTriangle, ChevronDown, X } from 'lucide-react';
import '../index.css';

const CONSENT_OPTIONS = [
  {
    id: 'kyc_storage',
    label: 'Store my KYC data',
    description: 'Keep identity documents securely for faster bookings',
    defaultOn: true,
  },
  {
    id: 'analytics',
    label: 'Trip analytics',
    description: 'Analyse travel patterns to improve recommendations',
    defaultOn: true,
  },
  {
    id: 'marketing',
    label: 'Marketing communications',
    description: 'Receive offers, deals, and travel inspiration',
    defaultOn: false,
  },
  {
    id: 'partners',
    label: 'Share with travel partners',
    description: 'Allow hotels & airlines to personalise your experience',
    defaultOn: false,
  },
];

const RETENTION_OPTIONS = [
  '6 months',
  '1 year',
  '2 years',
  'Until I delete',
];

export default function ConsentManager({ onConsentsChange }) {
  const [consents, setConsents] = useState(() =>
    Object.fromEntries(CONSENT_OPTIONS.map((c) => [c.id, c.defaultOn]))
  );
  const [retention, setRetention] = useState('1 year');
  const [showRetentionDropdown, setShowRetentionDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const toggleConsent = (id) => {
    const updated = { ...consents, [id]: !consents[id] };
    setConsents(updated);
    onConsentsChange?.({ consents: updated, retention });
  };

  const handleRetentionSelect = (option) => {
    setRetention(option);
    setShowRetentionDropdown(false);
    onConsentsChange?.({ consents, retention: option });
  };

  const handleDeleteRequest = () => {
    setDeleteConfirmed(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteConfirmed(false);
    }, 2000);
  };

  const activeCount = Object.values(consents).filter(Boolean).length;

  return (
    <div style={{ width: '100%' }}>
      {/* Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'rgba(124, 58, 237, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Shield size={20} color="var(--accent-secondary)" />
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
          }}>
            DPDP Consent Preferences
          </p>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}>
            {activeCount} of {CONSENT_OPTIONS.length} permissions enabled
          </p>
        </div>
      </div>

      {/* Consent Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONSENT_OPTIONS.map((option, idx) => {
          const isOn = consents[option.id];
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'var(--glass-bg)',
                border: `1px solid ${isOn ? 'rgba(124, 58, 237, 0.25)' : 'var(--glass-border)'}`,
                borderRadius: 'var(--radius-md)',
                transition: 'border-color 0.25s ease',
              }}
            >
              <div style={{ flex: 1, marginRight: 12 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 2,
                }}>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    {option.label}
                  </span>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isOn ? 'var(--accent-emerald)' : 'var(--accent-coral)',
                    boxShadow: isOn
                      ? '0 0 6px rgba(16,185,129,0.5)'
                      : '0 0 6px rgba(255,107,107,0.5)',
                    transition: 'all 0.3s ease',
                  }} />
                </div>
                <p style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                }}>
                  {option.description}
                </p>
              </div>

              {/* Toggle */}
              <div
                className={`toggle ${isOn ? 'active' : ''}`}
                onClick={() => toggleConsent(option.id)}
                role="switch"
                aria-checked={isOn}
              >
                <div className="toggle-knob" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Data Retention Dropdown */}
      <div style={{ marginTop: 20 }}>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>
          Data Retention Period
        </label>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRetentionDropdown(!showRetentionDropdown)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'border-color 0.25s ease',
            }}
          >
            <span>{retention}</span>
            <motion.div
              animate={{ rotate: showRetentionDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} color="var(--text-muted)" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showRetentionDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border-strong)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  zIndex: 'var(--z-dropdown)',
                  transformOrigin: 'top',
                }}
              >
                {RETENTION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleRetentionSelect(option)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: option === retention
                        ? 'rgba(124, 58, 237, 0.15)'
                        : 'transparent',
                      border: 'none',
                      color: option === retention
                        ? 'var(--accent-secondary)'
                        : 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (option !== retention) {
                        e.currentTarget.style.background = 'var(--glass-bg-strong)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (option !== retention) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Data Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDeleteModal(true)}
        style={{
          width: '100%',
          marginTop: 20,
          padding: '14px 20px',
          background: 'rgba(255, 107, 107, 0.08)',
          border: '1px solid rgba(255, 107, 107, 0.25)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--accent-coral)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          transition: 'background 0.25s ease',
        }}
      >
        <Trash2 size={16} />
        Request Data Deletion
      </motion.button>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 10, 26, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 'var(--z-modal)',
              padding: 'var(--space-md)',
            }}
            onClick={() => { if (!deleteConfirmed) setShowDeleteModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 400,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-xl)',
                textAlign: 'center',
              }}
            >
              {!deleteConfirmed ? (
                <>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={20} />
                  </button>

                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(255, 107, 107, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <AlertTriangle size={28} color="var(--accent-coral)" />
                  </div>

                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    marginBottom: 8,
                    color: 'var(--text-primary)',
                  }}>
                    Delete All Data?
                  </h4>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: 24,
                    lineHeight: 1.6,
                  }}>
                    This will permanently remove your KYC documents, trip history,
                    and all personal data. This action cannot be undone.
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: 12,
                  }}>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-coral"
                      style={{ flex: 1 }}
                      onClick={handleDeleteRequest}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <Shield size={28} color="var(--accent-emerald)" />
                  </div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--accent-emerald)',
                    marginBottom: 4,
                  }}>
                    Deletion Requested
                  </h4>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    Your data will be purged within 72 hours.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
