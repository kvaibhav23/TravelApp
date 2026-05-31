import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, IndianRupee, ChevronDown, ChevronUp, Plane } from 'lucide-react';
import { GROUP_MEMBERS, DESTINATIONS } from '../data/mockTravelData';
import '../index.css';

function MetricRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{value}</span>
    </div>
  );
}

function DeltaPill({ delta }) {
  const abs = Math.abs(delta);
  const isOver = delta > 0; // cost - budget
  return (
    <span
      className="badge"
      style={{
        padding: '4px 8px',
        background: isOver ? 'rgba(255,107,107,0.18)' : 'rgba(16,185,129,0.16)',
        border: `1px solid ${isOver ? 'rgba(255,107,107,0.3)' : 'rgba(16,185,129,0.3)'}`,
        color: isOver ? 'var(--accent-coral)' : 'var(--accent-emerald)',
        fontWeight: 800,
      }}
    >
      {isOver ? `Over ₹${abs.toLocaleString('en-IN')}` : `Saves ₹${abs.toLocaleString('en-IN')}`}
    </span>
  );
}

export default function ComparePackagesTable({
  destinations = DESTINATIONS,
  compareCount = 3,
  groupBudgetPerPerson = null,
}) {
  const [open, setOpen] = useState(true);

  const groupBudget = useMemo(() => {
    if (groupBudgetPerPerson != null && Number.isFinite(groupBudgetPerPerson)) return groupBudgetPerPerson;
    // MVP: use min budget among group members as "max budget" anchor
    return Math.min(...GROUP_MEMBERS.map((m) => m.budget));
  }, [groupBudgetPerPerson]);

  const rows = useMemo(() => {
    return destinations.slice(0, compareCount);
  }, [destinations, compareCount]);

  return (
    <div className="glass-card" style={{ padding: 16, marginBottom: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)' }}>Compare Packages</h3>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
            Side-by-side on price, rating, duration & flight type
          </div>
        </div>

        <motion.button
          className="btn btn-ghost"
          style={{ padding: '10px 12px' }}
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span style={{ fontSize: 11, fontWeight: 800 }}>{open ? 'Hide' : 'Show'}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 14 }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))`,
                gap: 10,
              }}
            >
              {rows.map((d) => {
                const delta = Math.round(d.pricePerPerson - groupBudget);
                const direct = d.flights?.type?.toLowerCase?.().includes('direct');
                return (
                  <div
                    key={d.id}
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--glass-border)',
                      background: 'var(--glass-bg)',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ height: 90, position: 'relative' }}>
                      <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent, rgba(10,10,26,0.92))',
                        }}
                      />
                      <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 900, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {d.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-amber)', fontWeight: 900, fontSize: 11 }}>
                            <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                            {d.rating}
                          </div>
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.duration}</span>
                          <DeltaPill delta={delta} />
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <MetricRow label="Price" value={`₹${d.pricePerPerson.toLocaleString('en-IN')}`} />
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <MapPin size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {d.location}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Plane size={12} color={direct ? 'var(--accent-emerald)' : 'var(--accent-amber)'} />
                        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 800 }}>
                          {direct ? 'Direct' : 'Via'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Clock size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 800 }}>
                          {d.duration}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Anchor budget</div>
                        <div style={{ fontSize: 10, color: 'var(--text-primary)', fontWeight: 900 }}>
                          ₹{groupBudget.toLocaleString('en-IN')}/person
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
