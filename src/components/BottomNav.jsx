import { motion } from 'framer-motion';
import { Home, MessageCircle, ThumbsUp, CreditCard, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat', badge: 3 },
  { id: 'vote', label: 'Vote', icon: ThumbsUp, path: '/vote' },
  { id: 'pay', label: 'Pay', icon: CreditCard, path: '/checkout' },
  { id: 'trip', label: 'Trip', icon: MapPin, path: '/trip' },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <motion.button
            key={item.id}
            className={`nav-item${active ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ position: 'relative' }}
          >
            {/* Active indicator bar */}
            {active && (
              <motion.div
                layoutId="activeNavIndicator"
                style={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  width: 20,
                  height: 3,
                  background: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-full)',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 10px rgba(124,58,237,0.5)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}

            {/* Icon container */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{
                  scale: active ? 1 : 1,
                  color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon
                  className="nav-icon"
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{
                    color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
                    transition: 'color 0.25s ease',
                  }}
                />
              </motion.div>

              {/* Notification badge */}
              {item.badge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    width: 16,
                    height: 16,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-coral)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'white',
                    boxShadow: '0 0 8px rgba(255,107,107,0.5)',
                    border: '2px solid var(--bg-primary)',
                  }}
                >
                  {item.badge}
                </motion.div>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'color 0.25s ease, font-weight 0.25s ease',
              }}
            >
              {item.label}
            </span>

            {/* Active glow background */}
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(124,58,237,0.08)',
                  zIndex: -1,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
