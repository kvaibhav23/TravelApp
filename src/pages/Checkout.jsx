import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  DESTINATIONS,
  GROUP_MEMBERS,
  REFUND_POLICY,
  PAYMENT_METHODS,
} from '../data/mockTravelData';
import {
  Shield,
  AlertTriangle,
  Repeat,
  X,
  Menu,
  ClipboardList,
  Users,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import SinglePayerCheckout from '../components/SinglePayerCheckout';
import PreAuthTimer from '../components/PreAuthTimer';
import RoomClaiming from '../components/RoomClaiming';
import ComparePackagesTable from '../components/ComparePackagesTable';
import PeerAccountabilityTracker from '../components/PeerAccountabilityTracker';
import TripReceiptAccordion from '../components/TripReceiptAccordion';

import '../index.css';

const PREAUTH_TIMEOUT_SECONDS = 21600; // demo timer for prototype
const LITE_KYC_LIMIT = 10000; // ₹10k threshold per the spec

function RefundBanner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '12px var(--space-md)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 107, 107, 0.08))',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-lg)',
      }}
    >
      <Shield size={14} color="var(--accent-amber)" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-amber)', lineHeight: 1.2 }}>
          Cancellation & Refund Transparency
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {REFUND_POLICY.full.text} · {REFUND_POLICY.partial.text} · {REFUND_POLICY.none.text}
        </div>
      </div>
      <Repeat size={16} color="var(--text-muted)" />
    </div>
  );
}

function SplitPreAuthCheckout() {
  const { state, dispatch } = useApp();
  const currentUser = state.currentUser;
  const [searchParams, setSearchParams] = useSearchParams();

  const [optionsOpen, setOptionsOpen] = useState(false);

  const itinerary = state.lockedItinerary || DESTINATIONS[0];
  const members = state.groupMembers || GROUP_MEMBERS;

  // Prototype-only: allow editing "number of people" without mutating the real member list.
  const [peopleCountOverride, setPeopleCountOverride] = useState(members.length || 1);

  useMemo(() => {
    setPeopleCountOverride((v) => {
      const base = members.length || 1;
      if (Number.isFinite(v) && v > 0) return v;
      return base;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length]);

  const effectiveClaimsAmount = useMemo(() => {
    const rooms = itinerary.rooms || [];
    const claimedRooms = Object.entries(state.roomClaims || {})
      .filter(([, userId]) => userId)
      .map(([roomId]) => rooms.find((r) => r.id === roomId))
      .filter(Boolean);

    const sum = claimedRooms.reduce((acc, r) => acc + r.price, 0);
    if (sum > 0) return sum;

    const fallbackRoomPrice = rooms[0]?.price || 9000;
    return fallbackRoomPrice;
  }, [itinerary, state.roomClaims]);

  const quorumMemberCount = members.length || 1;
  const paidByPeopleCount = Math.max(1, peopleCountOverride || quorumMemberCount);

  const claimedPerPersonProxy =
    Math.round((effectiveClaimsAmount / Math.max(1, paidByPeopleCount)) * 100) / 100;



  const taxes = Math.round((itinerary.pricePerPerson * paidByPeopleCount) * 0.12);
  const platformFee = 499;
  const totalTripAmount = Math.round(itinerary.pricePerPerson * paidByPeopleCount + taxes + platformFee);

  const individualTotal = Math.round(
    itinerary.pricePerPerson +
      Math.round((itinerary.pricePerPerson * 0.12) || 0) +
      Math.round(platformFee / Math.max(1, paidByPeopleCount))
  );

  const [expired, setExpired] = useState(false);
  const [leaderOverride, setLeaderOverride] = useState(false);

  // pre | sunkCost | paymentMethods | processing | success
  const [pgStage, setPgStage] = useState(searchParams.get('payment') === '1' ? 'sunkCost' : 'pre');
  const [sunkCostAccepted, setSunkCostAccepted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(searchParams.get('payment') === '1');

  const quorumSatisfiedCount = useMemo(() => {
    const preAuths = state.preAuths || {};
    return members.filter((m) => preAuths[m.id] === 'authorized').length;
  }, [members, state.preAuths]);

  const quorumSatisfied = quorumSatisfiedCount === quorumMemberCount;
  const quorumPct = Math.round((quorumSatisfiedCount / Math.max(1, quorumMemberCount)) * 100);

  const preAuthStatuses = useMemo(() => {
    const preAuths = state.preAuths || {};
    return members.reduce((acc, m) => {
      acc[m.id] = preAuths[m.id] || 'pending';
      return acc;
    }, {});
  }, [members, state.preAuths]);

  const handleExpired = useCallback(() => setExpired(true), []);

  const setMemberAuthorized = useCallback(
    (userId) => {
      if (expired) return;
      dispatch({ type: 'SET_PRE_AUTH', payload: { userId, status: 'authorized' } });
    },
    [dispatch, expired]
  );

  const setMemberDeclined = useCallback(
    (userId) => {
      if (expired) return;
      dispatch({ type: 'SET_PRE_AUTH', payload: { userId, status: 'declined' } });
    },
    [dispatch, expired]
  );

  const tryCompletePayment = useCallback(() => {
    if (!quorumSatisfied) return;

    setPaymentModalOpen(true);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('payment', '1');
      return next;
    });

    setPgStage('sunkCost');
  }, [quorumSatisfied, setSearchParams]);

  const saveTheTrip = useCallback(() => {
    setPgStage('sunkCost');
  }, []);

  const resetPgFlow = useCallback(() => {
    setPgStage('pre');
    setSunkCostAccepted(false);
    setSelectedPaymentMethod(null);
    setPaymentModalOpen(false);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('payment');
      return next;
    });
  }, [setSearchParams]);

  const authorizeMyShare = useCallback(() => {
    if (!sunkCostAccepted) return;
    setPgStage('paymentMethods');
  }, [sunkCostAccepted]);

  const startPayment = useCallback(() => {
    if (!selectedPaymentMethod) return;
    setPgStage('processing');

    // prototype: complete after delay
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_PAYMENT' });
      setPgStage('success');
    }, 2500);
  }, [dispatch, selectedPaymentMethod]);

  return (
    <div className="page with-sticky-bottom">
      <RefundBanner />

      {/* Options (hamburger-style) bottom sheet to reduce scrolling */}
      <button
        className="btn btn-ghost"
        onClick={() => setOptionsOpen(true)}
        style={{
          position: 'sticky',
          top: 12,
          float: 'right',
          marginLeft: 'auto',
          display: 'inline-flex',
          padding: '10px 12px',
          marginBottom: 10,
          zIndex: 5,
        }}
        aria-label="Open options"
        title="Options"
      >
        <Menu size={18} />
        <span style={{ fontSize: 12, fontWeight: 800 }}>Options</span>
      </button>

      <AnimatePresence>
        {optionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.82)',
              zIndex: 90,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
            onClick={() => setOptionsOpen(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                maxWidth: 480,
                margin: '0 auto',
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                background: 'rgba(255, 255, 255, 0.97)',
                border: '1px solid var(--glass-border)',
                borderBottom: 'none',
                padding: 14,
                boxShadow: '0 -20px 60px rgba(2, 6, 23, 0.18)',
                color: 'var(--text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ClipboardList size={18} color="var(--accent-secondary)" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900 }}>Quick Options</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Jump without scrolling
                    </div>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setOptionsOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="divider" style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn btn-ghost btn-full"
                  onClick={() => setOptionsOpen(false)}
                  style={{ justifyContent: 'space-between', color: 'var(--text-primary)' }}
                >
                  Peer Accountability <ArrowRight size={16} />
                </button>
                <button
                  className="btn btn-ghost btn-full"
                  onClick={() => setOptionsOpen(false)}
                  style={{ justifyContent: 'space-between', color: 'var(--text-primary)' }}
                >
                  Receipt Breakdown <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment modal */}
      {paymentModalOpen && pgStage !== 'pre' && (
        <>
          {/* Opaque backdrop for payment modal */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 79,
              background: 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={resetPgFlow}
          />

          <div
            className="glass-card"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 80,
              margin: 'auto',
              maxWidth: 480,
              height: 'fit-content',
              top: 40,
              bottom: 40,
              overflow: 'auto',
              padding: 16,
              boxShadow: '0 18px 60px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16,185,129,0.10)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield size={20} color="var(--accent-emerald)" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-emerald)' }}>Push notification</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Your trip to <strong>{(itinerary?.name || '').split(' ')[0] || 'your destination'}</strong> is ready
                  to lock!
                </div>
              </div>

              <button className="btn btn-ghost" style={{ padding: '8px 10px' }} onClick={resetPgFlow} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="divider" style={{ margin: '14px 0' }} />

            {pgStage === 'sunkCost' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Your exact total</div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--accent-emerald)',
                        marginTop: 4,
                      }}
                    >
                      ₹{individualTotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>(demo individual share)</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Included for you</div>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 4 }}>Flights + Villa + Fees (prototype)</div>
                  </div>
                </div>

                <div className="divider" style={{ margin: '14px 0' }} />

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sunkCostAccepted}
                    onChange={(e) => setSunkCostAccepted(e.target.checked)}
                    style={{ marginTop: 4 }}
                  />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-primary)' }}>
                      Sunk Cost Agreement (Mandatory)
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                      Flights are non-refundable. Villa is refundable until Aug 10.
                      <br />
                      Cancelling after that may trigger partial penalties (prototype hardcode).
                    </div>
                  </div>
                </label>

                <div style={{ marginTop: 16 }}>
                  <button
                    className="btn btn-primary btn-full btn-lg"
                    disabled={!sunkCostAccepted}
                    style={{
                      opacity: sunkCostAccepted ? 1 : 0.6,
                      pointerEvents: sunkCostAccepted ? 'auto' : 'none',
                    }}
                    onClick={authorizeMyShare}
                  >
                    Authorize My Share <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}

            {pgStage === 'paymentMethods' && (
              <>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)' }}>Choose payment method</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Payment interface opens after you approve the authorization (prototype).
                </div>

                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      className="glass-card"
                      style={{
                        padding: 12,
                        cursor: 'pointer',
                        border:
                          selectedPaymentMethod === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: selectedPaymentMethod === m.id ? 'rgba(124,58,237,0.12)' : 'var(--glass-bg)',
                        textAlign: 'center',
                      }}
                      onClick={() => setSelectedPaymentMethod(m.id)}
                      type="button"
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          margin: '0 auto',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <span style={{ fontSize: 20, lineHeight: 1 }}>{m.icon}</span>
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 900, marginTop: 8 }}>{m.name}</div>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    className="btn btn-emerald btn-full btn-lg"
                    disabled={!selectedPaymentMethod}
                    style={{
                      opacity: selectedPaymentMethod ? 1 : 0.6,
                      pointerEvents: selectedPaymentMethod ? 'auto' : 'none',
                    }}
                    onClick={startPayment}
                    type="button"
                  >
                    Open PG & Authorize <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}

            {pgStage === 'processing' && (
              <div style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)' }}>
                  Authorizing via Payment Gateway…
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6 }}>capture_method: manual (prototype hold)</div>
              </div>
            )}

            {pgStage === 'success' && (
              <div style={{ padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-emerald)' }}>Trip Booked! 🎉</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6 }}>
                  Confirmed itinerary: {itinerary?.name || 'prototype'} (prototype)
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Trip breakdown (pay section) */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 900, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
              Trip — Breakdown
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {itinerary?.name || 'Trip'} • {paidByPeopleCount} people
            </div>
          </div>

          <span className="badge badge-emerald" style={{ fontWeight: 900 }}>
            Total: ₹{totalTripAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="divider" style={{ margin: '14px 0' }} />

        {/*
          Prototype breakdown:
          - flights: use dest.flights.price (or fallback)
          - hotel: dest.hotel.pricePerNight * duration (or fallback)
          - activities: ~15% of pricePerPerson
        */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>✈️ Flights</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>
              ₹{(itinerary?.flights?.price || 5000).toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>🏨 Hotel</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>
              ₹{(((itinerary?.hotel?.pricePerNight || 6000) * 3) * paidByPeopleCount).toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>🎫 Activities</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>
              ₹{(Math.round(itinerary.pricePerPerson * paidByPeopleCount * 0.15)).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="divider" style={{ margin: '2px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>🧾 Taxes & Fees</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>
              ₹{(taxes + platformFee).toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Total Trip Amount</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 1000 }}>
              ₹{totalTripAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.45, marginTop: 2 }}>
            Demo breakdown for the pre-auth route. Final pricing would be confirmed at payment gateway.
          </div>
        </div>
      </div>

      {/* Split cost + KYC + quorum header */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(124, 58, 237, 0.14)',
              border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={20} color="var(--accent-secondary)" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)' }}>Split Cost — Pre-Auth Route</h1>
              <span className="badge badge-primary">Flow A</span>
            </div>

            <p className="page-subtitle" style={{ marginTop: 6 }}>
              Booking will execute only after 100% quorum of member authorizations.
            </p>

            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-emerald">
                Quorum: {quorumSatisfiedCount}/{quorumMemberCount} ({quorumPct}%)
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>People</span>
                <button
                  className="btn btn-ghost"
                  style={{ width: 30, height: 30, padding: 0 }}
                  onClick={() => setPeopleCountOverride((v) => Math.max(1, v - 1))}
                  type="button"
                >
                  -
                </button>
                <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {paidByPeopleCount}
                </span>
                <button
                  className="btn btn-ghost"
                  style={{ width: 30, height: 30, padding: 0 }}
                  onClick={() => setPeopleCountOverride((v) => v + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 10, color: 'var(--text-muted)' }}>
              (prototype totals) totalTripAmount: ₹{totalTripAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Authorization window expiry */}
      <AnimatePresence>
        {expired && !quorumSatisfied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card"
            style={{ padding: 16, marginBottom: 'var(--space-lg)', border: '1px solid rgba(255,107,107,0.25)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} color="var(--accent-coral)" />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--accent-coral)' }}>Authorization window expired</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Use “Save the Trip” to cover remaining balance and keep booking from collapsing.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.button
                className="btn btn-primary"
                onClick={saveTheTrip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: '1 1 220px' }}
                type="button"
              >
                Save the Trip (Cover Remaining) <ArrowRight size={18} />
              </motion.button>

              <motion.button
                className="btn btn-ghost"
                onClick={() => {
                  setExpired(false);
                  dispatch({ type: 'SET_PRE_AUTH', payload: { userId: currentUser.id, status: 'authorized' } });
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: '1 1 180px' }}
                type="button"
              >
                Retry & Authorize
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Member pre-auth cards */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)' }}>
              Member Pre-Authorization Mandates
            </h3>
            <p className="page-subtitle" style={{ marginTop: 6 }}>Capture UPI / mandate authorization from all required payers.</p>
          </div>
          <span className="badge badge-primary">UPI Pre-Auth (Prototype)</span>
        </div>

        <div style={{ marginTop: 16 }}>
          <PreAuthTimer seconds={PREAUTH_TIMEOUT_SECONDS} onExpired={handleExpired} />
        </div>

        <div className="divider" style={{ margin: '16px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {members.map((m) => {
            const status = preAuthStatuses[m.id];
            const isYou = m.id === currentUser.id;
            const canToggle = !expired && (status !== 'authorized' || isYou);

            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--glass-border)',
                  background: isYou ? 'rgba(124,58,237,0.10)' : 'var(--glass-bg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    className="avatar avatar-sm"
                    style={{
                      background: m.color,
                      fontSize: 9,
                      border: '2px solid var(--bg-primary)',
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {m.avatar}
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>
                      {m.name}
                      {isYou && (
                        <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent-secondary)', fontWeight: 700 }}>
                          (You)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Status:{' '}
                      {status === 'authorized' ? 'Authorized' : status === 'declined' ? 'Declined' : 'Pending'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {status === 'authorized' ? (
                    <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Check size={12} /> Done
                    </span>
                  ) : (
                    <>
                      <motion.button
                        className="btn btn-ghost"
                        style={{ padding: '10px 12px' }}
                        disabled={!canToggle}
                        onClick={() => setMemberDeclined(m.id)}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                      >
                        Decline
                      </motion.button>

                      <motion.button
                        className="btn btn-primary"
                        style={{ padding: '10px 12px' }}
                        disabled={!canToggle}
                        onClick={() => setMemberAuthorized(m.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                      >
                        Authorize
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <motion.button
            className="btn btn-emerald btn-lg btn-full"
            disabled={!quorumSatisfied || expired}
            style={{
              opacity: !quorumSatisfied || expired ? 0.6 : 1,
              pointerEvents: !quorumSatisfied || expired ? 'none' : 'auto',
            }}
            onClick={tryCompletePayment}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
          >
            Execute Booking (Quorum Reached) <ArrowRight size={18} />
          </motion.button>

          <motion.button
            className="btn btn-ghost btn-full"
            onClick={() => setLeaderOverride((v) => !v)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ flex: '1 1 220px' }}
            type="button"
          >
            {leaderOverride ? 'Leader override: ON' : 'Leader override: OFF'}
          </motion.button>
        </div>

        {leaderOverride && (
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
            Prototype mode: leader override enables “Save the Trip” even if quorum isn’t 100% yet.
          </div>
        )}
      </div>

      {/* Save the trip CTA */}
      <div className="glass-card" style={{ padding: 16, marginTop: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={18} color="var(--accent-amber)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, color: 'var(--accent-amber)' }}>Prevent booking collapse</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {quorumSatisfied
                ? 'Quorum is satisfied — you can still proceed with booking.'
                : 'If any member fails to authorize, leader override lets one user cover the remaining balance.'}
            </div>
          </div>

          <span className="badge badge-amber" style={{ fontSize: 11, padding: '6px 10px', opacity: 0.95 }}>
            Leader override: {leaderOverride ? 'ON' : 'OFF'}
          </span>
        </div>

        <div style={{ marginTop: 12 }}>
          <motion.button
            className="btn btn-primary btn-full btn-lg"
            onClick={saveTheTrip}
            disabled={!leaderOverride}
            style={{
              opacity: leaderOverride ? 1 : 0.6,
              pointerEvents: leaderOverride ? 'auto' : 'none',
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
          >
            Save the Trip (Leader Cover) <ArrowRight size={18} />
          </motion.button>

          {!leaderOverride && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              Turn on “Leader override” to activate Save the Trip in this prototype.
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom action */}
      {pgStage === 'pre' && (
        <div className="sticky-checkout-bar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>Ready when quorum hits 100%</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 900 }}>
                Quorum: {quorumSatisfiedCount}/{quorumMemberCount}
              </div>
            </div>

            <motion.button
              className="btn btn-emerald"
              style={{ padding: '12px 16px', minWidth: 160 }}
              disabled={!quorumSatisfied || expired}
              onClick={tryCompletePayment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              type="button"
            >
              Execute booking <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      )}

      {pgStage === 'sunkCost' && (
        <div className="sticky-checkout-bar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>Your exact total</div>
              <div style={{ fontSize: 16, color: 'var(--accent-emerald)', fontWeight: 900 }}>
                ₹{individualTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <motion.button
              className="btn btn-primary"
              style={{ padding: '12px 16px', minWidth: 160 }}
              disabled={!sunkCostAccepted}
              onClick={authorizeMyShare}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              type="button"
            >
              Authorize my share <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  const { state } = useApp();
  const itinerary = state.lockedItinerary || DESTINATIONS[0];
  const memberCount = state.groupMembers?.length || 6;

  const perPerson = itinerary.pricePerPerson;
  const shouldUseSplitPreAuth = perPerson > LITE_KYC_LIMIT && memberCount >= 4;

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={22} color="var(--accent-secondary)" />
          <h1 className="page-title text-gradient" style={{ fontSize: 'var(--text-2xl)' }}>
            Checkout
          </h1>
        </div>
        <p className="page-subtitle">
          {itinerary?.name || 'Trip'} • {memberCount} members
        </p>
      </div>

      <AnimatePresence mode="wait">
        {shouldUseSplitPreAuth ? (
          <motion.div key="flowA" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SplitPreAuthCheckout />
          </motion.div>
        ) : (
          <motion.div key="flowB" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <RefundBanner />
            <SinglePayerCheckout />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: 18, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
        WanderZ — Your trip, simplified.
      </div>
    </div>
  );
}
