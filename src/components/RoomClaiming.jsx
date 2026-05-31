import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Users, IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GROUP_MEMBERS } from '../data/mockTravelData';
import '../index.css';

export default function RoomClaiming({ destination }) {
  const { state, dispatch } = useApp();
  const currentUser = state.currentUser;

  // Pre-seed demo claims on first render
  const roomClaims = useMemo(() => {
    const claims = { ...state.roomClaims };
    // Pre-claim for demo: u2 → r2, u3 → r3
    if (!claims['r2']) claims['r2'] = 'u2';
    if (!claims['r3']) claims['r3'] = 'u3';
    return claims;
  }, [state.roomClaims]);

  const rooms = destination?.rooms || [];

  const getMember = (userId) => GROUP_MEMBERS.find((m) => m.id === userId);

  const userAlreadyClaimed = Object.entries(roomClaims).find(
    ([, userId]) => userId === currentUser.id
  );

  const handleClaim = (roomId) => {
    const claimedBy = roomClaims[roomId];

    // If this room is claimed by someone else, can't claim it
    if (claimedBy && claimedBy !== currentUser.id) return;

    // If the user already claimed a different room, ignore (one room per user)
    if (userAlreadyClaimed && userAlreadyClaimed[0] !== roomId) return;

    // If unclaiming own room
    if (claimedBy === currentUser.id) {
      dispatch({
        type: 'CLAIM_ROOM',
        payload: { roomId, userId: null },
      });
      return;
    }

    // Claim the room
    dispatch({
      type: 'CLAIM_ROOM',
      payload: { roomId, userId: currentUser.id },
    });
  };

  const totalCost = useMemo(() => {
    return rooms.reduce((sum, room) => {
      const claimant = roomClaims[room.id];
      if (claimant) {
        return sum + room.price;
      }
      return sum;
    }, 0);
  }, [rooms, roomClaims]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '4px' }}>
          🏨 Claim Your Room
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          {destination.hotel.name} • {destination.hotel.type}
        </p>
      </div>

      <div className="room-grid">
        {rooms.map((room, index) => {
          const claimedBy = roomClaims[room.id];
          const claimant = claimedBy ? getMember(claimedBy) : null;
          const isClaimedByYou = claimedBy === currentUser.id;
          const isClaimed = !!claimedBy;
          const canClaim =
            !isClaimed || isClaimedByYou;
          const isDisabled = isClaimed && !isClaimedByYou;

          let cardClass = 'room-card';
          if (isClaimedByYou) cardClass += ' claimed-by-you';
          else if (isClaimed) cardClass += ' claimed';

          return (
            <motion.div
              key={room.id}
              className={cardClass}
              onClick={() => !isDisabled && handleClaim(room.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={canClaim ? { scale: 1.03, y: -2 } : {}}
              whileTap={canClaim ? { scale: 0.97 } : {}}
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled && !isClaimedByYou ? 0.8 : 1,
              }}
            >
              {/* Room emoji */}
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{room.image}</div>

              {/* Room name */}
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '6px' }}>
                {room.name}
              </h4>

              {/* Price */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  marginBottom: '4px',
                }}
              >
                <IndianRupee size={13} color="var(--accent-emerald)" />
                <span
                  style={{
                    fontWeight: 700,
                    color: 'var(--accent-emerald)',
                    fontSize: 'var(--text-base)',
                  }}
                >
                  {room.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Capacity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-xs)',
                  marginBottom: '10px',
                }}
              >
                <Users size={12} />
                <span>{room.capacity} guests</span>
              </div>

              {/* Claimed state */}
              <AnimatePresence mode="wait">
                {isClaimed && claimant ? (
                  <motion.div
                    key="claimed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <div
                      className="avatar avatar-sm"
                      style={{ background: claimant.color }}
                    >
                      {claimant.avatar}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        color: isClaimedByYou
                          ? 'var(--accent-secondary)'
                          : 'var(--accent-emerald)',
                        fontWeight: 600,
                      }}
                    >
                      {isClaimedByYou ? '✓ You' : `${claimant.name.split(' ')[0]}`}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unclaimed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(124, 58, 237, 0.15)',
                      color: 'var(--accent-secondary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                    }}
                  >
                    Tap to claim
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Total Cost */}
      <motion.div
        className="glass-card"
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Total Room Cost
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {Object.values(roomClaims).filter(Boolean).length}/{rooms.length} rooms claimed
            </span>
          </div>
        </div>
        <motion.span
          key={totalCost}
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--accent-emerald)',
          }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          ₹{totalCost.toLocaleString('en-IN')}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
