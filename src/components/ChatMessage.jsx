import { motion } from 'framer-motion';
import { GROUP_MEMBERS, CURRENT_USER } from '../data/mockTravelData';
import VotingCard from './VotingCard';
import '../index.css';

function ChatMessage({ message, index }) {
  if (!message) return null;

  const isSent = message.userId === CURRENT_USER.id;
  const isSystem = message.type === 'system';
  const isLink = message.type === 'link';

  // Look up sender info
  const sender = GROUP_MEMBERS.find((m) => m.id === message.userId);

  // System message
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '4px 0',
        }}
      >
        <div className="chat-bubble chat-bubble-system">{message.text}</div>
      </motion.div>
    );
  }

  // Link message — renders VotingCard inline
  if (isLink && message.linkData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.03 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSent ? 'flex-end' : 'flex-start',
          gap: 4,
        }}
      >
        {/* Sender info */}
        {!isSent && sender && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              paddingLeft: 44,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: sender.color || 'var(--text-secondary)',
              }}
            >
              {sender.name}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: isSent ? 'flex-end' : 'flex-start',
            gap: 8,
            flexDirection: isSent ? 'row-reverse' : 'row',
          }}
        >
          {/* Avatar */}
          {!isSent && sender && (
            <div
              className="avatar avatar-sm"
              style={{
                background: sender.color || 'var(--accent-primary)',
                marginTop: 2,
                fontSize: 10,
              }}
            >
              {sender.avatar}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '85%' }}>
            {/* URL text bubble */}
            <div
              className={`chat-bubble ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}
              style={{ fontSize: 12, opacity: 0.8 }}
            >
              {message.text}
            </div>
            {/* Voting Card */}
            <VotingCard destination={message.linkData} />
            {/* Timestamp */}
            <span
              style={{
                fontSize: 10,
                color: 'var(--text-muted)',
                alignSelf: isSent ? 'flex-end' : 'flex-start',
              }}
            >
              {message.time}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard text message
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSent ? 'flex-end' : 'flex-start',
        gap: 3,
      }}
    >
      {/* Sender name */}
      {!isSent && sender && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            paddingLeft: 44,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: sender.color || 'var(--text-secondary)',
            }}
          >
            {sender.name}
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          flexDirection: isSent ? 'row-reverse' : 'row',
        }}
      >
        {/* Avatar */}
        {!isSent && sender && (
          <div
            className="avatar avatar-sm"
            style={{
              background: sender.color || 'var(--accent-primary)',
              fontSize: 10,
            }}
          >
            {sender.avatar}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: isSent ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            className={`chat-bubble ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}
          >
            {message.text}
          </div>

          {/* Timestamp */}
          <span
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              paddingLeft: isSent ? 0 : 2,
              paddingRight: isSent ? 2 : 0,
            }}
          >
            {message.time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatMessage;
