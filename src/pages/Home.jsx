import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  UserPlus,
  Sparkles,
  ThumbsUp,
  ChevronRight,
  Users,
  MapPin,
  X,
  ArrowRight,
  TicketPercent,
  Zap,
  Tags,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LongWeekendDetector from '../components/LongWeekendDetector';
import MomentumAgent from '../components/MomentumAgent';
import '../index.css';

/* ───── Animation Variants ───── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
  },
};

/* ───── Mock Activity Data ───── */
const RECENT_ACTIVITY = [
  {
    id: 'a1',
    text: 'Priya voted 👍 on Goa Beach Escape',
    time: '2m ago',
    color: '#06b6d4',
    avatar: 'PS',
  },
  {
    id: 'a2',
    text: 'Neha shared Kerala Backwaters in chat',
    time: '15m ago',
    color: '#f59e0b',
    avatar: 'NG',
  },
  {
    id: 'a3',
    text: 'Rahul completed KYC verification',
    time: '1h ago',
    color: '#10b981',
    avatar: 'RS',
  },
  {
    id: 'a4',
    text: 'AI detected August 15 long weekend',
    time: '2h ago',
    color: '#7c3aed',
    avatar: '🤖',
  },
];

/* ───── Quick Actions Data ───── */
const QUICK_ACTIONS = [
  {
    id: 'create',
    label: 'Create Trip',
    icon: Plus,
    bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    shadow: '0 0 20px rgba(124,58,237,0.35)',
    route: '/onboarding',
  },
  {
    id: 'join',
    label: 'Join Trip',
    icon: UserPlus,
    bg: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
    shadow: '0 0 20px rgba(6,182,212,0.35)',
    route: null, // opens modal
  },
  {
    id: 'ai',
    label: 'AI Planner',
    icon: Sparkles,
    bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    shadow: '0 0 20px rgba(255,107,107,0.35)',
    route: '/ai-planner',
  },
  {
    id: 'vote',
    label: 'Vote Now',
    icon: ThumbsUp,
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    shadow: '0 0 20px rgba(16,185,129,0.35)',
    route: '/vote',
  },
];

/* ───── Mini Health Ring ───── */
function MiniHealthRing({ percent = 20 }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="url(#miniHealthGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
        <defs>
          <linearGradient id="miniHealthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-emerald)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 11,
          fontFamily: 'var(--font-heading)',
          color: 'var(--text-primary)',
        }}
      >
        {percent}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE COMPONENT
   ═══════════════════════════════════════════ */
function PackageAdCard({ ad, index }) {
  return (
    <motion.div
      className="glass-card"
      style={{
        padding: '14px 14px',
        minWidth: 300,
        maxWidth: 340,
        scrollSnapAlign: 'start',
        border: '1px solid var(--glass-border)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileTap={{ scale: 0.99 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              className="badge badge-amber"
              style={{
                fontSize: 10,
                padding: '6px 10px',
                background: 'rgba(255,138,0,0.14)',
                border: '1px solid rgba(255,138,0,0.22)',
              }}
            >
              <TicketPercent size={12} /> Deal
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>
              {ad.offerTag}
            </span>
          </div>

          <div style={{ fontSize: 14, fontWeight: 900, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
            {ad.title}
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {ad.subtitle}
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 22px rgba(255,77,77,0.25)',
              color: 'white',
            }}
            aria-hidden="true"
          >
            <Zap size={18} />
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textDecoration: 'line-through' }}>
              ₹{ad.comparisonPrice.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 950 }}>
              ₹{ad.dealPrice.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--accent-emerald)', fontWeight: 800 }}>
              save {ad.savingsPct}%
            </div>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: '12px 0 10px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }}>
          <Tags size={14} />
          {ad.smallMeta}
        </div>
        <motion.button
          className="btn btn-ghost"
          style={{ padding: '8px 10px' }}
          onClick={() => ad.route ? navigate(ad.route) : undefined}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function Home() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const { currentUser, activeTrip, groupMembers } = state;

  const PACKAGE_ADS = useMemo(() => ([
    {
      id: 'p1',
      title: 'Goa Beach Escape',
      subtitle: 'Flights + beachfront villa bundle (3N/4D) • limited seats',
      offerTag: 'HOT DEAL',
      comparisonPrice: 28999,
      dealPrice: 21999,
      savingsPct: 24,
      smallMeta: 'Book in 2 mins',
      route: '/vote',
    },
    {
      id: 'p2',
      title: 'Kerala Backwaters Family Plan',
      subtitle: 'Houseboat + stay • kid-friendly rooms + flexible timings',
      offerTag: 'FAMILY PICK',
      comparisonPrice: 34999,
      dealPrice: 26999,
      savingsPct: 23,
      smallMeta: 'Best for groups',
      route: '/ai-planner',
    },
    {
      id: 'p3',
      title: 'Dubai Long Weekend Spark',
      subtitle: 'Direct flights + hotel suite • optimized for 4 days',
      offerTag: 'LONG WEEKEND',
      comparisonPrice: 59999,
      dealPrice: 45999,
      savingsPct: 23,
      smallMeta: 'Fastest checkout',
      route: '/vote',
    },
  ]), [navigate]);

  return (
    <div className="page">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* ─── Hero Section ─── */}
        <motion.div variants={itemVariants} className="page-header" style={{ paddingBottom: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <motion.h1
                className="page-title text-gradient"
                style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.2 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Welcome back, {currentUser.name.split(' ')[0]}
              </motion.h1>
              <motion.p
                className="page-subtitle"
                style={{ marginTop: 6 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Your next adventure awaits ✨
              </motion.p>
            </div>
            {/* User avatar */}
            <motion.div
              className="avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                background: currentUser.color,
                fontSize: 'var(--text-sm)',
                width: 44,
                height: 44,
                boxShadow: `0 0 16px ${currentUser.color}44`,
              }}
            >
              {currentUser.avatar}
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Long Weekend Detector ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <LongWeekendDetector />
        </motion.div>

        {/* ─── Package Ads (swipe left offers) ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)',
              gap: 12,
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                margin: 0,
              }}
            >
              Travel Deals
            </h3>

            <span className="badge badge-primary" style={{ fontSize: 11 }}>
              Swipe for offers
            </span>
          </div>

          <motion.div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 8,
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
          >
            {PACKAGE_ADS.map((ad, idx) => (
              <PackageAdCard key={ad.id} ad={ad} index={idx} />
            ))}
          </motion.div>

          <div style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.4 }}>
            OTA-style demo: deals show comparison price + savings, without overwhelming the user.
          </div>
        </motion.div>

        {/* ─── Active Trips Section ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Active Trips
            </h3>
            <span className="badge badge-primary">1 active</span>
          </div>

          {/* Trip Card */}
          <motion.div
            className="glass-card"
            variants={scaleIn}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/chat')}
            style={{
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              padding: 'var(--space-lg)',
            }}
          >
            {/* Gradient accent top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'var(--gradient-aurora)',
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--space-md)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 700,
                    marginBottom: 6,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {activeTrip.name}
                </h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <MapPin size={13} color="var(--text-muted)" />
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {activeTrip.dates}
                  </span>
                </div>

                {/* Status badge */}
                <span className="badge badge-amber" style={{ textTransform: 'capitalize' }}>
                  ⏳ {activeTrip.status}
                </span>
              </div>

              {/* Mini Health Score */}
              <MiniHealthRing percent={20} />
            </div>

            {/* Bottom row: avatars + arrow */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'var(--space-md)',
                paddingTop: 'var(--space-md)',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              {/* Avatar group */}
              <div className="avatar-group">
                {groupMembers.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="avatar avatar-sm"
                    style={{
                      background: member.color,
                      fontSize: 10,
                      width: 28,
                      height: 28,
                    }}
                  >
                    {member.avatar}
                  </div>
                ))}
                {groupMembers.length > 4 && (
                  <div
                    className="avatar avatar-sm"
                    style={{
                      background: 'var(--bg-tertiary)',
                      fontSize: 9,
                      width: 28,
                      height: 28,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    +{groupMembers.length - 4}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--accent-secondary)',
                  fontWeight: 600,
                }}
              >
                <Users size={14} />
                <span>{groupMembers.length} members</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Quick Actions ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <h3
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              marginBottom: 'var(--space-md)',
            }}
          >
            Quick Actions
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-md)',
            }}
          >
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  className="glass-card"
                  variants={scaleIn}
                  custom={index}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (action.route) {
                      navigate(action.route);
                    } else {
                      setShowJoinModal(true);
                    }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    padding: 'var(--space-lg) var(--space-md)',
                    cursor: 'pointer',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      background: action.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: action.shadow,
                    }}
                  >
                    <Icon size={22} color="white" />
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Recent Activity ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Recent Activity
            </h3>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View all
            </span>
          </div>

          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {RECENT_ACTIVITY.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: '14px var(--space-lg)',
                  borderBottom:
                    index < RECENT_ACTIVITY.length - 1
                      ? '1px solid var(--glass-border)'
                      : 'none',
                }}
              >
                <div
                  className="avatar avatar-sm"
                  style={{
                    background:
                      activity.avatar === '🤖'
                        ? 'var(--gradient-primary)'
                        : activity.color,
                    fontSize: activity.avatar === '🤖' ? 14 : 10,
                    width: 32,
                    height: 32,
                  }}
                >
                  {activity.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {activity.text}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── Momentum Agent ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-xl)' }}>
          <MomentumAgent />
        </motion.div>
      </motion.div>

      {/* ─── Join Trip Modal ─── */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 10, 26, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-lg)',
            }}
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              className="glass-card-elevated"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 380,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Join a Trip
                </h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  style={{
                    background: 'var(--glass-bg-strong)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-full)',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-lg)',
                  lineHeight: 1.5,
                }}
              >
                Enter the invite code shared by your trip organizer to join their group.
              </p>

              <div className="input-group">
                <label className="input-label">Invite Code</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. WANDERZ-ABCD"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  style={{
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                />
              </div>

              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: 'var(--space-sm)' }}
                onClick={() => {
                  setShowJoinModal(false);
                  setInviteCode('');
                }}
              >
                <ArrowRight size={18} />
                Join Trip
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
