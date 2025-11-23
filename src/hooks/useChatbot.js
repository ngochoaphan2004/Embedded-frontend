import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { buildChatbotResponse } from '../utils/chatbotResponse';

const INITIAL_MESSAGE = {
  type: 'bot',
  text: 'Xin chào! Tôi là chatbot hỗ trợ SmartFarm. Tôi có thể giúp bạn kiểm tra các thông số cảm biến như nhiệt độ, độ ẩm, độ ẩm đất, lượng mưa, mực nước, và trạng thái LED/máy bơm. Bạn muốn biết gì?',
  timestamp: new Date(),
};

const SENSOR_REFRESH_INTERVAL = 10000;

export const useChatbot = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchSensorData = useCallback(async () => {
    try {
      const res = await api.get('/api/data/realtime');
      if (res.data && res.data.data) {
        setSensorData(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu cảm biến:', error);
    }
  }, []);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, SENSOR_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (event) => {
    event?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const messagePayload = {
      type: 'user',
      text: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, messagePayload]);

    // Always send the user message + sensorData to backend Gemini endpoint
    try {
      const res = await api.post('/api/chatbot', {
        message: userMessage,
        includeSensors: true,
        sensorData,
      });

      const reply = res?.data?.data?.reply;
      const botText = reply || buildChatbotResponse(userMessage, sensorData);
      const botMessage = {
        type: 'bot',
        text: botText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('error calling /api/chatbot', err);
      // Fallback to local rule-based response
      const response = buildChatbotResponse(userMessage, sensorData);
      const botMessage = {
        type: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sensorData]);

  return {
    messages,
    loading,
    input,
    setInput,
    handleSend,
    messagesEndRef,
  };
};
