import React from 'react';

const ChatInput = ({ value, onChange, onSubmit, disabled }) => (
  <form onSubmit={onSubmit} style={{ padding: '16px', borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
    <div style={{ display: 'flex', gap: '10px' }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Nhập câu hỏi của bạn... (ví dụ: Nhiệt độ hiện tại là bao nhiêu?)"
        style={{
          flex: 1,
          padding: '12px 16px',
          borderRadius: '24px',
          border: '1px solid #e0e0e0',
          fontSize: '14px',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#007bff')}
        onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: '12px 24px',
          borderRadius: '24px',
          border: 'none',
          backgroundColor: !disabled ? '#007bff' : '#ccc',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: !disabled ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s',
        }}
      >
        Gửi
      </button>
    </div>
  </form>
);

export default ChatInput;
