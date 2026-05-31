import { useMemo } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GROUP_MEMBERS } from '../data/mockTravelData';
import '../index.css';

function statusFromPreAuth(preAuths, userId) {
  const status = preAuths?.[userId];
  if (status === 'authorized') return 'authorized';
  if (status === 'declined') return 'declined';
  if (status) return 'pending';
  return 'unopened';
}

function StatusDot({ status }) {
  const common = {
    width: 30,
    height: 30,
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--bg-primary)',
    position: 'relative',
    flexShrink: 0,
  };

  if (status === 'authorized') {
    return (
      <div style={{ ...common, background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)' }}>
        <CheckCircle2 size={18} />
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div style={{ ...common, background: 'rgba(245,158,11,0.16)', color: 'var(--accent-amber)' }}>
        <Clock size={18} />
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div style={{ ...common, background: 'rgba(255,107,107,0.14)', color: 'var(--accent-coral)' }}>
        <XCircle size={18} />
      </div>
    );
  }

  return (
    <div style={{ ...common, background: 'var(--glass-bg)', color: 'var(--text-muted)' }}>
      <span style={{ fontWeight: 900, fontSize: 12 }}>•</span>
    </div>
  );
}

export default function PeerAccountabilityTracker() {
  const { state } = useApp();
  const preAuths = state.preAuths || {};

  const members = state.groupMembers?.length ? state.groupMembers : GROUP_MEMBERS;

  const items = useMemo(() => {
    return members.map((m) => {
      const s = statusFromPreAuth(preAuths, m.id);
      return { ...m, status: s };
    });
  }, [members, preAuths]);

  return (
    <div className="glass-card" style={{ padding: 16, marginBottom: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)' }}>
            Live Peer Accountability
          </h3>
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
            Who’s holding the line for the group authorization
          </div>
        </div>
        <span className="badge badge-primary" style={{ fontSize: 10 }}>
          Real-time (prototype)
        </span>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
        {items.map((m) => (
          <div
            key={m.id}
            style={{
              minWidth: 104,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StatusDot status={m.status} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 800, textAlign: 'center' }}>
              {m.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
              {m.status === 'authorized'
                ? 'Authorized'
                : m.status === 'pending'
                  ? 'Paying'
                  : m.status === 'declined'
                    ? 'Declined'
                    : "Hasn’t opened"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
