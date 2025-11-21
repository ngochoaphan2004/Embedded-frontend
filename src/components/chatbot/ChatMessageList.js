import React from 'react';

const MessageAvatar = ({ type, bgColor, icon }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: type === 'bot' ? 20 : 18,
      flexShrink: 0,
    }}
  >
    {icon}
  </div>
);

const formatMessage = (text) => {
  return text.split('\n').map((line, index) => {
    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={index} dangerouslySetInnerHTML={{ __html: boldText }} />;
  });
};

const LoadingIndicator = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: '10px',
    }}
  >
    <MessageAvatar type="bot" bgColor="#4CAF50" icon="🤖" />
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '18px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ animation: 'bounce 1s infinite', display: 'inline-block', fontSize: '12px' }}>●</span>
        <span style={{ animation: 'bounce 1s infinite 0.2s', display: 'inline-block', fontSize: '12px' }}>●</span>
        <span style={{ animation: 'bounce 1s infinite 0.4s', display: 'inline-block', fontSize: '12px' }}>●</span>
      </div>
    </div>
  </div>
);

const ChatMessageList = ({ messages, loading, messagesEndRef }) => (
  <div
    style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: '#f5f5f5',
    }}
  >
    {messages.map((msg, index) => (
      <div
        key={`${msg.timestamp.getTime()}-${index}`}
        style={{
          display: 'flex',
          justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        {msg.type === 'bot' && <MessageAvatar type="bot" bgColor="#4CAF50" icon="🤖" />}
        <div
          style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: '18px',
            backgroundColor: msg.type === 'user' ? '#007bff' : 'white',
            color: msg.type === 'user' ? 'white' : '#333',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            wordWrap: 'break-word',
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {formatMessage(msg.text)}
          </div>
          <div
            style={{
              fontSize: '11px',
              opacity: 0.7,
              marginTop: '4px',
            }}
          >
            {msg.timestamp.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        {msg.type === 'user' && <MessageAvatar type="user" bgColor="#007bff" icon="👤" />}
      </div>
    ))}
    {loading && <LoadingIndicator />}
    <div ref={messagesEndRef} />
  </div>
);

export default ChatMessageList;
