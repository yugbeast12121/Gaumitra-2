# GAUMITRA - Cattle Breed and Buffalo Identification System

A comprehensive livestock identification system with an integrated AI chatbot for farming assistance.

## Features

### Core Application
- Multi-language support (12 Indian languages)
- User authentication system
- Cattle and buffalo breed identification
- Comprehensive breed information database

### AI Chatbot
- **Floating Widget**: Appears as a button in bottom-right corner
- **Full-Page Mode**: Expandable chat interface
- **Voice Input**: Speech-to-text for queries
- **Voice Output**: Text-to-speech for responses
- **Online Search**: Fetches live information from the web
- **Persistent History**: Conversation history maintained across modes
- **Modern UI**: Clean, professional chat interface

## Chatbot Features

### Voice Capabilities
- **Speech Recognition**: Click the microphone to speak your questions
- **Text-to-Speech**: Bot responses are automatically spoken
- **Voice Controls**: Stop speaking or listening at any time

### Search Integration
- **Live Data**: Fetches current information from online sources
- **Source Attribution**: Shows sources for information provided
- **Context Awareness**: Understands livestock and farming contexts

### User Experience
- **Persistent Chat**: History saved between widget and full-page modes
- **Typing Indicators**: Shows when bot is processing
- **Message Timestamps**: Track conversation timeline
- **Clear History**: Option to reset conversation

## Technical Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── ChatbotWidget.tsx      # Main chatbot interface
│   ├── MainApp.tsx            # Core application
│   ├── AuthPage.tsx           # Authentication
│   └── LanguageSelector.tsx   # Language selection
├── hooks/
│   └── useChatbot.ts          # Chatbot state management
├── services/
│   ├── chatbotService.ts      # Search and AI integration
│   ├── authService.ts         # Authentication logic
│   └── breedIdentification.ts # Breed identification
├── types/
│   ├── chatbot.ts             # Chatbot type definitions
│   ├── auth.ts                # Authentication types
│   └── language.ts            # Language types
└── data/
    ├── breeds.json            # Breed database
    └── translations.ts        # Multi-language support
```

### Key Dependencies
- **react-speech-kit**: Voice recognition and synthesis
- **axios**: HTTP requests for search APIs
- **uuid**: Unique message identifiers
- **date-fns**: Timestamp formatting

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (Production)
Create a `.env` file for production APIs:
```env
# Google Custom Search (optional)
REACT_APP_GOOGLE_API_KEY=your_google_api_key
REACT_APP_SEARCH_ENGINE_ID=your_search_engine_id

# OpenAI API (optional)
REACT_APP_OPENAI_API_KEY=your_openai_api_key

# Other search APIs
REACT_APP_BING_API_KEY=your_bing_api_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

## Chatbot Integration

### Adding to Existing Websites
The chatbot is designed to be modular. To integrate into other websites:

1. **Copy Components**: Copy the chatbot components and hooks
2. **Install Dependencies**: Add required packages
3. **Import Widget**: Add `<ChatbotWidget />` to your app
4. **Configure APIs**: Set up search and AI service endpoints

### Customization Options

#### Styling
- Modify colors in `ChatbotWidget.tsx`
- Adjust positioning and sizing
- Customize animations and transitions

#### Functionality
- Replace mock search with real APIs in `chatbotService.ts`
- Add custom knowledge base
- Implement user authentication integration

#### Voice Settings
- Configure speech recognition language
- Adjust speech synthesis voice and rate
- Add voice command shortcuts

## API Integration Guide

### Search APIs
Replace the mock search in `chatbotService.ts` with:

#### Google Custom Search
```typescript
const searchResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
  params: {
    key: process.env.REACT_APP_GOOGLE_API_KEY,
    cx: process.env.REACT_APP_SEARCH_ENGINE_ID,
    q: query,
    num: 3
  }
});
```

#### Bing Search API
```typescript
const searchResponse = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.REACT_APP_BING_API_KEY
  },
  params: {
    q: query,
    count: 3
  }
});
```

### AI Processing
Integrate with AI services for better responses:

#### OpenAI Integration
```typescript
const aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant specializing in livestock and agriculture.'
    },
    {
      role: 'user',
      content: query
    }
  ]
}, {
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
  }
});
```

## Browser Compatibility

### Voice Features
- **Chrome**: Full support for speech recognition and synthesis
- **Firefox**: Limited speech synthesis support
- **Safari**: Basic speech synthesis support
- **Edge**: Full support for speech features

### Fallbacks
- Voice input gracefully degrades to text-only on unsupported browsers
- All core functionality works without voice features

## Performance Optimization

### Lazy Loading
- Chatbot components load only when needed
- Search results cached for repeated queries
- Message history stored efficiently in localStorage

### Memory Management
- Automatic cleanup of speech synthesis
- Message history limits to prevent memory bloat
- Efficient re-rendering with React hooks

## Security Considerations

### API Keys
- Store API keys in environment variables
- Use server-side proxy for sensitive operations
- Implement rate limiting for API calls

### User Data
- Chat history stored locally (localStorage)
- No sensitive data transmitted to external APIs
- Optional user authentication integration

## Deployment

### Static Hosting
The application can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Server Requirements
For full functionality with real APIs:
- Node.js backend for API proxy
- Environment variable management
- HTTPS for speech recognition (browser requirement)

## Support and Maintenance

### Monitoring
- Track API usage and costs
- Monitor speech recognition accuracy
- Log user interaction patterns

### Updates
- Regular dependency updates
- API endpoint maintenance
- Voice model improvements

## License

This project is created for educational and demonstration purposes. Please ensure compliance with all API terms of service when implementing in production.