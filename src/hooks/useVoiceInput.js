import { useCallback, useEffect, useRef, useState } from 'react';

const UNSUPPORTED_MESSAGE = 'Trinh duyet cua ban chua ho tro ghi am giong noi.';
const NO_SPEECH_MESSAGE = 'Khong nhan duoc am thanh. Vui long noi ro hon.';
const GENERIC_ERROR_MESSAGE = 'Da co loi khi thu am. Vui long thu lai.';

export const useVoiceInput = ({ lang = 'vi-VN', onFinalTranscript } = {}) => {
  const recognitionRef = useRef(null);
  const callbackRef = useRef(onFinalTranscript || null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    callbackRef.current = onFinalTranscript || null;
  }, [onFinalTranscript]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(UNSUPPORTED_MESSAGE);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const resultText = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();

      setTranscript(resultText);

      const last = event.results[event.results.length - 1];
      if (last?.isFinal && resultText) {
        callbackRef.current?.(resultText);
        setTranscript('');
      }
    };

    recognition.onerror = (event) => {
      setError(event.error === 'no-speech' ? NO_SPEECH_MESSAGE : GENERIC_ERROR_MESSAGE);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch (err) {
        // ignore stop errors during cleanup
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) {
      return;
    }

    setError(null);
    setTranscript('');
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      // start can throw if called twice rapidly
      if (process.env.NODE_ENV !== 'production') {
        console.warn('SpeechRecognition start error:', err);
      }
      setError(GENERIC_ERROR_MESSAGE);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isListening) {
      return;
    }

    try {
      recognition.stop();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('SpeechRecognition stop error:', err);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
