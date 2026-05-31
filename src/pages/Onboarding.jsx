import { useState, useEffect, useCallback } from 'react';
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
  Lock,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import KYCVerification from '../components/KYCVerification';
import ConsentManager from '../components/ConsentManager';
import '../index.css';

/* ── Constants ───────────────────────────────────────────── */

const TOTAL_STEPS = 4;

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
    label: 'Corporate Admin',
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

/* ── Main Onboarding Component ────────────────────────── */

export default function Onboarding() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1 — Role
  const [selectedRole, setSelectedRole] = useState(null);

  // Step 2 — Lite KYC
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Step 3 — Full KYC
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarLinkStarted, setAadhaarLinkStarted] = useState(false);
  const [aadhaarLinkDone, setAadhaarLinkDone] = useState(false);

  // Step 4 — Consent
  const [consentsReady, setConsentsReady] = useState(false);

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
      case 1: return name.trim() && phone.length >= 10 && email.includes('@') && otpVerified;
      case 2: return true; // optional step
      case 3: return true;
      default: return false;
    }
  };

  /* ── Finish onboarding ───────────────────────────────── */

  const finishOnboarding = () => {
    dispatch({ type: 'SET_USER_ROLE', payload: selectedRole });
    dispatch({ type: 'SET_KYC_STATUS', payload: panVerified && aadhaarVerified ? 'full' : 'lite' });
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

  /* ── DigiLocker simulation ───────────────────────────── */

  const startAadhaarLink = () => {
    setAadhaarLinkStarted(true);
    setTimeout(() => {
      setAadhaarLinkDone(true);
      setAadhaarVerified(true);
    }, 3000);
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

          {/* ─── STEP 2: Lite KYC ──────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step-kyc-lite"
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
                Quick verification <span style={{ fontSize: 'var(--text-2xl)' }}>🔐</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginBottom: 28,
              }}>
                Lite KYC for secure group payments
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
                    Phone verified — Lite KYC ready
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── STEP 3: Full KYC ──────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step-kyc-full"
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
                Go unlimited <span style={{ fontSize: 'var(--text-2xl)' }}>🚀</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginBottom: 20,
              }}>
                Full KYC removes all transaction limits
              </p>

              {/* Tiered KYC info card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 18px',
                  marginBottom: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={18} color="var(--accent-secondary)" />
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    KYC Tiers
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: 8,
                }}>
                  <div style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--accent-emerald)',
                      marginBottom: 2,
                    }}>
                      ✅ Lite KYC
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.3,
                    }}>
                      Unlocked ₹10k transactions
                    </p>
                  </div>
                  <div style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--accent-secondary)',
                      marginBottom: 2,
                    }}>
                      🚀 Full KYC
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.3,
                    }}>
                      Unlocks unlimited
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* PAN Card Verification */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Lock size={18} color="var(--accent-secondary)" />
                  PAN Card
                  {panVerified && (
                    <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>Verified</span>
                  )}
                </h4>
                <KYCVerification
                  documentType="PAN Card"
                  onComplete={() => setPanVerified(true)}
                />
              </div>

              <div className="divider" />

              {/* Aadhaar via DigiLocker */}
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <ShieldCheck size={18} color="var(--accent-secondary)" />
                  Aadhaar via DigiLocker
                  {aadhaarVerified && (
                    <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>Verified</span>
                  )}
                </h4>

                {!aadhaarLinkStarted ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-ghost btn-full"
                    onClick={startAadhaarLink}
                    style={{
                      padding: '16px',
                      justifyContent: 'center',
                      gap: 10,
                    }}
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='11' x='3' y='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E"
                      alt=""
                      style={{ width: 20, height: 20 }}
                    />
                    Link via DigiLocker
                  </motion.button>
                ) : !aadhaarLinkDone ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      style={{
                        width: 40,
                        height: 40,
                        margin: '0 auto 12px',
                        borderRadius: '50%',
                        border: '3px solid var(--glass-border)',
                        borderTopColor: 'var(--accent-primary)',
                      }}
                    />
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                    }}>
                      Connecting to DigiLocker...
                    </p>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                      marginTop: 4,
                    }}>
                      Simulating OAuth consent flow
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="glass-card"
                    style={{
                      padding: '16px 20px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      background: 'rgba(16, 185, 129, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <CheckCircle2 size={22} color="var(--accent-emerald)" />
                    <div>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--accent-emerald)',
                      }}>
                        Aadhaar Verified
                      </p>
                      <p style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-muted)',
                      }}>
                        XXXX XXXX 4821 linked via DigiLocker
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Skip note */}
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: 20,
              }}>
                You can skip this step and complete Full KYC later from Settings.
              </p>
            </motion.div>
          )}

          {/* ─── STEP 4: DPDP Consent ──────────────────── */}
          {step === 3 && (
            <motion.div
              key="step-consent"
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
                Your data, your rules <span style={{ fontSize: 'var(--text-2xl)' }}>🛡️</span>
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginBottom: 24,
              }}>
                DPDP Act compliant privacy controls
              </p>

              <ConsentManager
                onConsentsChange={() => setConsentsReady(true)}
              />
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
            opacity: canProceed() || step === 2 || step === 3 ? 1 : 0.45,
            pointerEvents: canProceed() || step === 2 || step === 3 ? 'auto' : 'none',
          }}
          onClick={step === TOTAL_STEPS - 1 ? finishOnboarding : goNext}
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <Sparkles size={18} />
              Launch WanderZ
            </>
          ) : step === 2 ? (
            <>
              {panVerified && aadhaarVerified ? 'Continue' : 'Skip for now'}
              <ArrowRight size={18} />
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
