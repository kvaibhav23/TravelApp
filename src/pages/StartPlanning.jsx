import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plane,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Search,
} from 'lucide-react';
import { INDIAN_CITIES } from '../data/mockTravelData';
import '../index.css';

const TRIP_TYPES = [
  { id: 'solo', label: 'Solo', emoji: '🧳' },
  { id: 'couple', label: 'Couple', emoji: '💑' },
  { id: 'friends', label: 'Friends', emoji: '👥' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'corporate', label: 'Corporate', emoji: '💼' },
];

export default function StartPlanning() {
  const navigate = useNavigate();

  const [tripName, setTripName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(4);
  const [rooms, setRooms] = useState(2);
  const [tripType, setTripType] = useState('friends');
  const [budget, setBudget] = useState(15000);

  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const filteredFromCities = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(from.toLowerCase())
  ).slice(0, 5);

  const filteredToCities = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(to.toLowerCase())
  ).slice(0, 5);

  const canSubmit = from && to && startDate;

  const handleFindPackages = () => {
    navigate(`/ai-planner?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&guests=${guests}`);
  };

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-xl)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => navigate(-1)}
            style={{ padding: 8 }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              margin: 0,
            }}>
              Start Planning ✈️
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
              Set your trip details to get started
            </p>
          </div>
        </div>
      </motion.div>

      {/* Trip Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="input-group"
        style={{ marginBottom: 20 }}
      >
        <label className="input-label">Trip Name (optional)</label>
        <input
          className="input"
          placeholder="e.g. August Long Weekend 🏖️"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </motion.div>

      {/* From / To */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}
      >
        <div className="input-group" style={{ position: 'relative' }}>
          <label className="input-label">
            <Plane size={13} style={{ display: 'inline', marginRight: 4 }} />
            From
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', top: 12, left: 12 }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Delhi"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setShowFromSuggestions(true); }}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
            />
          </div>
          {showFromSuggestions && from && filteredFromCities.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden', marginTop: 4,
            }}>
              {filteredFromCities.map(c => (
                <button key={c} onClick={() => { setFrom(c); setShowFromSuggestions(false); }}
                  style={{ width: '100%', padding: '10px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <MapPin size={12} style={{ display: 'inline', marginRight: 6, color: '#7c3aed' }} />{c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label className="input-label">
            <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
            To
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: 12, left: 12 }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Goa"
              value={to}
              onChange={(e) => { setTo(e.target.value); setShowToSuggestions(true); }}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
            />
          </div>
          {showToSuggestions && to && filteredToCities.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden', marginTop: 4,
            }}>
              {filteredToCities.map(c => (
                <button key={c} onClick={() => { setTo(c); setShowToSuggestions(false); }}
                  style={{ width: '100%', padding: '10px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <MapPin size={12} style={{ display: 'inline', marginRight: 6, color: '#7c3aed' }} />{c}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Dates */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}
      >
        <div className="input-group">
          <label className="input-label">
            <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
            Check-in
          </label>
          <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">
            <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
            Check-out
          </label>
          <input className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </motion.div>

      {/* Guests & Rooms */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}
      >
        <div className="input-group">
          <label className="input-label">
            <Users size={13} style={{ display: 'inline', marginRight: 4 }} />
            Guests
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <button className="btn btn-ghost" onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 32, height: 32, padding: 0 }}>-</button>
            <span style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 16 }}>{guests}</span>
            <button className="btn btn-ghost" onClick={() => setGuests(guests + 1)} style={{ width: 32, height: 32, padding: 0 }}>+</button>
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">🛏️ Rooms</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <button className="btn btn-ghost" onClick={() => setRooms(Math.max(1, rooms - 1))} style={{ width: 32, height: 32, padding: 0 }}>-</button>
            <span style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: 16 }}>{rooms}</span>
            <button className="btn btn-ghost" onClick={() => setRooms(rooms + 1)} style={{ width: 32, height: 32, padding: 0 }}>+</button>
          </div>
        </div>
      </motion.div>

      {/* Trip Type */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: 20 }}
      >
        <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Trip Type</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TRIP_TYPES.map(type => (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTripType(type.id)}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                background: tripType === type.id ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.02)',
                border: `1.5px solid ${tripType === type.id ? 'rgba(124,58,237,0.4)' : 'rgba(0,0,0,0.08)'}`,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: tripType === type.id ? 700 : 500,
                color: tripType === type.id ? '#4c1d95' : '#64748b',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              {type.emoji} {type.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Budget Slider */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label className="input-label" style={{ margin: 0 }}>
            <IndianRupee size={13} style={{ display: 'inline', marginRight: 4 }} />
            Budget per person
          </label>
          <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#4c1d95' }}>
            ₹{budget.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={5000}
          max={50000}
          step={1000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#7c3aed',
            height: 6,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          <span>₹5,000</span>
          <span>₹50,000</span>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileHover={canSubmit ? { scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.4)' } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          className="btn btn-primary btn-full btn-lg"
          onClick={handleFindPackages}
          disabled={!canSubmit}
          style={{
            opacity: canSubmit ? 1 : 0.5,
            pointerEvents: canSubmit ? 'auto' : 'none',
            fontSize: 15,
            padding: '16px',
          }}
        >
          <Sparkles size={18} />
          Find Packages
          <ArrowRight size={18} />
        </motion.button>

        {!canSubmit && (
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            Fill in From, To, and Check-in date to continue
          </div>
        )}
      </motion.div>
    </div>
  );
}
