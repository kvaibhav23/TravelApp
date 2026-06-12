import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Plane,
  Hotel,
  Utensils,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  Share2,
  Users,
  Sparkles,
  Shield,
  Calendar,
} from 'lucide-react';
import { DESTINATIONS } from '../data/mockTravelData';
import '../index.css';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dest = useMemo(() => {
    return DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0];
  }, [id]);

  const flightCost = dest.flights?.price || 5000;
  const hotelCost = (dest.hotel?.pricePerNight || 6000) * 3;
  const activitiesCost = Math.round(dest.pricePerPerson * 0.15);
  const taxes = Math.round(dest.pricePerPerson * 0.12);
  const platformFee = 499;
  const totalPerPerson = flightCost + hotelCost + activitiesCost + taxes + platformFee;

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'relative',
          height: 220,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <img
          src={dest.image}
          alt={dest.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 14, left: 14,
            width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,255,255,0.9)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0f172a',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          padding: '6px 12px', borderRadius: 'var(--radius-full)',
          color: '#fbbf24', fontSize: 13, fontWeight: 700,
        }}>
          <Star size={14} fill="#fbbf24" />
          {dest.rating}
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>({dest.reviews} reviews)</span>
        </div>

        {/* Name & location */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <h1 style={{
            fontSize: 22, fontWeight: 900,
            fontFamily: 'var(--font-heading)',
            color: 'white', margin: 0, marginBottom: 4,
          }}>
            {dest.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            <MapPin size={14} />
            {dest.location}
            <span style={{ margin: '0 4px' }}>•</span>
            <Clock size={14} />
            {dest.duration}
          </div>
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}
      >
        {dest.tags?.map(tag => (
          <span key={tag} className="badge badge-primary" style={{ fontSize: 11, padding: '4px 12px' }}>
            {tag}
          </span>
        ))}
      </motion.div>

      {/* ─── Flight Details ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card"
        style={{ padding: 16, marginBottom: 14 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(124,58,237,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane size={20} color="#7c3aed" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Flight Details</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dest.flights?.airline || 'IndiGo'}</div>
          </div>
          <span className="badge badge-emerald" style={{ marginLeft: 'auto', fontSize: 10 }}>
            {dest.flights?.type || 'Direct'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {dest.flights?.departureTime?.split(' ')[0] || '06:30'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {dest.flights?.from?.[0] || 'Delhi'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 1, background: 'rgba(124,58,237,0.3)', position: 'relative', margin: '0 auto' }}>
              <Plane size={12} color="#7c3aed" style={{ position: 'absolute', top: -6, right: -2 }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              {dest.flights?.type?.includes('Direct') ? 'Non-stop' : '1 stop'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {dest.flights?.arrivalTime?.split(' ')[0] || '09:15'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {dest.location?.split(',')[0] || 'Goa'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(124,58,237,0.04)', borderRadius: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Per person flight cost</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#4c1d95' }}>₹{flightCost.toLocaleString('en-IN')}</span>
        </div>
      </motion.div>

      {/* ─── Hotel Details ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ padding: 16, marginBottom: 14 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(16,185,129,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Hotel size={20} color="#059669" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{dest.hotel?.name || 'Premium Resort'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dest.hotel?.type || 'Beachfront Villa'}</div>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: dest.hotel?.stars || 4 }).map((_, i) => (
              <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {(dest.hotel?.amenities || ['Pool', 'Spa', 'Restaurant']).map(am => (
            <span key={am} style={{
              fontSize: 10, padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
              color: '#047857', fontWeight: 600,
            }}>
              {am}
            </span>
          ))}
        </div>

        {/* Room Types */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
          Available Room Types
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dest.rooms?.slice(0, 3).map(room => (
            <div key={room.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 8,
              background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{room.image}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{room.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Up to {room.capacity} guests</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#047857' }}>
                ₹{room.price.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(16,185,129,0.04)', borderRadius: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>3 nights × ₹{(dest.hotel?.pricePerNight || 6000).toLocaleString('en-IN')}/night</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#047857' }}>₹{hotelCost.toLocaleString('en-IN')}</span>
        </div>
      </motion.div>

      {/* ─── Activities ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card"
        style={{ padding: 16, marginBottom: 14 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(245,158,11,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={20} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Included Activities</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dest.activities?.length || 5} activities included</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(dest.activities || []).map((act, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 0', fontSize: 13, color: 'var(--text-primary)',
            }}>
              <CheckCircle2 size={14} color="#10b981" />
              {act}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Price Breakdown ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
        style={{
          padding: 16, marginBottom: 20,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(16,185,129,0.04))',
          border: '1px solid rgba(124,58,237,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <IndianRupee size={18} color="#7c3aed" />
          <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Price Breakdown (per person)</div>
        </div>

        {[
          { label: '✈️ Flights', value: flightCost },
          { label: '🏨 Hotel (3 nights)', value: hotelCost },
          { label: '🎫 Activities', value: activitiesCost },
          { label: '📋 Taxes & fees (12%)', value: taxes },
          { label: '🛡️ Platform fee', value: platformFee },
        ].map((item, idx) => (
          <div key={idx} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0',
            borderBottom: idx < 4 ? '1px solid rgba(0,0,0,0.04)' : 'none',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>₹{item.value.toLocaleString('en-IN')}</span>
          </div>
        ))}

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 12, padding: '12px 14px',
          background: 'rgba(124,58,237,0.08)',
          borderRadius: 10,
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#4c1d95' }}>Total per person</span>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#4c1d95' }}>
            ₹{totalPerPerson.toLocaleString('en-IN')}
          </span>
        </div>
      </motion.div>

      {/* ─── CTAs ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ display: 'flex', gap: 12 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-ghost"
          onClick={() => navigate('/chat')}
          style={{ flex: 1, padding: '14px' }}
        >
          <Share2 size={16} />
          Share to Group
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/checkout')}
          style={{ flex: 2, padding: '14px' }}
        >
          Book This Package
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
