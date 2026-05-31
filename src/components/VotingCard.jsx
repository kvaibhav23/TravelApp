import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, ThumbsUp, ThumbsDown, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../index.css';

function VotingCard({ destination }) {
  const { state, dispatch } = useApp();
  const [addedToItinerary, setAddedToItinerary] = useState(false);

  if (!destination) return null;

  const currentUserId = state.currentUser.id;
  const votes = state.votes[destination.id] || { up: [], down: [] };
  const userVote = votes.up.includes(currentUserId)
    ? 'up'
    : votes.down.includes(currentUserId)
    ? 'down'
    : null;

  const handleVote = (voteType) => {
    dispatch({
      type: 'VOTE',
      payload: {
        destinationId: destination.id,
        vote: voteType,
        userId: currentUserId,
      },
    });
  };

  const handleAddToItinerary = () => {
    setAddedToItinerary(true);
    dispatch({
      type: 'LOCK_ITINERARY',
      payload: destination,
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          fill={i < fullStars ? '#f59e0b' : i === fullStars && hasHalf ? '#f59e0b' : 'none'}
          color={i < fullStars || (i === fullStars && hasHalf) ? '#f59e0b' : 'var(--text-muted)'}
          strokeWidth={i < fullStars ? 0 : 1.5}
        />
      );
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        maxWidth: 280,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Hotel Image */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <img
          src={destination.image}
          alt={destination.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: 'linear-gradient(transparent, rgba(10, 10, 26, 0.9))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(10, 10, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Star size={10} fill="#f59e0b" color="#f59e0b" />
          {destination.rating}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 14px' }}>
        <h4
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            marginBottom: 2,
            lineHeight: 1.3,
          }}
        >
          {destination.hotel?.name || destination.name}
        </h4>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 6,
          }}
        >
          <MapPin size={11} color="var(--text-muted)" />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {destination.location}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          {renderStars(destination.rating)}
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 2 }}>
            ({destination.reviews?.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 4,
            marginBottom: 12,
            padding: '6px 10px',
            background: 'rgba(124, 58, 237, 0.1)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
            }}
          >
            ₹{destination.pricePerPerson?.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/person</span>
        </div>

        {/* Vote Buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleVote('up')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              border: `1.5px solid ${userVote === 'up' ? 'var(--accent-emerald)' : 'var(--glass-border)'}`,
              background: userVote === 'up' ? 'rgba(16, 185, 129, 0.15)' : 'var(--glass-bg)',
              color: userVote === 'up' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <ThumbsUp size={14} />
            <AnimatePresence mode="wait">
              <motion.span
                key={votes.up.length}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {votes.up.length}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleVote('down')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              border: `1.5px solid ${userVote === 'down' ? 'var(--accent-coral)' : 'var(--glass-border)'}`,
              background: userVote === 'down' ? 'rgba(255, 107, 107, 0.15)' : 'var(--glass-bg)',
              color: userVote === 'down' ? 'var(--accent-coral)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <ThumbsDown size={14} />
            <AnimatePresence mode="wait">
              <motion.span
                key={votes.down.length}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {votes.down.length}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Add to Itinerary */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToItinerary}
          disabled={addedToItinerary}
          className={addedToItinerary ? 'btn btn-emerald btn-full btn-sm' : 'btn btn-primary btn-full btn-sm'}
          style={{
            fontSize: 12,
            gap: 5,
            opacity: addedToItinerary ? 0.8 : 1,
          }}
        >
          {addedToItinerary ? (
            <>
              <Check size={13} /> Added to Itinerary
            </>
          ) : (
            <>
              <Plus size={13} /> Add to Itinerary
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default VotingCard;
