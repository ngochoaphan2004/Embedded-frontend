import React from 'react';

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  onVoiceToggle,
  voiceSupported,
  isListening,
  voicePreview,
  voiceError,
  voiceDisabled,
}) => (
  <form onSubmit={onSubmit} style={{ padding: '16px', borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
        type="button"
        onClick={onVoiceToggle}
        disabled={!voiceSupported || !!voiceDisabled}
        style={{
          padding: '12px 16px',
          borderRadius: '24px',
          border: '1px solid #e0e0e0',
          backgroundColor: isListening ? '#ffe6e6' : 'white',
          color: isListening ? '#d9534f' : '#555',
          fontSize: '14px',
          fontWeight: '600',
          cursor: !voiceSupported || voiceDisabled ? 'not-allowed' : 'pointer',
        }}
        title={voiceSupported ? 'Nhấn để đặt câu hỏi bằng giọng nói' : 'Trình duyệt chưa hỗ trợ ghi âm'}
      >
        {isListening ? 'Đang nghe...' : 'Nói'}
      </button>
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
    {(voiceError || (voiceSupported && (isListening || voicePreview))) && (
      <div style={{ marginTop: '8px', fontSize: '13px', color: voiceError ? '#d9534f' : '#555' }}>
        {voiceError && <span>{voiceError}</span>}
        {!voiceError && isListening && <span>Đang nghe bạn nói...</span>}
        {!voiceError && !isListening && voicePreview && (
          <span>Đã ghi lại: "{voicePreview}"</span>
        )}
      </div>
    )}
    {!voiceSupported && (
      <div style={{ marginTop: '8px', fontSize: '13px', color: '#d9534f' }}>
        Trình duyệt của bạn chưa hỗ trợ tính năng hỏi bằng giọng nói.
      </div>
    )}
  </form>
);

export default ChatInput;
