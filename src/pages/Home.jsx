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
  Menu,
  Home as HomeIcon,
  Plane,
  MessageCircle,
  CreditCard,
  Settings,
  Shield,
  HelpCircle,
  Copy,
  CheckCircle2,
  Mail,
  Share2,
  QrCode,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LongWeekendDetector from '../components/LongWeekendDetector';
import MomentumAgent from '../components/MomentumAgent';
import { DESTINATIONS } from '../data/mockTravelData';

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
    text: 'Rahul joined the group trip',
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

/* ───── Hamburger Menu Items ───── */
const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon, route: '/' },
  { id: 'plan', label: 'Start Planning', icon: Plane, route: '/start-planning' },
  { id: 'ai', label: 'AI Planner', icon: Sparkles, route: '/ai-planner' },
  { id: 'chat', label: 'Group Chat', icon: MessageCircle, route: '/chat' },

  // Split expense (prototype: route to checkout split flow)
  { id: 'split', label: 'Split Expense', icon: CreditCard, route: '/checkout' },

  // Receipt-related options
  { id: 'receipts-scan', label: 'Scan Receipts', icon: QrCode, route: '/trip?scanner=receipts' },
  { id: 'receipts', label: 'My Receipts', icon: QrCode, route: '/trip?tab=receipts' },
  { id: 'gallery', label: 'Trip Gallery', icon: QrCode, route: '/trip?tab=gallery' },

  { id: 'trip', label: 'Active Trip', icon: MapPin, route: '/trip' },
];

const MENU_ITEMS_SECONDARY = [
  { id: 'privacy', label: 'Privacy (DPDP)', icon: Shield, route: null },
  { id: 'settings', label: 'Settings', icon: Settings, route: null },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, route: null },
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
function PackageAdCard({ ad, index, navigateTo }) {
  const img = ad.image || ad.destinationImage;

  return (
    <motion.div
      className="glass-card"
      style={{
        padding: 0,
        minWidth: 300,
        maxWidth: 340,
        scrollSnapAlign: 'start',
        border: '1px solid var(--glass-border)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        style={{
          width: '100%',
          height: 105,
          borderRadius: 0,
          overflow: 'hidden',
          border: 'none',
          background: 'rgba(255,255,255,0.02)',
          marginBottom: 0,
          position: 'relative',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={ad.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}
          >
            Image
          </div>
        )}

        <div style={{ position: 'absolute', left: 10, top: 10 }}>
          <span
            className="badge badge-amber"
            style={{
              fontSize: 10,
              padding: '6px 10px',
              background: 'rgba(255,138,0,0.14)',
              border: '1px solid rgba(255,138,0,0.22)',
              display: 'inline-flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <TicketPercent size={12} />Deal
          </span>
        </div>
      </div>

      <div style={{ padding: '12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 800, marginBottom: 4 }}>
              {ad.offerTag}
            </div>

          <div style={{ fontSize: 14, fontWeight: 900, fontFamily: 'var(--font-heading)', marginBottom: 3 }}>
            {ad.title}
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            {ad.subtitle}
          </div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <motion.button
            className="btn btn-ghost"
            style={{ padding: '8px 10px' }}
            onClick={() => navigateTo(`/package/${ad.destId || ad.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Home() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showGroupTripModal, setShowGroupTripModal] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const { currentUser, activeTrip, groupMembers } = state;

  const PACKAGE_ADS = useMemo(() => {
    const picks = DESTINATIONS.slice(0, 3);
    const [goa, kerala, rajasthan] = picks;

    return [
      {
        id: 'p1',
        destId: 'goa-beach',
        image: goa?.image,
        title: 'Goa Beach Escape',
        subtitle: 'Flights + beachfront villa bundle (3N/4D) • limited seats',
        offerTag: 'HOT DEAL',
        comparisonPrice: 28999,
        dealPrice: 21999,
        savingsPct: 24,
      },
      {
        id: 'p2',
        destId: 'kerala-backwaters',
        image: kerala?.image,
        title: kerala?.name || 'Kerala Backwater Bliss',
        subtitle: 'Houseboat + stay • kid-friendly rooms + flexible timings',
        offerTag: 'FAMILY PICK',
        comparisonPrice: 34999,
        dealPrice: 26999,
        savingsPct: 23,
      },
      {
        id: 'p3',
        destId: 'rajasthan-royal',
        image: rajasthan?.image,
        title: rajasthan?.name || 'Royal Rajasthan Heritage',
        subtitle: 'Direct flights + hotel suite • optimized for 4 days',
        offerTag: 'LONG WEEKEND',
        comparisonPrice: 59999,
        dealPrice: 45999,
        savingsPct: 23,
      },
    ];
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(activeTrip.inviteCode || 'WANDERZ-A8K3');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!inviteEmail.includes('@')) return;
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setInviteEmail('');
    }, 2500);
  };

  return (
    <div className="page home-prof">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* ─── Top Header with Hamburger ─── */}
        <motion.div
          variants={itemVariants}
          style={{
            position: 'relative',
            top: 0,
            zIndex: 5,
            background: '#ffffff',
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '0 var(--space-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: 'rgba(124,58,237,0.10)',
                  border: '1px solid rgba(124,58,237,0.20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5b21b6',
                  fontWeight: 900,
                }}
              >
                MW
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>WanderZ</div>
                <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  Plan smarter
                </div>
              </div>
            </div>

            {/* Hamburger Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowHamburger(true)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#5b21b6',
              }}
            >
              <Menu size={20} />
            </motion.button>
          </div>

          <div style={{ padding: '10px var(--space-md) 0 var(--space-md)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
              }}
            >
              <motion.button
                className="glass-card"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/start-planning')}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  background: 'rgba(124,58,237,0.06)',
                  border: '1px solid rgba(124,58,237,0.18)',
                  fontWeight: 900,
                  color: '#4c1d95',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Plus size={16} />
                New Trip
              </motion.button>

              <motion.button
                className="glass-card"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowGroupTripModal(true)}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.18)',
                  fontWeight: 900,
                  color: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <ThumbsUp size={16} />
                Group Trip
              </motion.button>

              <motion.button
                className="glass-card"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowJoinModal(true)}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  background: 'rgba(6,182,212,0.06)',
                  border: '1px solid rgba(6,182,212,0.18)',
                  fontWeight: 900,
                  color: '#0891b2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <UserPlus size={16} />
                Join Trip
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ─── Start Planning CTA ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <motion.div
            className="glass-card"
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/start-planning')}
            style={{
              cursor: 'pointer',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.06) 100%)',
              border: '1px solid rgba(124,58,237,0.20)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
              }}>
                <Plane size={22} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                  Start Planning Your Trip
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Set your destination, dates, budget & more
                </div>
              </div>
              <ArrowRight size={20} color="#7c3aed" />
            </div>
          </motion.div>
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
              padding: '0 var(--space-md)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                margin: 0,
                color: '#0f172a',
              }}
            >
              Travel Deals
            </h3>

            <span
              className="badge badge-primary"
              style={{
                fontSize: 11,
                background: 'rgba(124,58,237,0.10)',
                border: '1px solid rgba(124,58,237,0.20)',
                color: '#4c1d95',
              }}
            >
              Swipe for offers
            </span>
          </div>

          <motion.div
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              padding: '0 var(--space-md) 8px var(--space-md)',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
          >
            {PACKAGE_ADS.map((ad, idx) => (
              <PackageAdCard key={ad.id} ad={ad} index={idx} navigateTo={navigate} />
            ))}
          </motion.div>
        </motion.div>

        {/* ─── Active Trips Section ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)',
              padding: '0 var(--space-md)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: '#0f172a',
              }}
            >
              Active Trips
            </h3>
            <span
              className="badge badge-primary"
              style={{
                fontSize: 11,
                background: 'rgba(124,58,237,0.10)',
                border: '1px solid rgba(124,58,237,0.20)',
                color: '#4c1d95',
              }}
            >
              1 active
            </span>
          </div>

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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-aurora)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${DESTINATIONS.find(d => d.name === activeTrip.name)?.image || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(0px)', opacity: 0.18 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,26,0.15) 0%, rgba(10,10,26,0.85) 70%)' }} />

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-heading)' }}>
                  {activeTrip.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <MapPin size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {activeTrip.dates}
                  </span>
                </div>
                <span className="badge badge-amber" style={{ textTransform: 'capitalize' }}>
                  ⏳ {activeTrip.status}
                </span>
              </div>
              <MiniHealthRing percent={20} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--glass-border)' }}>
              <div className="avatar-group">
                {groupMembers.slice(0, 4).map(member => (
                  <div key={member.id} className="avatar avatar-sm" style={{ background: member.color, fontSize: 10, width: 28, height: 28 }}>
                    {member.avatar}
                  </div>
                ))}
                {groupMembers.length > 4 && (
                  <div className="avatar avatar-sm" style={{ background: 'var(--bg-tertiary)', fontSize: 9, width: 28, height: 28, color: 'var(--text-secondary)' }}>
                    +{groupMembers.length - 4}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                <Users size={14} />
                <span>{groupMembers.length} members</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Quick Actions ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-md)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
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
                    if (action.route) navigate(action.route);
                    else setShowJoinModal(true);
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 'var(--space-sm)', padding: 'var(--space-lg) var(--space-md)',
                    cursor: 'pointer', border: '1px solid var(--glass-border)', textAlign: 'center',
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: action.shadow }}>
                    <Icon size={22} color="white" />
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Recent Activity ─── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Recent Activity
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-secondary)', fontWeight: 600, cursor: 'pointer' }}>
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
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                  padding: '14px var(--space-lg)',
                  borderBottom: index < RECENT_ACTIVITY.length - 1 ? '1px solid var(--glass-border)' : 'none',
                }}
              >
                <div className="avatar avatar-sm" style={{ background: activity.avatar === '🤖' ? 'var(--gradient-primary)' : activity.color, fontSize: activity.avatar === '🤖' ? 14 : 10, width: 32, height: 32 }}>
                  {activity.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {activity.text}
                  </p>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
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

      {/* ─── Hamburger Menu Drawer ─── */}
      <AnimatePresence>
        {showHamburger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(10, 10, 26, 0.6)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              zIndex: 100,
            }}
            onClick={() => setShowHamburger(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: 300, maxWidth: '85vw',
                background: '#ffffff',
                boxShadow: '4px 0 30px rgba(0,0,0,0.15)',
                display: 'flex', flexDirection: 'column',
                overflow: 'auto',
              }}
            >
              {/* User Profile */}
              <div style={{
                padding: '24px 20px 16px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.06))',
                borderBottom: '1px solid rgba(124,58,237,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ background: currentUser.color, width: 48, height: 48, fontSize: 16, boxShadow: `0 0 16px ${currentUser.color}44` }}>
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, textTransform: 'capitalize' }}>
                      {state.userRole || 'Traveler'} • {currentUser.city}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Menu */}
              <div style={{ padding: '12px 8px', flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Navigate
                </div>
                {MENU_ITEMS.map(item => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setShowHamburger(false);
                        if (item.route) navigate(item.route);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', padding: '12px 12px',
                        background: 'none', border: 'none',
                        borderRadius: 10, cursor: 'pointer',
                        color: '#0f172a', fontSize: 14, fontWeight: 600,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(124,58,237,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#7c3aed',
                      }}>
                        <Icon size={18} />
                      </div>
                      {item.label}
                    </motion.button>
                  );
                })}

                <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '8px 12px' }} />

                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  More
                </div>
                {MENU_ITEMS_SECONDARY.map(item => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowHamburger(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', padding: '12px 12px',
                        background: 'none', border: 'none',
                        borderRadius: 10, cursor: 'pointer',
                        color: '#64748b', fontSize: 14, fontWeight: 500,
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(100,116,139,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#94a3b8',
                      }}>
                        <Icon size={18} />
                      </div>
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Close */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <button
                  onClick={() => setShowHamburger(false)}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'rgba(124,58,237,0.06)',
                    border: '1px solid rgba(124,58,237,0.15)',
                    borderRadius: 12, cursor: 'pointer',
                    color: '#7c3aed', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <X size={16} /> Close Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Join Trip Modal ─── */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(10, 10, 26, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)' }}
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div className="glass-card-elevated" initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 380 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Join a Trip</h3>
                <button onClick={() => setShowJoinModal(false)} style={{ background: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-full)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={16} />
                </button>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
                Enter the invite code shared by your trip organizer to join their group.
              </p>
              <div className="input-group">
                <label className="input-label">Invite Code</label>
                <input className="input" type="text" placeholder="e.g. WANDERZ-ABCD" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} style={{ textAlign: 'center', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }} />
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-sm)' }} onClick={() => { setShowJoinModal(false); setInviteCode(''); }}>
                <ArrowRight size={18} /> Join Trip
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Group Trip Management Modal ─── */}
      <AnimatePresence>
        {showGroupTripModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(10, 10, 26, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)' }}
            onClick={() => setShowGroupTripModal(false)}
          >
            <motion.div
              className="glass-card-elevated"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 420, maxHeight: '85vh', overflow: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  <Users size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  Group Trip
                </h3>
                <button onClick={() => setShowGroupTripModal(false)} style={{ background: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-full)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Share Code */}
              <div style={{ padding: '16px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                  <Share2 size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Share Invite Code
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    flex: 1, padding: '14px 16px',
                    background: 'rgba(255,255,255,0.9)',
                    border: '2px dashed rgba(124,58,237,0.30)',
                    borderRadius: 10,
                    textAlign: 'center',
                    fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.15em', color: '#4c1d95',
                  }}>
                    {activeTrip.inviteCode || 'WANDERZ-A8K3'}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyCode}
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: codeCopied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.10)',
                      border: `1px solid ${codeCopied ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: codeCopied ? '#059669' : '#7c3aed',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {codeCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </motion.button>
                </div>
                {codeCopied && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
                    Code copied to clipboard!
                  </motion.div>
                )}
              </div>

              {/* Invite via Email */}
              <div style={{ padding: '16px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                  <Mail size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Invite via Email
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', top: 12, left: 12 }} />
                    <input
                      className="input"
                      style={{ paddingLeft: 36, fontSize: 13 }}
                      type="email"
                      placeholder="friend@email.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`btn ${emailSent ? 'btn-emerald' : 'btn-primary'}`}
                    onClick={handleSendEmail}
                    disabled={emailSent}
                    style={{ whiteSpace: 'nowrap', fontSize: 12, padding: '10px 14px' }}
                  >
                    {emailSent ? <><CheckCircle2 size={14} /> Sent!</> : 'Send'}
                  </motion.button>
                </div>
              </div>

              {/* Current Members */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Current Members ({groupMembers.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {groupMembers.map(m => (
                    <div key={m.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.5)',
                      border: '1px solid var(--glass-border)',
                    }}>
                      <div className="avatar avatar-sm" style={{ background: m.color, width: 28, height: 28, fontSize: 10 }}>
                        {m.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.city}</div>
                      </div>
                      <span className={`badge ${m.role === 'organizer' ? 'badge-primary' : 'badge-emerald'}`} style={{ fontSize: 9, padding: '2px 8px' }}>
                        {m.role === 'organizer' ? 'Organizer' : 'Member'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-full" onClick={() => { setShowGroupTripModal(false); navigate('/vote'); }}>
                <ThumbsUp size={16} /> Go to Group Voting <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
