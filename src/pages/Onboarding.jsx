import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Users,
  Briefcase,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../index.css';

/* ── Constants ───────────────────────────────────────────── */

const TOTAL_STEPS = 2;

const ROLES = [
  {
    id: 'student',
    emoji: '🎓',
    label: 'Student',
    description: 'Budget trips, hostel splits, and semester-break adventures',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    icon: GraduationCap,
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧‍👦',
    label: 'Family Organizer',
    description: 'Plan family vacations with shared itineraries & kid-friendly picks',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
    icon: Users,
  },
  {
    id: 'corporate',
    emoji: '💼',
    label: 'Corporate travel/Field Trip',
    description: 'Manage team off-sites, GST invoicing & expense reports',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    icon: Briefcase,
  },
];

/* ── Slide animation variants ─────────────────────────── */

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ── DPDP Details ─────────────────────────────────────── */
const DPDP_DETAILS = [
  'Your personal data (name, phone, email) is used solely for trip planning and group coordination.',
  'Data is processed as per the Digital Personal Data Protection Act, 2023.',
  'You can request deletion of your data at any time from Settings.',
  'We do not sell or share your personal data with third parties without your consent.',
  'Trip analytics may be used to improve your recommendations (optional).',
];

/* ── Main Onboarding Component ────────────────────────── */

export default function Onboarding() {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1 — Role
  const [selectedRole, setSelectedRole] = useState(null);

  // Step 2 — Registration
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // DPDP Consent
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [showDpdpDetails, setShowDpdpDetails] = useState(false);

  /* ── Navigation helpers ──────────────────────────────── */

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      const next = step + 1;
      setStep(next);
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: next });
    }
  }, [step, dispatch]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      const prev = step - 1;
      setStep(prev);
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: prev });
    }
  }, [step, dispatch]);

  const canProceed = () => {
    switch (step) {
      case 0: return selectedRole !== null;
      case 1: return name.trim() && phone.length >= 10 && email.includes('@') && otpVerified && dpdpConsent;
      default: return false;
    }
  };

  /* ── Finish onboarding ───────────────────────────────── */

  const finishOnboarding = () => {
    dispatch({ type: 'SET_USER_ROLE', payload: selectedRole });
    dispatch({ type: 'SET_DPDP_CONSENT', payload: true });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: TOTAL_STEPS });
    navigate('/');
  };

  /* ── OTP simulation ──────────────────────────────────── */

  const sendOtp = () => {
    setOtpSent(true);
    setShowOtpModal(true);

    // Auto-fill OTP after 2 seconds
    setTimeout(() => {
      setOtp(['4', '8', '2', '7', '1', '5']);
      setTimeout(() => {
        setOtpVerified(true);
        setShowOtpModal(false);
      }, 800);
    }, 2000);
  };

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="onboarding-container" style={{ maxWidth: 480, margin: '0 auto' }}>

      {/* ── Progress Bar ───────────────────────────────── */}
      <div className="onboarding-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`onboarding-step ${
              i < step ? 'completed' : i === step ? 'active' : ''
            }`}
          />
        ))}
      </div>

      {/* ── Step Label ──────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <span style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Step {step + 1} of {TOTAL_STEPS}
        </span>
      </div>

      {/* ── Step Content (Animated) ────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 420 }}>
        <AnimatePresence mode="wait" custom={direction}>

          {/* ─── STEP 1: Role Selection ─────────────────── */}
          {step === 0 && (
            <motion.div
              key="step-role"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-3xl)',
                marginBottom: 4,
              }}>
                Who are you? <span style={{ fontSize: 'var(--text-2xl)' }}>✨</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginBottom: 28,
              }}>
                We'll personalise your WanderZ experience
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {ROLES.map((role, idx) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1, duration: 0.35 }}
                      className={`role-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div
                        className="role-icon"
                        style={{
                          background: isSelected ? role.gradient : 'var(--glass-bg-strong)',
                          fontSize: '24px',
                          transition: 'background 0.3s ease',
                        }}
                      >
                        {role.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          fontSize: 'var(--text-base)',
                          color: 'var(--text-primary)',
                          marginBottom: 2,
                        }}>
                          {role.label}
                        </p>
                        <p style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                        }}>
                          {role.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <CheckCircle2 size={22} color="var(--accent-primary)" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Registration + DPDP ──────────── */}
          {step === 1 && (
            <motion.div
              key="step-register"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-3xl)',
                marginBottom: 4,
              }}>
                Create your account <span style={{ fontSize: 'var(--text-2xl)' }}>🚀</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginBottom: 28,
              }}>
                Quick setup to get you started
              </p>

              {/* Name */}
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', top: 13, left: 14 }}
                  />
                  <input
                    className="input"
                    style={{ paddingLeft: 40 }}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone
                      size={18}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', top: 13, left: 14 }}
                    />
                    <input
                      className="input"
                      style={{ paddingLeft: 40 }}
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`btn ${otpVerified ? 'btn-emerald' : 'btn-primary'}`}
                    style={{ whiteSpace: 'nowrap', fontSize: 'var(--text-xs)' }}
                    onClick={sendOtp}
                    disabled={phone.length < 10 || otpVerified}
                  >
                    {otpVerified ? (
                      <><CheckCircle2 size={14} /> Verified</>
                    ) : otpSent ? (
                      'Resend'
                    ) : (
                      'Send OTP'
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Email */}
              <div className="input-group">
                <label className="input-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', top: 13, left: 14 }}
                  />
                  <input
                    className="input"
                    style={{ paddingLeft: 40 }}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Verified badge */}
              {otpVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 4,
                  }}
                >
                  <ShieldCheck size={18} color="var(--accent-emerald)" />
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--accent-emerald)',
                    fontWeight: 500,
                  }}>
                    Phone verified — you're all set!
                  </span>
                </motion.div>
              )}

              {/* ── DPDP Consent Checkbox ──────────────── */}
              <div style={{ marginTop: 20 }}>
                <div className="divider" style={{ margin: '0 0 16px 0' }} />

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    cursor: 'pointer',
                    padding: '12px 14px',
                    background: dpdpConsent ? 'rgba(124, 58, 237, 0.08)' : 'var(--glass-bg)',
                    border: `1px solid ${dpdpConsent ? 'rgba(124, 58, 237, 0.3)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    style={{
                      marginTop: 2,
                      width: 18,
                      height: 18,
                      accentColor: 'var(--accent-primary)',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 4,
                    }}>
                      <Shield size={14} color="var(--accent-secondary)" />
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}>
                        I consent to data processing under DPDP Act 2023
                      </span>
                    </div>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}>
                      WanderZ processes your personal data for trip planning, group coordination, and personalised recommendations.
                    </p>
                  </div>
                </label>

                {/* Read More toggle */}
                <motion.button
                  onClick={() => setShowDpdpDetails(!showDpdpDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {showDpdpDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showDpdpDetails ? 'Hide details' : 'Read more about our data practices'}
                </motion.button>

                <AnimatePresence>
                  {showDpdpDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '12px 14px',
                        background: 'rgba(124, 58, 237, 0.05)',
                        border: '1px solid rgba(124, 58, 237, 0.15)',
                        borderRadius: 'var(--radius-md)',
                        marginTop: 8,
                      }}>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}>
                          {DPDP_DETAILS.map((detail, idx) => (
                            <li key={idx} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.5,
                            }}>
                              <span style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 1 }}>✓</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation Buttons ─────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: 12,
        paddingTop: 24,
        marginTop: 'auto',
      }}>
        {step > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-ghost"
            onClick={goBack}
            style={{ flex: '0 0 auto' }}
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>
        )}

        <motion.button
          whileHover={canProceed() ? { scale: 1.02 } : {}}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
          className="btn btn-primary btn-lg"
          style={{
            flex: 1,
            opacity: canProceed() ? 1 : 0.45,
            pointerEvents: canProceed() ? 'auto' : 'none',
          }}
          onClick={step === TOTAL_STEPS - 1 ? finishOnboarding : goNext}
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <Sparkles size={18} />
              Launch WanderZ
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>

      {/* ── OTP Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showOtpModal && (
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
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                width: '100%',
                maxWidth: 380,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-xl)',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowOtpModal(false)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
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
                background: 'rgba(124, 58, 237, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Phone size={24} color="var(--accent-secondary)" />
              </div>

              <h4 style={{
                fontFamily: 'var(--font-heading)',
                marginBottom: 6,
              }}>
                Verify your phone
              </h4>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                marginBottom: 24,
              }}>
                OTP sent to +91 {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
              </p>

              {/* OTP Inputs */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 20,
              }}>
                {otp.map((digit, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: digit ? 1 : 0.9,
                      opacity: 1,
                    }}
                    transition={{ delay: digit ? 0.05 * i : 0, duration: 0.2 }}
                    style={{
                      width: 44,
                      height: 52,
                      borderRadius: 'var(--radius-md)',
                      background: digit ? 'rgba(124, 58, 237, 0.15)' : 'var(--glass-bg)',
                      border: `2px solid ${digit ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {digit}
                  </motion.div>
                ))}
              </div>

              {/* Auto-fill progress */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                {!otp[0] ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: '2px solid var(--glass-border)',
                        borderTopColor: 'var(--accent-primary)',
                      }}
                    />
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                    }}>
                      Auto-reading OTP...
                    </span>
                  </>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent-emerald)',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    OTP auto-filled — verifying...
                  </motion.span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
