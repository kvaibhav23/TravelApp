import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Camera, CheckCircle2, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../index.css';

export default function QRScanner({ onClose }) {
  const { dispatch } = useApp();

  const fileInputRef = useRef(null);

  const [added, setAdded] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);

  const addReceipt = () => {
    if (!pendingImage) return;

    dispatch({
      type: 'ADD_RECEIPT',
      payload: {
        id: `r-${Date.now()}`,
        imageUrl: pendingImage,
        caption: 'Receipt photo',
        time: new Date().toISOString(),
      },
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setPendingImage(null);
      onClose?.();
    }, 1200);
  };

  const handlePick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result?.toString() || null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page" style={{ paddingTop: 'var(--space-md)' }}>
      <div className="flex items-center gap-sm mb-lg">
        <button className="btn btn-ghost btn-icon" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>
            <span className="text-gradient">Scan Receipts</span>
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Take a photo of your receipt and store it in your receipt gallery
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!added ? (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />

            <div
              className="glass-card"
              style={{
                padding: 16,
                textAlign: 'center',
                borderRadius: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 24,
                    background: 'rgba(124,58,237,0.08)',
                    border: '1px solid rgba(124,58,237,0.20)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Camera size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
              </div>

              <div style={{ fontWeight: 950, fontSize: 14, marginBottom: 6 }}>Add a receipt photo</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                Upload from camera or gallery. We’ll add it to your personal receipt gallery.
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="btn btn-ghost btn-full"
                onClick={handlePick}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                <Upload size={18} />
                Choose receipt photo
              </motion.button>

              {pendingImage && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--accent-emerald)', marginBottom: 10 }}>
                    Ready to save
                  </div>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <img src={pendingImage} alt="Receipt preview" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="btn btn-emerald btn-full"
                      onClick={addReceipt}
                      style={{ opacity: pendingImage ? 1 : 0.6 }}
                    >
                      Save to Receipts
                      <span style={{ marginLeft: 8 }}>→</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-md)' }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-lg)',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            >
              <CheckCircle2 size={40} style={{ color: 'var(--accent-emerald)' }} />
            </div>

            <div style={{ fontWeight: 900, color: 'var(--accent-emerald)', fontSize: 18, marginBottom: 6 }}>
              Receipt saved!
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Added to your receipt gallery.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
