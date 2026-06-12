import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, ArrowRight, Star, MapPin, Clock, Plane,
  Users, IndianRupee, ChevronLeft, Send, Zap, TrendingUp,
  Hotel, CheckCircle2, BarChart3, Share2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DESTINATIONS } from '../data/mockTravelData';
import '../index.css';

const VIBES = [
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'mountains', label: 'Mountains', emoji: '🏔️' },
  { id: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

export default function AIPlanner() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { groupMembers } = state;

  const [budget, setBudget] = useState(15000);
  const [duration, setDuration] = useState(3);
  const [selectedVibes, setSelectedVibes] = useState(['beach']);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sentToVote, setSentToVote] = useState(false);

  // New: selection, compare, expanded breakdown
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const originCities = [...new Set(groupMembers.map(m => m.city))];

  const toggleVibe = (id) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsThinking(true);
    setSuggestions([]);
    setSentToVote(false);
    setSelectedIds([]);
    setShowCompare(false);

    setTimeout(() => {
      const filtered = DESTINATIONS.filter(d => d.pricePerPerson <= budget + 3000)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      setSuggestions(filtered);
      setIsThinking(false);
    }, 3000);
  };

  const handleSendToVote = () => {
    const toShare = selectedIds.length > 0
      ? suggestions.filter(s => selectedIds.includes(s.id))
      : suggestions;
    dispatch({ type: 'SHARE_TO_GROUP', payload: toShare.map(s => s.id) });
    setSentToVote(true);
  };

  const formatPrice = (p) => `₹${(p / 1000).toFixed(1)}k`;
  const shareLabelCount = selectedIds.length > 0 ? selectedIds.length : suggestions.length;

  return (
    <div className="page" style={{ paddingBottom: 120 }}>
      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-sm mb-sm">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="page-title" style={{ fontSize: 'var(--text-2xl)' }}>
              <span className="text-gradient">AI Trip Planner</span>
            </h2>
            <p className="page-subtitle">Let WanderZ AI find the perfect trip for your group</p>
          </div>
        </div>
      </motion.div>

      {/* Constraints Section */}
      <motion.div
        className="flex flex-col gap-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Budget Slider */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <IndianRupee size={18} style={{ color: 'var(--accent-emerald)' }} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Budget per person</span>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {formatPrice(budget)}
            </span>
          </div>
          <input type="range" min={5000} max={30000} step={500} value={budget} onChange={(e) => setBudget(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-primary)', height: '6px', cursor: 'pointer' }} />
          <div className="flex justify-between" style={{ marginTop: '8px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>₹5k</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>₹30k</span>
          </div>
        </div>

        {/* Duration */}
        <div className="glass-card">
          <div className="flex items-center gap-sm mb-md">
            <Clock size={18} style={{ color: 'var(--accent-secondary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Duration</span>
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {[2, 3, 4, 5, 6, 7].map(n => (
              <button key={n} className={`chip ${duration === n ? 'active' : ''}`} onClick={() => setDuration(n)} style={{ minWidth: '60px', justifyContent: 'center' }}>
                {n}N
              </button>
            ))}
          </div>
        </div>

        {/* Group Size */}
        <div className="glass-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <Users size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Group Size</span>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--accent-cyan)' }}>
              {groupMembers.length} members
            </span>
          </div>
          <div className="flex gap-sm mt-sm" style={{ flexWrap: 'wrap' }}>
            {groupMembers.map(m => (
              <div key={m.id} className="avatar avatar-sm" style={{ background: m.color }}>{m.avatar}</div>
            ))}
          </div>
        </div>

        {/* Vibe */}
        <div className="glass-card">
          <div className="flex items-center gap-sm mb-md">
            <Sparkles size={18} style={{ color: 'var(--accent-amber)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Trip Vibe</span>
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {VIBES.map(v => (
              <motion.button key={v.id} className={`chip ${selectedVibes.includes(v.id) ? 'active' : ''}`} onClick={() => toggleVibe(v.id)} whileTap={{ scale: 0.93 }}>
                <span>{v.emoji}</span> {v.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Origin Cities */}
        <div className="glass-card">
          <div className="flex items-center gap-sm mb-md">
            <Plane size={18} style={{ color: 'var(--accent-secondary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Origin Cities</span>
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {originCities.map(city => (
              <span key={city} className="badge badge-primary">{city}</span>
            ))}
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '8px' }}>
            Auto-populated from group members
          </p>
        </div>

        {/* Generate */}
        <motion.button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleGenerate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={isThinking}
          style={{ opacity: isThinking ? 0.7 : 1, marginTop: 'var(--space-sm)' }}
        >
          <Brain size={20} />
          {isThinking ? 'AI is thinking...' : 'Generate Suggestions'}
          <Sparkles size={16} />
        </motion.button>
      </motion.div>

      {/* AI Thinking State */}
      <AnimatePresence>
        {isThinking && (
          <motion.div className="ai-thinking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ marginTop: 'var(--space-xl)' }}>
            <div className="flex items-center justify-center gap-sm mb-md">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                <Brain size={24} style={{ color: 'var(--accent-primary)' }} />
              </motion.div>
              <p style={{ color: 'var(--accent-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                WanderZ AI is analyzing 47 packages...
              </p>
            </div>
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="ai-thinking-card skeleton" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }} />
            ))}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
              <motion.div className="flex items-center justify-center gap-xs" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Matching vibes, budgets & flight routes...
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SUGGESTIONS ═══ */}
      <AnimatePresence>
        {suggestions.length > 0 && !isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-xl)' }}>
            <div className="flex items-center justify-between mb-md">
              <div className="flex items-center gap-sm">
                <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} />
                <h4 style={{ fontWeight: 700 }}>Top Picks for Your Group</h4>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Tap to select'}
              </span>
            </div>

            <div className="flex flex-col gap-md">
              {suggestions.map((dest, idx) => {
                const isSelected = selectedIds.includes(dest.id);
                const isExpanded = expandedId === dest.id;
                const flightCost = dest.flights?.price || 5000;
                const hotelCost = (dest.hotel?.pricePerNight || 6000) * 3;
                const activitiesCost = Math.round(dest.pricePerPerson * 0.15);

                return (
                  <motion.div
                    key={dest.id}
                    className="glass-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2, type: 'spring', stiffness: 120 }}
                    style={{
                      padding: 0, overflow: 'hidden',
                      border: isSelected ? '2px solid rgba(124,58,237,0.5)' : '1px solid var(--glass-border)',
                      transition: 'border 0.2s ease',
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative' }}>
                      <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'white' }}>
                        #{idx + 1} AI Pick
                      </div>
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" /> {dest.rating}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, var(--bg-secondary))' }} />

                      {/* Selection checkbox */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleSelect(dest.id)}
                        style={{
                          position: 'absolute', bottom: 12, right: 12,
                          width: 36, height: 36, borderRadius: 10,
                          background: isSelected ? 'rgba(124,58,237,0.9)' : 'rgba(255,255,255,0.85)',
                          border: isSelected ? '2px solid #7c3aed' : '2px solid rgba(0,0,0,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: isSelected ? 'white' : '#94a3b8',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        <CheckCircle2 size={18} />
                      </motion.button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'var(--space-md) var(--space-lg) var(--space-lg)' }}>
                      <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{dest.name}</h4>
                      <div className="flex items-center gap-xs" style={{ marginBottom: 'var(--space-sm)' }}>
                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{dest.location}</span>
                      </div>

                      {/* Price & Duration */}
                      <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-sm)' }}>
                        <div>
                          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--accent-emerald)' }}>
                            ₹{dest.pricePerPerson.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}> /person</span>
                        </div>
                        <span className="badge badge-primary"><Clock size={11} /> {dest.duration}</span>
                        <span className="badge badge-cyan" style={{ fontSize: '11px' }}><Plane size={11} /> {dest.flights?.type || 'Direct'}</span>
                      </div>

                      {/* Quick breakdown row */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', color: '#4c1d95', fontWeight: 600 }}>
                          ✈️ {dest.flights?.airline || 'IndiGo'} • ₹{flightCost.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', color: '#047857', fontWeight: 600 }}>
                          🏨 {dest.hotel?.name?.split(' ').slice(0, 2).join(' ') || 'Resort'} • ₹{hotelCost.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Expand for full breakdown */}
                      <motion.button
                        onClick={() => setExpandedId(isExpanded ? null : dest.id)}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'none', border: 'none',
                          color: 'var(--accent-secondary)', fontSize: 12,
                          fontWeight: 600, cursor: 'pointer', padding: '4px 0',
                        }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? 'Hide details' : 'View full breakdown'}
                      </motion.button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ marginTop: 12, padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                              {/* Flight */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                                  ✈️ Flight
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                  <span>{dest.flights?.airline || 'IndiGo'} • {dest.flights?.type || 'Direct'}</span>
                                  <span style={{ fontWeight: 800 }}>₹{flightCost.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {dest.flights?.departureTime || '06:30 AM'} → {dest.flights?.arrivalTime || '09:15 AM'} • From: {dest.flights?.from?.join(', ') || 'Delhi'}
                                </div>
                              </div>

                              {/* Hotel */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                                  🏨 Hotel
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                  <span>{dest.hotel?.name || 'Premium Resort'}</span>
                                  <span style={{ fontWeight: 800 }}>₹{hotelCost.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {dest.hotel?.type || 'Beachfront Villa'} • {'⭐'.repeat(dest.hotel?.stars || 4)} • ₹{(dest.hotel?.pricePerNight || 6000).toLocaleString('en-IN')}/night
                                </div>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                                  {(dest.hotel?.amenities || []).slice(0, 4).map(am => (
                                    <span key={am} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.08)', color: '#047857', fontWeight: 600 }}>{am}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Activities */}
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                                  🎫 Activities
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                  {(dest.activities || []).slice(0, 4).map((act, i) => (
                                    <div key={i} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <CheckCircle2 size={10} color="#10b981" /> {act}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Total */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(124,58,237,0.06)', borderRadius: 8, fontWeight: 800 }}>
                                <span style={{ fontSize: 12, color: '#4c1d95' }}>Total per person</span>
                                <span style={{ fontSize: 14, color: '#4c1d95' }}>₹{dest.pricePerPerson.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Explainability Badges */}
                      <div className="flex gap-xs" style={{ flexWrap: 'wrap', marginTop: 8 }}>
                        {dest.explain?.budget && <span className="explain-badge explain-budget">💰 {dest.explain.budget}</span>}
                        {dest.explain?.vibe && <span className="explain-badge explain-vibe">✨ {dest.explain.vibe}</span>}
                        {dest.explain?.logistics && <span className="explain-badge explain-logistics">✈️ {dest.explain.logistics}</span>}
                        {dest.explain?.compromise && <span className="explain-badge explain-compromise">⚠️ {dest.explain.compromise}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ═══ COMPARE PACKAGES BUTTON ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: 16 }}
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-ghost btn-full"
                onClick={() => setShowCompare(!showCompare)}
                style={{ padding: '14px', gap: 8 }}
              >
                <BarChart3 size={18} />
                {showCompare ? 'Hide Comparison' : 'Compare Packages Side-by-Side'}
                {showCompare ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </motion.button>
            </motion.div>

            {/* ═══ COMPARE VIEW (card format) ═══ */}
            <AnimatePresence>
              {showCompare && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', marginTop: 12 }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${suggestions.length}, minmax(0, 1fr))`,
                    gap: 8,
                  }}>
                    {suggestions.map((d, idx) => {
                      const delta = Math.round(d.pricePerPerson - budget);
                      const isOver = delta > 0;
                      return (
                        <div key={d.id} style={{
                          borderRadius: 14, overflow: 'hidden',
                          border: '1px solid var(--glass-border)',
                          background: 'var(--glass-bg)',
                        }}>
                          {/* Mini image */}
                          <div style={{ height: 70, position: 'relative' }}>
                            <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(10,10,26,0.8))' }} />
                            <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: 10, fontWeight: 900, color: 'white' }}>{d.name.split(' ').slice(0, 2).join(' ')}</div>
                              <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 800 }}>{d.rating}★</div>
                            </div>
                          </div>
                          {/* Details */}
                          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                              <span style={{ fontWeight: 600 }}>Price</span>
                              <span style={{ fontWeight: 900, color: 'var(--text-primary)' }}>₹{d.pricePerPerson.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                              <span style={{ fontWeight: 600 }}>Duration</span>
                              <span style={{ fontWeight: 800 }}>{d.duration}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                              <span style={{ fontWeight: 600 }}>Flight</span>
                              <span style={{ fontWeight: 800, color: d.flights?.type?.includes('Direct') ? '#059669' : '#d97706' }}>{d.flights?.type || 'Direct'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                              <span style={{ fontWeight: 600 }}>Hotel</span>
                              <span style={{ fontWeight: 800 }}>{'⭐'.repeat(d.hotel?.stars || 4)}</span>
                            </div>
                            {/* Delta pill */}
                            <div style={{
                              padding: '4px 6px', borderRadius: 6, textAlign: 'center', marginTop: 4,
                              background: isOver ? 'rgba(255,107,107,0.1)' : 'rgba(16,185,129,0.1)',
                              border: `1px solid ${isOver ? 'rgba(255,107,107,0.25)' : 'rgba(16,185,129,0.25)'}`,
                              color: isOver ? '#ef4444' : '#059669',
                              fontWeight: 800, fontSize: 9,
                            }}>
                              {isOver ? `Over ₹${delta.toLocaleString('en-IN')}` : `Saves ₹${Math.abs(delta).toLocaleString('en-IN')}`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ SEND TO GROUP ═══ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ marginTop: 'var(--space-lg)' }}>
              <AnimatePresence mode="wait">
                {!sentToVote ? (
                  <motion.button
                    key="send"
                    className="btn btn-coral btn-lg btn-full"
                    onClick={handleSendToVote}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ gap: 8 }}
                  >
                    <Share2 size={18} />
                    Share {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'All'} to Group Vote
                    <ArrowRight size={16} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card"
                    style={{ textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.1)' }}
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }} style={{ fontSize: '48px', marginBottom: 'var(--space-sm)' }}>✅</motion.div>
                    <h4 style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      Shared {shareLabelCount} suggestion{shareLabelCount !== 1 ? 's' : ''} to the group!
                    </h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      All members will receive a SwipeVote notification
                    </p>
                    <button className="btn btn-primary btn-sm mt-md" onClick={() => navigate('/vote')}>
                      Go to SwipeVote <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Powered By */}
            <motion.div className="flex items-center justify-center gap-xs mt-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Powered by WanderZ AI</span>
              <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
