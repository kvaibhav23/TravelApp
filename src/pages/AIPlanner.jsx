import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, ArrowRight, Star, MapPin, Clock, Plane,
  Users, IndianRupee, ChevronLeft, Send, Zap, TrendingUp
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
  const { state } = useApp();
  const navigate = useNavigate();
  const { groupMembers } = state;

  const [budget, setBudget] = useState(15000);
  const [duration, setDuration] = useState(3);
  const [selectedVibes, setSelectedVibes] = useState(['beach']);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sentToVote, setSentToVote] = useState(false);

  const originCities = [...new Set(groupMembers.map(m => m.city))];

  const toggleVibe = (id) => {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsThinking(true);
    setSuggestions([]);
    setSentToVote(false);

    setTimeout(() => {
      const filtered = DESTINATIONS.filter(d => d.pricePerPerson <= budget + 3000)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      setSuggestions(filtered);
      setIsThinking(false);
    }, 3000);
  };

  const handleSendToVote = () => {
    setSentToVote(true);
  };

  const formatPrice = (p) => `₹${(p / 1000).toFixed(1)}k`;

  return (
    <div className="page">
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
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--accent-emerald)'
            }}>
              {formatPrice(budget)}
            </span>
          </div>
          <input
            type="range"
            min={5000}
            max={30000}
            step={500}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent-primary)',
              height: '6px',
              cursor: 'pointer',
            }}
          />
          <div className="flex justify-between" style={{ marginTop: '8px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>₹5k</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>₹30k</span>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="glass-card">
          <div className="flex items-center gap-sm mb-md">
            <Clock size={18} style={{ color: 'var(--accent-secondary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Duration</span>
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {[2, 3, 4, 5, 6, 7].map(n => (
              <button
                key={n}
                className={`chip ${duration === n ? 'active' : ''}`}
                onClick={() => setDuration(n)}
                style={{ minWidth: '60px', justifyContent: 'center' }}
              >
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
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'var(--text-xl)',
              color: 'var(--accent-cyan)'
            }}>
              {groupMembers.length} members
            </span>
          </div>
          <div className="flex gap-sm mt-sm" style={{ flexWrap: 'wrap' }}>
            {groupMembers.map(m => (
              <div key={m.id} className="avatar avatar-sm" style={{ background: m.color }}>
                {m.avatar}
              </div>
            ))}
          </div>
        </div>

        {/* Vibe Selector */}
        <div className="glass-card">
          <div className="flex items-center gap-sm mb-md">
            <Sparkles size={18} style={{ color: 'var(--accent-amber)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Trip Vibe</span>
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {VIBES.map(v => (
              <motion.button
                key={v.id}
                className={`chip ${selectedVibes.includes(v.id) ? 'active' : ''}`}
                onClick={() => toggleVibe(v.id)}
                whileTap={{ scale: 0.93 }}
              >
                <span>{v.emoji}</span>
                {v.label}
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

        {/* Generate Button */}
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
          <motion.div
            className="ai-thinking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ marginTop: 'var(--space-xl)' }}
          >
            <div className="flex items-center justify-center gap-sm mb-md">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <Brain size={24} style={{ color: 'var(--accent-primary)' }} />
              </motion.div>
              <p style={{
                color: 'var(--accent-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500
              }}>
                WanderZ AI is analyzing 47 packages...
              </p>
            </div>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="ai-thinking-card skeleton"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
              />
            ))}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
              <motion.div
                className="flex items-center justify-center gap-xs"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Matching vibes, budgets & flight routes...
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && !isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 'var(--space-xl)' }}
          >
            <div className="flex items-center gap-sm mb-md">
              <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} />
              <h4 style={{ fontWeight: 700 }}>Top Picks for Your Group</h4>
            </div>

            <div className="flex flex-col gap-md">
              {suggestions.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  className="glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2, type: 'spring', stiffness: 120 }}
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={dest.image}
                      alt={dest.name}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Rank badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--gradient-primary)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 12px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'white',
                    }}>
                      #{idx + 1} AI Pick
                    </div>
                    {/* Rating */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" />
                      {dest.rating}
                    </div>
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: 'linear-gradient(transparent, var(--bg-secondary))',
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: 'var(--space-md) var(--space-lg) var(--space-lg)' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{dest.name}</h4>
                    <div className="flex items-center gap-xs" style={{ marginBottom: 'var(--space-sm)' }}>
                      <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {dest.location}
                      </span>
                    </div>

                    {/* Price & Duration */}
                    <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                      <div>
                        <span style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          fontSize: 'var(--text-xl)',
                          color: 'var(--accent-emerald)'
                        }}>
                          ₹{dest.pricePerPerson.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}> /person</span>
                      </div>
                      <span className="badge badge-primary">
                        <Clock size={11} /> {dest.duration}
                      </span>
                      <span className="badge badge-cyan" style={{ fontSize: '11px' }}>
                        <Plane size={11} /> {dest.flights.type}
                      </span>
                    </div>

                    {/* Explainability Badges */}
                    <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                      {dest.explain.budget && (
                        <span className="explain-badge explain-budget">
                          💰 {dest.explain.budget}
                        </span>
                      )}
                      {dest.explain.vibe && (
                        <span className="explain-badge explain-vibe">
                          ✨ {dest.explain.vibe}
                        </span>
                      )}
                      {dest.explain.logistics && (
                        <span className="explain-badge explain-logistics">
                          ✈️ {dest.explain.logistics}
                        </span>
                      )}
                      {dest.explain.compromise && (
                        <span className="explain-badge explain-compromise">
                          ⚠️ {dest.explain.compromise}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Send to Vote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ marginTop: 'var(--space-xl)' }}
            >
              <AnimatePresence mode="wait">
                {!sentToVote ? (
                  <motion.button
                    key="send"
                    className="btn btn-coral btn-lg btn-full"
                    onClick={handleSendToVote}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Send size={18} />
                    Send to Group Vote
                    <ArrowRight size={16} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card"
                    style={{
                      textAlign: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      background: 'rgba(16, 185, 129, 0.1)'
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      style={{ fontSize: '48px', marginBottom: 'var(--space-sm)' }}
                    >
                      ✅
                    </motion.div>
                    <h4 style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      Sent to Group!
                    </h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      All members will receive a SwipeVote notification
                    </p>
                    <button
                      className="btn btn-primary btn-sm mt-md"
                      onClick={() => navigate('/swipe-vote')}
                    >
                      Go to SwipeVote <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Powered By */}
            <motion.div
              className="flex items-center justify-center gap-xs mt-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Powered by WanderZ AI
              </span>
              <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
