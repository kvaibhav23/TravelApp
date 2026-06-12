import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  User,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
  Upload,
  Users,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../index.css';

/* ── Constants ───────────────────────────────────────────── */

const TOTAL_STEPS = 2;

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const DPDP_CONSENT_TEXT =
  'I agree to the Terms of Service and consent to the storage of my data for trip planning and payment processing.';

const MOCK_OAUTH_AVATAR_MAP = {
  google: 'https://placehold.co/256x256/png?text=G',
  apple: 'https://placehold.co/256x256/png?text=A',
};

function getFirstNameAndLastInitial(fullName) {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { firstName: '', lastInitial: '' };

  const firstName = parts[0];
  const lastInitial = parts.length >= 2 ? (parts[parts.length - 1][0] || '').toUpperCase() : '';
  return { firstName, lastInitial };
}

function formatMaskedPhone(phoneDigits10) {
  // phoneDigits10 is 10 digits, group like 5 + 5
  return phoneDigits10.replace(/(\d{5})(\d{5})/, '$1 $2');
}

function TinderAvatarStack() {
  // Removed: replaced by simple upload/auto-assignment profile picture flow.
  return null;
}

/* ── Main Registration Component (replaces old onboarding) ───────────── */

export default function Onboarding() {
  const { dispatch, state } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // OTP step state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const otpTimeout1Ref = useRef(null);
  const otpTimeout2Ref = useRef(null);

  // Profile state
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState(''); // we only use last initial
  const [oauthProvider, setOauthProvider] = useState(null);
  const [pendingOAuthEmail, setPendingOAuthEmail] = useState(null);

  const [avatarUploadUrl, setAvatarUploadUrl] = useState(null);

  const [contactsSync, setContactsSync] = useState(false);
  const [contactsPermissionRequested, setContactsPermissionRequested] = useState(false);

  // DPDP consent (must be unchecked by default)
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [showDpdpDetails, setShowDpdpDetails] = useState(false);

  const fileInputRef = useRef(null);

  const oauthReady = useMemo(() => Boolean(oauthProvider), [oauthProvider]);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => {
      const next = Math.min(1, s + 1);
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: next });
      return next;
    });
  }, [dispatch]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => {
      const prev = Math.max(0, s - 1);
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: prev });
      return prev;
    });
  }, [dispatch]);

  const canProceed = useCallback(() => {
    if (step === 0) return phone.length === 10 && otpVerified;

    if (step === 1) {
      const { firstName, lastInitial } = getFirstNameAndLastInitial(`${firstNameInput} ${lastNameInput}`.trim());
      const displayNameOk = Boolean(firstName.trim()) && Boolean(lastInitial);
      // Avatar is auto-assigned if user doesn't upload.
      return displayNameOk && dpdpConsent;
    }

    return false;
  }, [step, phone.length, otpVerified, firstNameInput, lastNameInput, dpdpConsent]);

  const finishOnboarding = () => {
    dispatch({ type: 'SET_DPDP_CONSENT', payload: true });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: TOTAL_STEPS });
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (otpTimeout1Ref.current) clearTimeout(otpTimeout1Ref.current);
      if (otpTimeout2Ref.current) clearTimeout(otpTimeout2Ref.current);
    };
  }, []);

  const sendOtp = () => {
    if (phone.length < 10) return;

    if (otpTimeout1Ref.current) clearTimeout(otpTimeout1Ref.current);
    if (otpTimeout2Ref.current) clearTimeout(otpTimeout2Ref.current);

    setOtpSent(true);
    setShowOtpModal(true);
    setOtpVerified(false);

    otpTimeout1Ref.current = setTimeout(() => {
      setOtp(['4', '8', '2', '7', '1', '5']);

      otpTimeout2Ref.current = setTimeout(() => {
        setOtpVerified(true);
        setShowOtpModal(false);
      }, 800);
    }, 1500);
  };

  const handleOAuth = (provider) => {
    // UI simulation:
    // - store provider
    // - store pending email
    // - allow avatar swipe selection (oauth option becomes available)
    setOauthProvider(provider);
    setPendingOAuthEmail(provider === 'google' ? 'user@gmail.com' : 'user@icloud.com');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUploadUrl(reader.result?.toString() || null);
    };
    reader.readAsDataURL(file);
  };

  const requestContactsSync = () => {
    setContactsPermissionRequested(true);
    // UI simulation: pretend user granted permission
    setTimeout(() => setContactsSync(true), 500);
  };

  return (
    <div className="onboarding-container" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="onboarding-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`onboarding-step ${i < step ? 'completed' : i === step ? 'active' : ''}`} />
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Step {step + 1} of {TOTAL_STEPS}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 520 }}>
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-otp"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', marginBottom: 4 }}>
                Sign up with OTP <span style={{ fontSize: 'var(--text-2xl)' }}>🔐</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 22 }}>
                Mobile number is your primary login method.
              </p>

              {/* Phone */}
              <div className="input-group">
                <label className="input-label">Mobile Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', top: 13, left: 14 }} />
                    <input
                      className="input"
                      style={{ paddingLeft: 40 }}
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      inputMode="numeric"
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
                      <>
                        <CheckCircle2 size={14} /> Verified
                      </>
                    ) : otpSent ? (
                      'Resend'
                    ) : (
                      'Send OTP'
                    )}
                  </motion.button>
                </div>
              </div>

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
                    marginTop: 12,
                  }}
                >
                  <ShieldCheck size={18} color="var(--accent-emerald)" />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-emerald)', fontWeight: 500 }}>
                    Phone verified — you're all set!
                  </span>
                </motion.div>
              )}

              {/* OAuth secondary options */}
              <div style={{ marginTop: 20 }}>
                <div className="divider" style={{ margin: '0 0 14px 0' }} />
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Or continue faster with OAuth (SSO)
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => handleOAuth('google')}
                  >
                    Continue with Google
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => handleOAuth('apple')}
                  >
                    Continue with Apple
                  </motion.button>
                </div>

                {pendingOAuthEmail && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    Mapped provider email (<span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{pendingOAuthEmail}</span>) to your mobile later if needed.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-profile"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', marginBottom: 4 }}>
                Finish your profile <span style={{ fontSize: 'var(--text-2xl)' }}>✨</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 18 }}>
                First name + last initial. No demographics. No cards.
              </p>

              {/* Display name: first name + last initial */}
              <div className="input-group">
                <label className="input-label">Display Name</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: 13, left: 14 }} />
                    <input
                      className="input"
                      style={{ paddingLeft: 40 }}
                      placeholder="First name"
                      value={firstNameInput}
                      onChange={(e) => setFirstNameInput(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      className="input"
                      placeholder="Last name"
                      value={lastNameInput}
                      onChange={(e) => setLastNameInput(e.target.value)}
                      maxLength={24}
                    />
                    <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
                      We’ll only use last initial: <span style={{ color: 'var(--text-primary)' }}>{getFirstNameAndLastInitial(`${firstNameInput} ${lastNameInput}`).lastInitial || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile picture (optional). If not uploaded, avatar is auto-assigned. No preview. */}
              <div style={{ marginTop: 10 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelected}
                />
                <div
                  style={{
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass-bg)',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6, fontFamily: 'var(--font-heading)' }}>
                    Profile picture
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: 12 }}>
                    Upload a selfie (optional). If you don’t, we’ll assign an avatar automatically.
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-ghost"
                    style={{ width: '100%' }}
                    onClick={handleUploadClick}
                  >
                    Upload selfie
                  </motion.button>
                  {avatarUploadUrl && (
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 800 }}>
                      Selfie uploaded.
                    </div>
                  )}
                </div>
              </div>

              {/* Contacts sync */}
              <div style={{ marginTop: 18 }}>
                <div className="divider" style={{ margin: '0 0 14px 0' }} />
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  className="btn btn-ghost"
                  onClick={requestContactsSync}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                    background: contactsSync ? 'rgba(16,185,129,0.08)' : 'var(--glass-bg)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900 }}>
                    <Users size={18} /> Sync Contacts (Invite friends faster)
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: contactsSync ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      fontWeight: 900,
                    }}
                  >
                    {contactsSync ? 'Granted' : contactsPermissionRequested ? 'Requesting…' : 'Allow'}
                  </span>
                </motion.button>
              </div>

              {/* DPDP Consent */}
              <div style={{ marginTop: 18 }}>
                <div className="divider" style={{ margin: '0 0 14px 0' }} />
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Shield size={14} color="var(--accent-secondary)" />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {DPDP_CONSENT_TEXT}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 0 }}>
                      We only use your data to plan trips, coordinate groups, and enable secure payment processing.
                    </p>
                  </div>
                </label>

                <motion.button
                  onClick={() => setShowDpdpDetails(!showDpdpDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 10,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {showDpdpDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showDpdpDetails ? 'Hide details' : 'DPDP details'}
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
                      <div
                        style={{
                          padding: '12px 14px',
                          background: 'rgba(124, 58, 237, 0.05)',
                          border: '1px solid rgba(124, 58, 237, 0.15)',
                          borderRadius: 'var(--radius-md)',
                          marginTop: 10,
                        }}
                      >
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <li style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            ✓ Data used for trip planning and group coordination.
                          </li>
                          <li style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            ✓ Data used for trip payments processing.
                          </li>
                          <li style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            ✓ No credit card linking required at sign up.
                          </li>
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

      <div style={{ display: 'flex', gap: 12, paddingTop: 24, marginTop: 'auto' }}>
        {step > 0 && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn btn-ghost" onClick={goBack} style={{ flex: '0 0 auto' }}>
            <ArrowLeft size={18} />
            Back
          </motion.button>
        )}

        <motion.button
          whileHover={canProceed() ? { scale: 1.02 } : {}}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
          className="btn btn-primary btn-lg"
          style={{ flex: 1, opacity: canProceed() ? 1 : 0.45, pointerEvents: canProceed() ? 'auto' : 'none' }}
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
                style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(124, 58, 237, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Phone size={24} color="var(--accent-secondary)" />
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Verify your phone</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 24 }}>
                OTP sent to +91 {formatMaskedPhone(phone)}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                {otp.map((digit, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: digit ? 1 : 0.9, opacity: 1 }}
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {!otp[0] ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)' }}
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Auto-reading OTP...</span>
                  </>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-emerald)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
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
