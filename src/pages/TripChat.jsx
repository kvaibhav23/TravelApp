import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Send, ChevronLeft, Shield, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAT_MESSAGES, GROUP_MEMBERS, REFUND_POLICY } from '../data/mockTravelData';
import ChatMessage from '../components/ChatMessage';
import TripHealthScore from '../components/TripHealthScore';
import '../index.css';

function TripChat() {
  const { state, dispatch } = useApp();
  const [inputText, setInputText] = useState('');
  const [showRefundBanner, setShowRefundBanner] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const messages = state.messages;
  const activeTrip = state.activeTrip;
  const members = state.groupMembers;

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage = {
      id: `m${Date.now()}`,
      userId: state.currentUser.id,
      text: trimmed,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      type: 'text',
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="app-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* ===== Sticky Header ===== */}
      <div
        className="sticky-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: '12px var(--space-md)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        {/* Back Button */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Trip Info */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {activeTrip.name}
          </h4>
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            {members.length} members · {activeTrip.dates}
          </span>
        </div>

        {/* Avatar Group */}
        <div className="avatar-group">
          {members.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="avatar avatar-sm"
              style={{
                background: member.color,
                fontSize: 9,
                width: 28,
                height: 28,
                border: '2px solid var(--bg-primary)',
              }}
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {members.length > 4 && (
            <div
              className="avatar avatar-sm"
              style={{
                background: 'var(--bg-tertiary)',
                fontSize: 9,
                width: 28,
                height: 28,
                border: '2px solid var(--bg-primary)',
                color: 'var(--text-secondary)',
              }}
            >
              +{members.length - 4}
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* ===== Trip Health Score ===== */}
      <TripHealthScore />

      {/* ===== Refund Transparency Banner ===== */}
      <AnimatePresence>
        {showRefundBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: '10px var(--space-md)',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 107, 107, 0.08))',
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <Shield size={14} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--accent-amber)',
                    display: 'block',
                    lineHeight: 1.3,
                  }}
                >
                  Cancellation Policy
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {REFUND_POLICY.full.text} · {REFUND_POLICY.partial.text}
                </span>
              </div>
              <button
                onClick={() => setShowRefundBanner(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  flexShrink: 0,
                }}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Scrollable Message Area ===== */}
      <div
        ref={messagesContainerRef}
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        {/* Date divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            justifyContent: 'center',
            padding: 'var(--space-sm) 0',
          }}
        >
          <div
            style={{
              height: 1,
              flex: 1,
              background: 'var(--glass-border)',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            Today
          </span>
          <div
            style={{
              height: 1,
              flex: 1,
              background: 'var(--glass-border)',
            }}
          />
        </div>

        {/* Messages */}
        {messages.map((msg, i) => (
          <ChatMessage key={msg.id} message={msg} index={i} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ===== Chat Input Bar ===== */}
      <div
        className="chat-input-bar"
        style={{
          padding: '10px var(--space-md)',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
          background: 'rgba(10, 10, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}
      >
        <input
          className="chat-input"
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
          }}
        />

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleSend}
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-full)',
            background: inputText.trim()
              ? 'var(--gradient-primary)'
              : 'var(--glass-bg)',
            border: inputText.trim()
              ? 'none'
              : '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'all 0.25s ease',
            boxShadow: inputText.trim() ? 'var(--shadow-glow)' : 'none',
            flexShrink: 0,
          }}
        >
          <Send
            size={16}
            color={inputText.trim() ? 'white' : 'var(--text-muted)'}
            style={{
              transform: 'rotate(-45deg)',
              marginLeft: -1,
              marginTop: -1,
            }}
          />
        </motion.button>
      </div>
    </div>
  );
}

export default TripChat;
