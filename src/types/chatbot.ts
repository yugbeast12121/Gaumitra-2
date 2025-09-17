export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatbotState {
  isOpen: boolean;
  isFullPage: boolean;
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface ChatResponse {
  answer: string;
  sources?: SearchResult[];
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}