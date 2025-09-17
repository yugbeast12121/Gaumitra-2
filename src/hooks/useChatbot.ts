import { useState, useCallback, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatbotState } from '../types/chatbot';
import { searchAndAnswer } from '../services/chatbotService';
import { SUPPORTED_LANGUAGES } from '../types/language';

const STORAGE_KEY = 'gaumitra_chatbot_messages';
const VOICE_SETTINGS_KEY = 'gaumitra_voice_settings';

interface VoiceSettings {
  speechLanguage: string;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  recognitionLanguage: string;
}

const defaultVoiceSettings: VoiceSettings = {
  speechLanguage: 'en-US',
  speechRate: 1,
  speechPitch: 1,
  speechVolume: 1,
  recognitionLanguage: 'en-US'
};

export const useChatbot = () => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isFullPage: false,
    messages: [],
    isLoading: false,
    isListening: false,
    isSpeaking: false
  });

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem(VOICE_SETTINGS_KEY);
    return saved ? JSON.parse(saved) : defaultVoiceSettings;
  });

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const { speak, cancel: cancelSpeech, speaking, voices } = useSpeechSynthesis();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = voiceSettings.recognitionLanguage;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        setState(prev => ({ ...prev, isListening: true }));
      };

      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript;
        if (result) {
          handleSendMessage(result);
        }
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognitionInstance.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      setRecognition(recognitionInstance);
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }
  }, [voiceSettings.recognitionLanguage]);

  // Save voice settings when they change
  useEffect(() => {
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  // Get language mapping for speech
  const getLanguageCode = (languageCode: string): string => {
    const languageMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN'
    };
    return languageMap[languageCode] || 'en-US';
  };

  // Get best voice for language
  const getBestVoice = (languageCode: string) => {
    if (!voices.length) return null;
    
    const targetLang = getLanguageCode(languageCode);
    
    // Try to find exact match
    let voice = voices.find(v => v.lang === targetLang);
    
    // Try to find language family match (e.g., 'hi' for 'hi-IN')
    if (!voice) {
      const langFamily = targetLang.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(langFamily));
    }
    
    // Try to find any Indian English voice for Indian languages
    if (!voice && targetLang.includes('-IN')) {
      voice = voices.find(v => v.lang === 'en-IN');
    }
    
    // Fallback to default voice
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    return voice || voices[0];
  };

  // Update voice settings for language
  const updateLanguageSettings = useCallback((languageCode: string) => {
    const speechLang = getLanguageCode(languageCode);
    setVoiceSettings(prev => ({
      ...prev,
      speechLanguage: speechLang,
      recognitionLanguage: speechLang
    }));
  }, []);

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
    if (recognition) recognition.stop();
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
      if (response.answer && voiceSettings.speechLanguage) {
        const voice = getBestVoice(voiceSettings.speechLanguage.split('-')[0]);
        speak({ 
          text: response.answer,
          voice: voice,
          rate: voiceSettings.speechRate,
          pitch: voiceSettings.speechPitch,
          volume: voiceSettings.speechVolume
        });
      }
    } catch (error) {
      updateMessage(botMessageId, 'Sorry, I encountered an error while processing your request. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addMessage, updateMessage, speak]);

  const startListening = useCallback(() => {
    if (speechSupported) {
      if (recognition) {
        recognition.start();
      }
    }
  }, [recognition, speechSupported]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, [recognition]);

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
    speechSupported,
    voiceSettings,
    updateLanguageSettings,
    setVoiceSettings,
    availableVoices: voices
  };
};