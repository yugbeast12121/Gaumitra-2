import { useState, useCallback, useEffect } from 'react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatbotState } from '../types/chatbot';
import { searchAndAnswer } from '../services/chatbotService';

const STORAGE_KEY = 'gaumitra_chatbot_messages';

export const useChatbot = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isFullPage: false,
    messages: [],
    isLoading: false,
    isListening: false,
    isSpeaking: false
  });

  const { speak, cancel: cancelSpeech, speaking } = useSpeechSynthesis();
  const { listen, stop: stopListening, supported: speechSupported } = useSpeechRecognition({
    onResult: (result: string) => {
      if (result) {
        handleSendMessage(result);
        setState(prev => ({ ...prev, isListening: false }));
      }
    },
    onError: (error: any) => {
      console.error('Speech recognition error:', error);
      setState(prev => ({ ...prev, isListening: false }));
    }
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setState(prev => ({ ...prev, messages }));
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (state.messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
    }
  }, [state.messages]);

  // Update speaking state
  useEffect(() => {
    setState(prev => ({ ...prev, isSpeaking: speaking }));
  }, [speaking]);

  const toggleChatbot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const toggleFullPage = useCallback(() => {
    setState(prev => ({ ...prev, isFullPage: !prev.isFullPage }));
  }, []);

  const closeChatbot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false, isFullPage: false }));
    cancelSpeech();
    stopListening();
  }, [cancelSpeech, stopListening]);

  const addMessage = useCallback((text: string, isUser: boolean, isTyping = false) => {
    const message: Message = {
      id: uuidv4(),
      text,
      isUser,
      timestamp: new Date(),
      isTyping
    };
    
    setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
    return message.id;
  }, []);

  const updateMessage = useCallback((id: string, text: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === id ? { ...msg, text, isTyping: false } : msg
      )
    }));
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, true);

    // Add typing indicator for bot
    const botMessageId = addMessage('', false, true);

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await searchAndAnswer(text);
      
      // Update bot message with actual response
      let fullResponse = response.answer;
      if (response.sources && response.sources.length > 0) {
        fullResponse += '\n\nSources:\n' + response.sources.map(source => 
          `• ${source.title}: ${source.snippet}`
        ).join('\n');
      }
      
      updateMessage(botMessageId, fullResponse);

      // Speak the response (only the main answer, not sources)
      if (response.answer) {
        speak({ text: response.answer });
      }
    } catch (error) {
      updateMessage(botMessageId, 'Sorry, I encountered an error while processing your request. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addMessage, updateMessage, speak]);

  const startListening = useCallback(() => {
    if (speechSupported) {
      setState(prev => ({ ...prev, isListening: true }));
      listen();
    }
  }, [listen, speechSupported]);

  const stopSpeaking = useCallback(() => {
    cancelSpeech();
  }, [cancelSpeech]);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    ...state,
    toggleChatbot,
    toggleFullPage,
    closeChatbot,
    handleSendMessage,
    startListening,
    stopListening,
    stopSpeaking,
    clearHistory,
    speechSupported
  };
};