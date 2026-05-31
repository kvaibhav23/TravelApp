import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plane, Hotel, Shield, IndianRupee } from 'lucide-react';
import '../index.css';

function AccordionSection({ title, icon, open, onToggle, children }) {
  return (
    <div style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        className="btn btn-ghost"
        style={{
          width: '100%',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderRadius: 0,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
            {icon}
          </span>
          <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-primary)' }}>{title}</span>
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ padding: '0 14px 14px' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LineItem({ label, amount }) {
  return (
    <div className="ledger-item">
      <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 900 }}>
        ₹{amount.toLocaleString('en-IN')}
      </span>
    </div>
  );
}

export default function TripReceiptAccordion({ destination, roomClaims, peopleCount = 1 }) {
  const itinerary = destination || {};
  const rooms = itinerary.rooms || itinerary?.hotel?.rooms || [];
  const claimedRooms = useMemo(() => {
    const claims = roomClaims || {};
    const ids = Object.entries(claims)
      .filter(([, userId]) => userId)
      .map(([roomId]) => roomId);
    return ids.map((roomId) => rooms.find((r) => r.id === roomId)).filter(Boolean);
  }, [roomClaims, rooms]);

  const hotelShare = useMemo(() => {
    const sum = claimedRooms.reduce((acc, r) => acc + (r.price || 0), 0);
    if (sum > 0) return sum;
    const fallback = rooms[0]?.price || Math.round((itinerary.pricePerPerson || 9000) * 0.55);
    return fallback;
  }, [claimedRooms, rooms, itinerary.pricePerPerson]);

  const flightsShare = useMemo(() => {
    const perPerson = itinerary.pricePerPerson || 9000;
    const proxy = Math.round(perPerson * 0.45);
    return proxy;
  }, [itinerary.pricePerPerson]);

  const fees = useMemo(() => {
    const perPerson = itinerary.pricePerPerson || 9000;
    const gst = Math.round((perPerson * 0.12) * 1);
    const platform = 499;
    return gst + platform;
  }, [itinerary.pricePerPerson]);

  const totalPerPerson = useMemo(() => {
    const per = Math.round((itinerary.pricePerPerson || 9000) + (itinerary.pricePerPerson || 9000) * 0.12 + 499);
    return per;
  }, [itinerary.pricePerPerson]);

  const [openSection, setOpenSection] = useState('flights');

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>Receipt</div>
          <div style={{ fontSize: 14, fontWeight: 900, marginTop: 4, color: 'var(--text-primary)' }}>
            Itemized flights + accommodation + fees
          </div>
        </div>
        <span className="badge badge-emerald" style={{ fontSize: 10 }}>
          <Shield size={12} /> Verified (demo)
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AccordionSection
          title="Flights"
          icon={<Plane size={16} />}
          open={openSection === 'flights'}
          onToggle={() => setOpenSection((s) => (s === 'flights' ? '' : 'flights'))}
        >
          <LineItem label="Indigo Flight 6E-212 (prototype)" amount={flightsShare} />
        </AccordionSection>

        <AccordionSection
          title="Hotel / Villa Share"
          icon={<Hotel size={16} />}
          open={openSection === 'hotel'}
          onToggle={() => setOpenSection((s) => (s === 'hotel' ? '' : 'hotel'))}
        >
          <div style={{ borderRadius: 12, border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 0 0 0' }} />
            {claimedRooms.length ? (
              claimedRooms.map((r) => (
                <LineItem key={r.id} label={`${r.name || 'Room'} (segment)`} amount={r.price || 0} />
              ))
            ) : (
              <LineItem label="Villa / Room bundle (prototype)" amount={hotelShare} />
            )}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            Split-ready based on room segment claims (prototype).
          </div>
        </AccordionSection>

        <AccordionSection
          title="Fees & Taxes"
          icon={<IndianRupee size={16} />}
          open={openSection === 'fees'}
          onToggle={() => setOpenSection((s) => (s === 'fees' ? '' : 'fees'))}
        >
          <LineItem label="GST / Taxes (demo)" amount={Math.round((itinerary.pricePerPerson || 9000) * 0.12)} />
          <LineItem label="Platform fee" amount={499} />
        </AccordionSection>
      </div>

      <div style={{ marginTop: 12, padding: 12, border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.08)', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>Per person total</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-emerald)', marginTop: 4 }}>
              ₹{totalPerPerson.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Guests (prototype)</div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 900 }}>{peopleCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
