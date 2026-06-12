import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../index.css';

export default function RoomClaiming({ destination }) {
  const { state } = useApp();

  const rooms = destination?.rooms || [];

  // Keep existing demo claims logic only for computing totals (UI removed).
  const roomClaims = useMemo(() => {
    const claims = { ...state.roomClaims };
    if (!claims['r2']) claims['r2'] = 'u2';
    if (!claims['r3']) claims['r3'] = 'u3';
    return claims;
  }, [state.roomClaims]);

  const totalCost = useMemo(() => {
    return rooms.reduce((sum, room) => {
      const claimant = roomClaims[room.id];
      if (claimant) return sum + room.price;
      return sum;
    }, 0);
  }, [rooms, roomClaims]);

  const claimedCount = Object.values(roomClaims).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Room selection UI intentionally hidden */}
      <div className="glass-card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
              Room Cost (fixed by prototype)
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
              {claimedCount}/{rooms.length} rooms considered
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <IndianRupee size={14} color="var(--accent-emerald)" />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--accent-emerald)' }}>
              ₹{totalCost.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
