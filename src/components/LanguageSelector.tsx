import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES } from '../types/language';
import { translations } from '../data/translations';

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 font-figtree flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/220/220127.png" 
              alt="Cow Icon" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-800 mb-4">
            {translations.en.selectLanguage}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            {translations.en.languageSubtitle}
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => onLanguageSelect(language)}
              className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 
                         hover:shadow-2xl hover:border-blue-300 hover:bg-blue-50 
                         transition-all duration-300 transform hover:scale-105 
                         focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <div className="flex items-center justify-end mb-4">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 
                                     transition-colors duration-300 group-hover:translate-x-1" />
              </div>
              
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 
                               group-hover:text-blue-800 transition-colors duration-300">
                  {language.nativeName}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 
                               transition-colors duration-300">
                  {language.name}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm sm:text-base">
            Powered by <span className="font-bold text-green-500">AgroMinds</span> | 
            Created by <span className="font-bold text-blue-500">Yug Malviya</span> for SIH
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;