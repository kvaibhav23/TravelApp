import { motion } from 'framer-motion';
import { MapPin, Star, Calendar, Plane, Hotel, Users, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GROUP_MEMBERS } from '../data/mockTravelData';
import '../index.css';

export default function ItineraryCard({ destination }) {
  if (!destination) return null;

  const memberCount = GROUP_MEMBERS.length;
  const totalPerPerson = destination.pricePerPerson;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
        position: 'relative',
      }}
    >
      {/* Gradient border overlay */}
      <div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: 'calc(var(--radius-xl) + 2px)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan), var(--accent-emerald))',
          zIndex: -1,
        }}
      />

      {/* Hero Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.img
          src={destination.image}
          alt={destination.name}
          style={{
            width: '100%',
            height: '220px',
            objectFit: 'cover',
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(18,18,40,0.95))',
            padding: '40px 20px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
              <Shield size={10} /> Locked
            </span>
            <span className="badge badge-primary" style={{ fontSize: '10px' }}>
              {destination.duration}
            </span>
          </div>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              marginTop: '8px',
            }}
          >
            {destination.name}
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              marginTop: '4px',
            }}
          >
            <MapPin size={14} />
            {destination.location}
          </div>
        </div>

        {/* Rating badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--accent-amber)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
          }}
        >
          <Star size={14} fill="var(--accent-amber)" />
          {destination.rating}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 'var(--text-xs)' }}>
            ({destination.reviews.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Details section */}
      <div style={{ padding: '20px' }}>
        {/* Dates & Group */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(124,58,237,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-secondary)',
              }}
            >
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Dates
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                {destination.dates}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16,185,129,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Group
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                {memberCount} travellers
              </div>
            </div>
          </div>
        </div>

        <div className="divider" style={{ margin: '16px 0' }} />

        {/* Hotel Info */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245,158,11,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
              flexShrink: 0,
            }}
          >
            <Hotel size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {destination.hotel.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              {destination.hotel.type} • {'⭐'.repeat(Math.min(destination.hotel.stars, 5))}
            </div>
          </div>
        </div>

        {/* Flight Info */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6,182,212,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              flexShrink: 0,
            }}
          >
            <Plane size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {destination.flights.airline} • {destination.flights.type}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              From {destination.flights.from.join(', ')}
            </div>
          </div>
        </div>

        {/* Per-person cost */}
        <div
          style={{
            background: 'rgba(124,58,237,0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Per Person Cost
            </span>
            <span
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: 'var(--text-primary)',
              }}
            >
              ₹{totalPerPerson.toLocaleString('en-IN')}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
            }}
          >
            <span>Flights + Hotel + Activities</span>
            <span>
              Group total: ₹{(totalPerPerson * memberCount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* AI Explainability Badges */}
        {destination.explain && (
          <div style={{ marginBottom: '20px' }}>
            <h5
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Why this destination?
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {destination.explain.budget && (
                <span className="explain-badge explain-budget">
                  💰 {destination.explain.budget}
                </span>
              )}
              {destination.explain.vibe && (
                <span className="explain-badge explain-vibe">
                  ✨ {destination.explain.vibe}
                </span>
              )}
              {destination.explain.logistics && (
                <span className="explain-badge explain-logistics">
                  ✈️ {destination.explain.logistics}
                </span>
              )}
              {destination.explain.compromise && (
                <span className="explain-badge explain-compromise">
                  ⚖️ {destination.explain.compromise}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <Link to="/checkout" style={{ textDecoration: 'none' }}>
          <motion.button
            className="btn btn-primary btn-lg btn-full"
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            Proceed to Payment
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
