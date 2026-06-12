import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';
import '../index.css';

export default function ReceiptGallery({ receipts, onClose }) {
  const list = useMemo(() => receipts || [], [receipts]);
  const [selected, setSelected] = useState(null);

  const open = (r) => setSelected(r);
  const close = () => setSelected(null);

  const navigate = (dir) => {
    if (!selected) return;
    const idx = list.findIndex((x) => x.id === selected.id);
    if (idx < 0) return;
    const next = (idx + dir + list.length) % list.length;
    setSelected(list[next]);
  };

  return (
    <div className="page" style={{ paddingTop: 'var(--space-md)' }}>
      <div className="flex items-center gap-sm mb-sm">
        <button className="btn btn-ghost btn-icon" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-sm">
            <Camera size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>My Receipts</h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'calc(18px + var(--space-sm))' }}>
            Photos added from “Scan Receipts”
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(124,58,237,0.10)',
                border: '1px solid rgba(124,58,237,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={18} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 14 }}>No receipts yet</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Scan receipts during your trip to keep everything organized.
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {list.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ aspectRatio: '1', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onClick={() => open(r)}
            >
              <img src={r.imageUrl} alt={r.caption || 'Receipt'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent 55%, rgba(0,0,0,0.55))',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
                className="receipt-overlay"
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
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
            onClick={close}
          >
            <motion.button
              onClick={close}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </motion.button>

            {list.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    color: 'white',
                    zIndex: 2,
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    color: 'white',
                    zIndex: 2,
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <motion.img
              key={selected.id}
              src={selected.imageUrl}
              alt={selected.caption || 'Receipt'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220 }}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 'var(--radius-lg)',
                objectFit: 'contain',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            />

            <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', maxWidth: 360 }}>
              <div style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                {selected.caption || 'Receipt'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
                {list.findIndex((x) => x.id === selected.id) + 1} of {list.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
