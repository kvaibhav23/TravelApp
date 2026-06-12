import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, ScanLine, PlusCircle, Image, ChevronLeft, Wallet,
  ArrowRightLeft, CheckCircle2, Calendar, ClipboardList
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TRIP_EXPENSES, GROUP_MEMBERS } from '../data/mockTravelData';
import QRScanner from '../components/QRScanner';
import TripGallery from '../components/TripGallery';
import ReceiptGallery from '../components/ReceiptGallery';
import '../index.css';

const getMember = (id) => GROUP_MEMBERS.find(m => m.id === id);

export default function ActiveTrip() {
  const { state } = useApp();
  const navigate = useNavigate();
  const expenses = state.expenses || TRIP_EXPENSES;

  const [searchParams] = useSearchParams();
  const [showScanner, setShowScanner] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showReceiptsGallery, setShowReceiptsGallery] = useState(false);
  const [settledItems, setSettledItems] = useState({});

  // Calculate member totals
  const memberBalances = useMemo(() => {
    const paid = {};
    const owes = {};

    GROUP_MEMBERS.forEach(m => {
      paid[m.id] = 0;
      owes[m.id] = 0;
    });

    expenses.forEach(exp => {
      paid[exp.paidBy] = (paid[exp.paidBy] || 0) + exp.amount;
      const splitAmount = exp.amount / exp.splitBetween.length;
      exp.splitBetween.forEach(uid => {
        owes[uid] = (owes[uid] || 0) + splitAmount;
      });
    });

    const net = {};
    GROUP_MEMBERS.forEach(m => {
      net[m.id] = paid[m.id] - owes[m.id];
    });

    return { paid, owes, net };
  }, [expenses]);

  // Calculate settlement pairs
  const settlements = useMemo(() => {
    const { net } = memberBalances;
    const debtors = [];
    const creditors = [];

    Object.keys(net).forEach(uid => {
      if (net[uid] < -1) debtors.push({ id: uid, amount: -net[uid] });
      else if (net[uid] > 1) creditors.push({ id: uid, amount: net[uid] });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const pairs = [];
    let di = 0, ci = 0;

    while (di < debtors.length && ci < creditors.length) {
      const settle = Math.min(debtors[di].amount, creditors[ci].amount);
      if (settle > 1) {
        pairs.push({
          from: debtors[di].id,
          to: creditors[ci].id,
          amount: Math.round(settle),
        });
      }
      debtors[di].amount -= settle;
      creditors[ci].amount -= settle;
      if (debtors[di].amount < 1) di++;
      if (creditors[ci].amount < 1) ci++;
    }

    return pairs;
  }, [memberBalances]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const tab = searchParams.get('tab');
  const scanner = searchParams.get('scanner');

  if (tab === 'gallery') {
    if (!showGallery) setShowGallery(true);
  }
  if (tab === 'receipts') {
    if (!showReceiptsGallery) setShowReceiptsGallery(true);
  }
  if (scanner === 'receipts') {
    if (!showScanner) setShowScanner(true);
  }

  if (showScanner) return <QRScanner onClose={() => setShowScanner(false)} />;
  if (showReceiptsGallery) return <ReceiptGallery receipts={state.receipts} onClose={() => setShowReceiptsGallery(false)} />;
  if (showGallery) return <TripGallery onClose={() => setShowGallery(false)} />;

  return (
    <div className="page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-lg)' }}
      >
        <div className="flex items-center gap-sm mb-sm">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>
              {state.activeTrip?.name || 'Goa Beach Escape 🏖️'}
            </h3>
            <div className="flex items-center gap-sm">
              <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                South Goa, India
              </span>
            </div>
          </div>
        </div>

        {/* Day indicator */}
        <div style={{
          background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div className="flex items-center gap-sm">
            <Calendar size={18} color="white" />
            <span style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>
              Day 2 of 4
            </span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)' }}>
            Aug 14 – Aug 17
          </span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="flex gap-sm mb-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { icon: <ScanLine size={20} />, label: 'Scan Receipts', color: 'var(--accent-primary)', action: () => setShowScanner(true) },
          { icon: <PlusCircle size={20} />, label: 'Add Expense', color: 'var(--accent-emerald)', action: () => {} },
          { icon: <ClipboardList size={20} />, label: 'My Receipts', color: 'var(--accent-secondary)', action: () => setShowReceiptsGallery(true) },
          { icon: <Image size={20} />, label: 'Trip Gallery', color: 'var(--accent-cyan)', action: () => setShowGallery(true) },
        ].map((act, i) => (
          <motion.button
            key={act.label}
            className="glass-card"
            onClick={act.action}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              padding: 'var(--space-md) var(--space-sm)',
              cursor: 'pointer',
              border: 'none',
              background: 'var(--glass-bg)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{
              color: act.color,
              background: `${act.color}20`,
              borderRadius: 'var(--radius-md)',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {act.icon}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {act.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Expense Ledger */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: 'var(--space-xl)' }}
      >
        <div className="flex items-center justify-between mb-md">
          <div className="flex items-center gap-sm">
            <Wallet size={18} style={{ color: 'var(--accent-secondary)' }} />
            <h4 style={{ fontWeight: 700 }}>Expense Ledger</h4>
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            color: 'var(--accent-coral)',
            fontSize: 'var(--text-lg)',
          }}>
            ₹{totalExpenses.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-card" style={{ padding: 0 }}>
          {expenses.map((exp, idx) => {
            const payer = getMember(exp.paidBy);
            return (
              <motion.div
                key={exp.id}
                className="ledger-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <div className="flex items-center gap-md" style={{ flex: 1 }}>
                  <span style={{ fontSize: '24px' }}>{exp.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{exp.description}</p>
                    <div className="flex items-center gap-xs">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {exp.time}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>·</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        Split {exp.splitBetween.length}-way
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div>
                    <p style={{
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-sm)',
                    }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      by {payer?.name?.split(' ')[0]}
                    </p>
                  </div>
                  <div
                    className="avatar avatar-sm"
                    style={{ background: payer?.color }}
                  >
                    {payer?.avatar}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Running total per member */}
        <div className="glass-card mt-md">
          <p style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 'var(--space-sm)',
          }}>
            Running Total Per Member
          </p>
          <div className="flex flex-col gap-xs">
            {GROUP_MEMBERS.map(m => (
              <div key={m.id} className="flex items-center justify-between" style={{ padding: '4px 0' }}>
                <div className="flex items-center gap-sm">
                  <div className="avatar avatar-sm" style={{ background: m.color, width: '24px', height: '24px', fontSize: '10px' }}>
                    {m.avatar}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{m.name.split(' ')[0]}</span>
                </div>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  color: memberBalances.owes[m.id] > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>
                  ₹{Math.round(memberBalances.owes[m.id]).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Who Owes Whom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-sm mb-md">
          <ArrowRightLeft size={18} style={{ color: 'var(--accent-amber)' }} />
          <h4 style={{ fontWeight: 700 }}>Who Owes Whom</h4>
        </div>

        <div className="flex flex-col gap-sm">
          {settlements.map((s, idx) => {
            const fromMember = getMember(s.from);
            const toMember = getMember(s.to);
            const isSettled = settledItems[`${s.from}-${s.to}`];

            return (
              <motion.div
                key={idx}
                className="glass-card"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + idx * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-md)',
                  border: isSettled
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid var(--glass-border)',
                  background: isSettled
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'var(--glass-bg)',
                }}
              >
                <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                  <div className="avatar avatar-sm" style={{ background: fromMember?.color }}>
                    {fromMember?.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                      {fromMember?.name?.split(' ')[0]} owes {toMember?.name?.split(' ')[0]}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      color: isSettled ? 'var(--accent-emerald)' : 'var(--accent-coral)',
                      fontSize: 'var(--text-base)',
                    }}>
                      ₹{s.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-xs">
                  <div className="avatar avatar-sm" style={{ background: toMember?.color }}>
                    {toMember?.avatar}
                  </div>
                  <AnimatePresence mode="wait">
                    {isSettled ? (
                      <motion.div
                        key="settled"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="badge badge-emerald"
                      >
                        <CheckCircle2 size={12} /> Settled
                      </motion.div>
                    ) : (
                      <motion.button
                        key="settle"
                        className="btn btn-sm"
                        onClick={() => setSettledItems(prev => ({
                          ...prev,
                          [`${s.from}-${s.to}`]: true
                        }))}
                        whileTap={{ scale: 0.93 }}
                        style={{
                          background: 'rgba(124, 58, 237, 0.2)',
                          color: 'var(--accent-secondary)',
                          border: '1px solid rgba(124, 58, 237, 0.3)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        Settle
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
