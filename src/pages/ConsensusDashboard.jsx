import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Lock,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  PartyPopper,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS, VOTES, GROUP_MEMBERS } from '../data/mockTravelData';
import RoomClaiming from '../components/RoomClaiming';
import ItineraryCard from '../components/ItineraryCard';
import '../index.css';

/* ---- Confetti Animation ---- */
function ConfettiOverlay() {
  const confettiPieces = useMemo(() => {
    const colors = ['#7c3aed', '#a78bfa', '#10b981', '#f59e0b', '#ff6b6b', '#06b6d4', '#f43f5e'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: piece.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: piece.color,
          }}
        />
      ))}
    </div>
  );
}

/* ---- Vote Bar Chart ---- */
function VoteBar({ destId, upCount, downCount, totalVoters, delay }) {
  const total = upCount + downCount;
  const upPct = total > 0 ? (upCount / total) * 100 : 0;
  const downPct = total > 0 ? (downCount / total) * 100 : 0;
  const winPct = totalVoters > 0 ? Math.round((upCount / totalVoters) * 100) : 0;

  const upVoters = (VOTES[destId]?.up || []).map((uid) =>
    GROUP_MEMBERS.find((m) => m.id === uid)
  ).filter(Boolean);

  const downVoters = (VOTES[destId]?.down || []).map((uid) =>
    GROUP_MEMBERS.find((m) => m.id === uid)
  ).filter(Boolean);

  return (
    <div style={{ marginTop: '10px' }}>
      {/* Bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {/* Up bar */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '24px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.6))',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '8px',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.max(upPct, 8)}%` }}
              transition={{ duration: 0.8, delay: delay, ease: 'easeOut' }}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-emerald)', whiteSpace: 'nowrap' }}>
                <ThumbsUp size={10} style={{ marginRight: '3px', display: 'inline' }} />
                {upCount}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Down bar */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '24px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,107,107,0.3), rgba(255,107,107,0.6))',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '8px',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.max(downPct, downCount > 0 ? 8 : 0)}%` }}
              transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeOut' }}
            >
              {downCount > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-coral)', whiteSpace: 'nowrap' }}>
                  <ThumbsDown size={10} style={{ marginRight: '3px', display: 'inline' }} />
                  {downCount}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Voter avatars */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {upVoters.map((v) => (
            <div
              key={v.id}
              className="avatar"
              style={{
                width: '22px',
                height: '22px',
                fontSize: '9px',
                background: v.color,
                border: '1.5px solid var(--bg-secondary)',
              }}
              title={v.name}
            >
              {v.avatar}
            </div>
          ))}
          {upVoters.length === 0 && (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>No likes yet</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {downVoters.map((v) => (
            <div
              key={v.id}
              className="avatar"
              style={{
                width: '22px',
                height: '22px',
                fontSize: '9px',
                background: v.color,
                border: '1.5px solid var(--bg-secondary)',
                opacity: 0.7,
              }}
              title={v.name}
            >
              {v.avatar}
            </div>
          ))}
        </div>
      </div>

      {/* Win % */}
      <div style={{ textAlign: 'right', marginTop: '4px' }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: winPct >= 70 ? 'var(--accent-emerald)' : 'var(--text-secondary)',
          }}
        >
          {winPct}% approval
        </span>
      </div>
    </div>
  );
}

/* ---- Main Dashboard ---- */
export default function ConsensusDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const votes = state.votes || VOTES;
  const lockedItinerary = state.lockedItinerary;

  const totalVoters = GROUP_MEMBERS.length;

  // Sort destinations by popularity
  const rankedDestinations = useMemo(() => {
    return [...DESTINATIONS]
      .map((dest) => {
        const v = votes[dest.id] || { up: [], down: [] };
        const upCount = v.up.length;
        const downCount = v.down.length;
        const approval = totalVoters > 0 ? (upCount / totalVoters) * 100 : 0;
        return { ...dest, upCount, downCount, approval };
      })
      .sort((a, b) => b.approval - a.approval || b.upCount - a.upCount);
  }, [votes, totalVoters]);

  const winner = rankedDestinations[0];
  const consensusReached = winner && winner.approval > 70;

  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce((sum, v) => sum + v.up.length + v.down.length, 0);
  }, [votes]);

  const handleLockItinerary = () => {
    const dest = DESTINATIONS.find((d) => d.id === winner.id);
    dispatch({ type: 'LOCK_ITINERARY', payload: dest });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div className="page">
      {showConfetti && <ConfettiOverlay />}

      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <BarChart3 size={22} color="var(--accent-secondary)" />
          <h1 className="page-title text-gradient" style={{ fontSize: 'var(--text-2xl)' }}>
            Group Consensus
          </h1>
        </div>
        <p className="page-subtitle">
          {totalVotes} votes cast by {GROUP_MEMBERS.length} members
        </p>
      </motion.div>

      {/* Consensus Reached banner */}
      <AnimatePresence>
        {consensusReached && !lockedItinerary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 14, -14, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <PartyPopper size={28} color="var(--accent-emerald)" />
            </motion.div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                🎉 Consensus Reached!
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <strong>{winner.name}</strong> has {Math.round(winner.approval)}% approval
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked Itinerary */}
      <AnimatePresence>
        {lockedItinerary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '24px' }}
          >
            <ItineraryCard destination={lockedItinerary} />

            <div style={{ marginTop: 16 }}>
              <motion.button
                className="btn btn-emerald btn-lg btn-full"
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{ gap: 8 }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </motion.button>
            </div>

            <div className="divider" />

            <RoomClaiming destination={lockedItinerary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destination list */}
      {!lockedItinerary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rankedDestinations.map((dest, index) => {
            const isWinner = index === 0 && consensusReached;
            const isExpanded = expandedId === dest.id;

            return (
              <motion.div
                key={dest.id}
                className="glass-card"
                style={{
                  padding: '16px',
                  border: isWinner
                    ? '1px solid rgba(16,185,129,0.4)'
                    : '1px solid var(--glass-border)',
                  background: isWinner
                    ? 'rgba(16,185,129,0.08)'
                    : 'var(--glass-bg)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                {/* Top row: rank, image, name, expand */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : dest.id)}
                >
                  {/* Rank */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      background: isWinner
                        ? 'var(--accent-emerald)'
                        : index === 1
                        ? 'var(--accent-amber)'
                        : 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 'var(--text-xs)',
                      color: isWinner || index === 1 ? 'white' : 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    {isWinner ? <Trophy size={14} /> : `#${index + 1}`}
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />

                  {/* Name + approval */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dest.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      ₹{dest.pricePerPerson.toLocaleString('en-IN')}/person • {dest.duration}
                    </div>
                  </div>

                  {/* Approval % */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        color:
                          dest.approval > 70
                            ? 'var(--accent-emerald)'
                            : dest.approval > 40
                            ? 'var(--accent-amber)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {Math.round(dest.approval)}%
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={16} color="var(--text-muted)" />
                  ) : (
                    <ChevronDown size={16} color="var(--text-muted)" />
                  )}
                </div>

                {/* Expanded: vote bar chart */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <VoteBar
                        destId={dest.id}
                        upCount={dest.upCount}
                        downCount={dest.downCount}
                        totalVoters={totalVoters}
                        delay={0}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick mini bar (always visible) */}
                {!isExpanded && (
                  <div style={{ marginTop: '10px' }}>
                    <div
                      style={{
                        display: 'flex',
                        height: '6px',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        gap: '2px',
                      }}
                    >
                      <motion.div
                        style={{
                          background: 'var(--accent-emerald)',
                          borderRadius: 'var(--radius-full)',
                        }}
                        initial={{ width: '0%' }}
                        animate={{
                          width:
                            dest.upCount + dest.downCount > 0
                              ? `${(dest.upCount / (dest.upCount + dest.downCount)) * 100}%`
                              : '0%',
                        }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      />
                      <motion.div
                        style={{
                          background: 'var(--accent-coral)',
                          borderRadius: 'var(--radius-full)',
                        }}
                        initial={{ width: '0%' }}
                        animate={{
                          width:
                            dest.upCount + dest.downCount > 0
                              ? `${(dest.downCount / (dest.upCount + dest.downCount)) * 100}%`
                              : '0%',
                        }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
                      />
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lock Itinerary Button */}
      {consensusReached && !lockedItinerary && (
        <motion.div
          style={{ marginTop: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="btn btn-emerald btn-lg btn-full"
            onClick={handleLockItinerary}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(16,185,129,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={{ gap: '8px' }}
          >
            <Lock size={18} />
            Lock Itinerary — {winner.name}
          </motion.button>
        </motion.div>
      )}

      {/* Member breakdown */}
      {!lockedItinerary && (
        <motion.div
          className="glass-card"
          style={{ marginTop: '24px', padding: '16px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
            Group Members
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {GROUP_MEMBERS.map((member) => {
              const memberVoteCount = Object.values(votes).reduce((sum, v) => {
                return sum + (v.up.includes(member.id) ? 1 : 0) + (v.down.includes(member.id) ? 1 : 0);
              }, 0);

              return (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      width: '24px',
                      height: '24px',
                      fontSize: '9px',
                      background: member.color,
                    }}
                  >
                    {member.avatar}
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>
                    {member.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {memberVoteCount}/{DESTINATIONS.length}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
