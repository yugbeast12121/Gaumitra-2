import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import { Language } from './types/language';
import { User } from './types/auth';
import { getCurrentUser, clearCurrentUser } from './services/authService';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
    
    // Check if user is already authenticated
    if (user) {
      // User is already logged in, go directly to main app
      setShowAuthPage(false);
    } else {
      // User needs to authenticate
      setShowAuthPage(true);
    }
  };

  const handleLanguageChange = () => {
    setShowLanguageSelector(true);
    setShowAuthPage(false);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAuthPage(false);
  };

  const handleLogout = () => {
    setUser(null);
    clearCurrentUser();
    setShowLanguageSelector(true);
    setShowAuthPage(false);
  };

  const handleBackToLanguageSelection = () => {
    setShowAuthPage(false);
    setShowLanguageSelector(true);
  };

  if (showLanguageSelector || !selectedLanguage) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  if (showAuthPage || !user) {
    return (
      <AuthPage 
        selectedLanguage={selectedLanguage}
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBackToLanguageSelection}
      />
    );
  }

  return (
    <MainApp 
      selectedLanguage={selectedLanguage} 
      onLanguageChange={handleLanguageChange} 
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;