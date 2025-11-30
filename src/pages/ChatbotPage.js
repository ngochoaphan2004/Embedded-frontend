import React, { useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useChatbot } from '../hooks/useChatbot';
import { useVoiceInput } from '../hooks/useVoiceInput';
import ChatMessageList from '../components/chatbot/ChatMessageList';
import ChatInput from '../components/chatbot/ChatInput';

const ChatbotPage = () => {
  const {
    messages,
    loading,
    input,
    setInput,
    handleSend,
    messagesEndRef,
    sendMessage,
  } = useChatbot();

  const handleVoiceFinal = useCallback((text) => {
    const cleanText = text?.trim();
    if (!cleanText || loading) {
      return;
    }
    sendMessage(cleanText);
  }, [loading, sendMessage]);

  const {
    isSupported: voiceSupported,
    isListening,
    transcript: voiceTranscript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({ onFinalTranscript: handleVoiceFinal });

  const handleVoiceToggle = useCallback(() => {
    if (!voiceSupported) {
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    resetTranscript();
    startListening();
  }, [voiceSupported, isListening, resetTranscript, startListening, stopListening]);

  return (
    <>
      <Header />
      <Sidebar />
      <main
        style={{
          marginLeft: 250,
          padding: 20,
          minHeight: 'calc(100vh - 140px)',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 20,
            color: '#333',
            textAlign: 'center',
          }}
        >
          🤖 SmartFarm AI Chatbot
        </h1>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            maxWidth: '900px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <ChatMessageList
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSend}
            disabled={!input.trim() || loading}
            onVoiceToggle={handleVoiceToggle}
            voiceSupported={voiceSupported}
            isListening={isListening}
            voicePreview={voiceTranscript}
            voiceError={voiceError}
            voiceDisabled={loading}
          />
        </div>
      </main>
    </>
  );
};

export default ChatbotPage;

