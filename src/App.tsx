import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import MainApp from './components/MainApp';
import { Language } from './types/language';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
  };

  const handleLanguageChange = () => {
    setShowLanguageSelector(true);
  };

  if (showLanguageSelector || !selectedLanguage) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <MainApp 
      selectedLanguage={selectedLanguage} 
      onLanguageChange={handleLanguageChange} 
    />
  );
}

export default App;