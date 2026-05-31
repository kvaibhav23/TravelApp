import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, ShieldCheck, ScanFace, CheckCircle2, Loader2 } from 'lucide-react';
import '../index.css';

const VERIFICATION_STAGES = [
  { id: 'upload', label: 'Uploading document...', icon: Upload, duration: 1200 },
  { id: 'verify', label: 'Verifying document...', icon: FileText, duration: 1400 },
  { id: 'face', label: 'Face match check...', icon: ScanFace, duration: 1300 },
  { id: 'done', label: 'Verified ✓', icon: CheckCircle2, duration: 0 },
];

export default function KYCVerification({ documentType = 'PAN Card', onComplete }) {
  const [status, setStatus] = useState('idle'); // idle | verifying | complete
  const [currentStage, setCurrentStage] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const runVerification = useCallback((name) => {
    setFileName(name);
    setStatus('verifying');
    setCurrentStage(0);

    let stage = 0;
    const advance = () => {
      stage += 1;
      if (stage < VERIFICATION_STAGES.length) {
        setCurrentStage(stage);
        if (stage < VERIFICATION_STAGES.length - 1) {
          setTimeout(advance, VERIFICATION_STAGES[stage].duration);
        } else {
          // Final stage – mark complete
          setTimeout(() => {
            setStatus('complete');
            onComplete?.();
          }, 600);
        }
      }
    };
    setTimeout(advance, VERIFICATION_STAGES[0].duration);
  }, [onComplete]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    runVerification(file?.name || `${documentType.replace(/\s/g, '_')}.pdf`);
  };

  const handleClick = () => {
    if (status !== 'idle') return;
    runVerification(`${documentType.replace(/\s/g, '_')}_scan.pdf`);
  };

  const stageProgress = status === 'complete'
    ? 100
    : status === 'verifying'
      ? ((currentStage) / (VERIFICATION_STAGES.length - 1)) * 100
      : 0;

  return (
    <div style={{ width: '100%' }}>
      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`kyc-upload-zone ${dragOver ? 'kyc-upload-zone-active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{
              padding: '40px 24px',
              border: `2px dashed ${dragOver ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              borderRadius: 'var(--radius-lg)',
              background: dragOver
                ? 'rgba(124, 58, 237, 0.1)'
                : 'var(--glass-bg)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.25s ease',
            }}
          >
            <motion.div
              animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(124, 58, 237, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Upload size={28} color="var(--accent-secondary)" />
            </motion.div>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              color: 'var(--text-primary)',
              marginBottom: 4,
              fontWeight: 600,
            }}>
              Upload {documentType}
            </p>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
            }}>
              Drag & drop or tap to simulate upload
            </p>
          </motion.div>
        )}

        {/* Verification Progress */}
        {status === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card"
            style={{ padding: 'var(--space-xl)' }}
          >
            {/* File info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              padding: '12px 16px',
              background: 'var(--glass-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
            }}>
              <FileText size={20} color="var(--accent-secondary)" />
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {fileName}
              </span>
              <span className="badge badge-primary">Processing</span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar" style={{ marginBottom: 24, height: 8 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: '0%' }}
                animate={{ width: `${stageProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%' }}
              />
            </div>

            {/* Stages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {VERIFICATION_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = idx === currentStage;
                const isComplete = idx < currentStage;
                const isPending = idx > currentStage;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{
                      opacity: isPending ? 0.35 : 1,
                      x: 0,
                    }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: isComplete
                        ? 'rgba(16, 185, 129, 0.2)'
                        : isActive
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'var(--glass-bg)',
                      border: `1px solid ${
                        isComplete
                          ? 'rgba(16, 185, 129, 0.4)'
                          : isActive
                            ? 'rgba(124, 58, 237, 0.4)'
                            : 'var(--glass-border)'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isComplete ? (
                        <CheckCircle2 size={18} color="var(--accent-emerald)" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                          <Loader2 size={18} color="var(--accent-secondary)" />
                        </motion.div>
                      ) : (
                        <Icon size={18} color="var(--text-muted)" />
                      )}
                    </div>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 600 : 400,
                      color: isComplete
                        ? 'var(--accent-emerald)'
                        : isActive
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                    }}>
                      {stage.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Success */}
        {status === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="glass-card"
            style={{
              padding: 'var(--space-xl)',
              textAlign: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.06)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <ShieldCheck size={36} color="var(--accent-emerald)" />
              </motion.div>
            </motion.div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-emerald)',
              marginBottom: 4,
            }}>
              {documentType} Verified
            </h4>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}>
              Identity verification completed successfully
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
