import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Image, X, ChevronRight, Camera } from 'lucide-react';
import '../index.css';

const PHOTOS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=400&fit=crop', caption: 'Beach sunset on Day 1' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', caption: 'Palolem Beach morning' },
  { id: 3, src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=400&fit=crop', caption: 'Crystal clear waters' },
  { id: 4, src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop', caption: 'Boat ride through backwaters' },
  { id: 5, src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop', caption: 'Fresh seafood dinner' },
  { id: 6, src: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=400&fit=crop', caption: 'Relaxing by the pool' },
  { id: 7, src: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&h=400&fit=crop', caption: 'Night market lights' },
  { id: 8, src: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=400&fit=crop', caption: 'Group adventure day' },
  { id: 9, src: 'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=400&h=400&fit=crop', caption: 'Sunset cruise vibes' },
  { id: 10, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop', caption: 'Mountain overlook view' },
  { id: 11, src: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&h=400&fit=crop', caption: 'Arrival at the airport' },
  { id: 12, src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop', caption: 'Road trip memories' },
];

export default function TripGallery({ onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openLightbox = (photo) => setSelectedPhoto(photo);
  const closeLightbox = () => setSelectedPhoto(null);

  const navigatePhoto = (direction) => {
    if (!selectedPhoto) return;
    const currentIdx = PHOTOS.findIndex(p => p.id === selectedPhoto.id);
    const nextIdx = (currentIdx + direction + PHOTOS.length) % PHOTOS.length;
    setSelectedPhoto(PHOTOS[nextIdx]);
  };

  return (
    <div className="page" style={{ paddingTop: 'var(--space-md)' }}>
      {/* Header */}
      <div className="flex items-center gap-sm mb-sm">
        <button className="btn btn-ghost btn-icon" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-sm">
            <Image size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>Trip Memories</h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'calc(18px + var(--space-sm))' }}>
            Auto-compiled from your trip dates & location
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-md" style={{
        background: 'var(--glass-bg)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm) var(--space-md)',
      }}>
        <div className="flex items-center gap-xs">
          <Camera size={14} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {PHOTOS.length} photos
          </span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          Aug 14 – Aug 17, 2025
        </span>
      </div>

      {/* Photo Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {PHOTOS.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => openLightbox(photo)}
            style={{
              aspectRatio: '1',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.img
              src={photo.src}
              alt={photo.caption}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Hover overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.5))',
              opacity: 0,
              transition: 'opacity 0.2s',
              pointerEvents: 'none',
            }}
              className="photo-overlay"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.92)',
              backdropFilter: 'blur(20px)',
              zIndex: 'var(--z-modal)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-md)',
            }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2,
              }}
            >
              <X size={20} />
            </motion.button>

            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto(-1); }}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2,
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto(1); }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2,
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <motion.img
              key={selectedPhoto.id}
              src={selectedPhoto.src.replace('w=400&h=400', 'w=800&h=600')}
              alt={selectedPhoto.caption}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 'var(--radius-lg)',
                objectFit: 'contain',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            />

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                marginTop: 'var(--space-lg)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                {selectedPhoto.caption}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>
                {PHOTOS.findIndex(p => p.id === selectedPhoto.id) + 1} of {PHOTOS.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
