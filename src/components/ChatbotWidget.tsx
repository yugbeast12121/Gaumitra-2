import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Trash2,
  Bot,
  User as UserIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useChatbot } from '../hooks/useChatbot';

const ChatbotWidget: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    isOpen,
    isFullPage,
    messages,
    isLoading,
    isListening,
    isSpeaking,
    speechSupported,
    toggleChatbot,
    toggleFullPage,
    closeChatbot,
    handleSendMessage,
    startListening,
    stopListening,
    stopSpeaking,
    clearHistory
  } = useChatbot();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 
                   hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg 
                   hover:shadow-xl transition-all duration-300 transform hover:scale-110 
                   flex items-center justify-center z-50 group"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </button>
    );
  }

  // Chat interface
  const chatContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">GAUMITRA Assistant</h3>
            <p className="text-xs opacity-90">
              {isLoading ? 'Thinking...' : 'Online • Ready to help'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Clear History */}
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          {/* Toggle Full Page */}
          <button
            onClick={toggleFullPage}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title={isFullPage ? 'Minimize' : 'Maximize'}
          >
            {isFullPage ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          {/* Close */}
          <button
            onClick={closeChatbot}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              Welcome to GAUMITRA Assistant!
            </h4>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              I can help you with cattle breeds, livestock management, and farming questions. 
              Ask me anything!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <Bot className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  )}
                  {message.isUser && (
                    <UserIcon className="w-4 h-4 text-white/80 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    {message.isTyping ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p className={`text-xs mt-1 ${
                          message.isUser ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about cattle breeds, farming tips..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         resize-none transition-all duration-200"
              disabled={isLoading}
            />
            
            {/* Voice Input Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full 
                           transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl 
                         transition-colors duration-200"
              title="Stop speaking"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 
                       hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-105 disabled:transform-none"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {speechSupported && (
              <span className="flex items-center space-x-1">
                <Mic className="w-3 h-3" />
                <span>Voice enabled</span>
              </span>
            )}
            {isSpeaking && (
              <span className="flex items-center space-x-1 text-blue-500">
                <Volume2 className="w-3 h-3" />
                <span>Speaking...</span>
              </span>
            )}
            {isListening && (
              <span className="flex items-center space-x-1 text-red-500">
                <Mic className="w-3 h-3" />
                <span>Listening...</span>
              </span>
            )}
          </div>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );

  // Full page mode
  if (isFullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
          {chatContent}
        </div>
      </div>
    );
  }

  // Widget mode
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl 
                    border border-gray-200 overflow-hidden z-50 transform transition-all duration-300">
      {chatContent}
    </div>
  );
};

export default ChatbotWidget;