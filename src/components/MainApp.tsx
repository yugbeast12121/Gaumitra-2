import React, { useState, useRef } from 'react';
import { Upload, Camera, Info, Heart, Globe, LogOut, User } from 'lucide-react';
import { identifyBreed, IdentificationResult } from '../services/breedIdentification';
import { Language } from '../types/language';
import { translations } from '../data/translations';
import { logout } from '../services/authService';
import { User as UserType } from '../types/auth';

interface MainAppProps {
  selectedLanguage: Language;
  onLanguageChange: () => void;
  user: UserType;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ selectedLanguage, onLanguageChange, user, onLogout }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[selectedLanguage.code as keyof typeof translations] || translations.en;

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage || !fileInputRef.current?.files?.[0]) return;

    setIsLoading(true);
    try {
      const result = await identifyBreed(fileInputRef.current.files[0]);
      setResult(result);
    } catch (error) {
      console.error('Error identifying cow breed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 font-figtree">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 relative overflow-hidden">
        {/* Cow Pattern Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://imgs.search.brave.com/Js7wjO3Cnwii-13gu4_1W7YTBwwsAiFsO50Gp4lgSmA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzM4ODc5MDcxL3Iv/aWwvZmVkNDdiLzQ0/MzEyNTg5NjQvaWxf/NjAweDYwMC40NDMx/MjU4OTY0XzdqZnQu/anBn")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }}
        >
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-6">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/220/220127.png" 
                alt="Cow Icon" 
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
              />
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                  <span className="text-black font-black tracking-wide">
                    {t.title}
                  </span>
                </h1>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-semibold mt-1">
                  {t.subtitle}
                </p>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>
              
              {/* Language Switcher */}
              <button
                onClick={onLanguageChange}
                className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 
                           text-blue-800 px-4 py-2 rounded-full transition-colors duration-300
                           focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Globe className="w-5 h-5" />
                <span className="text-2xl">{selectedLanguage.flag}</span>
                <span className="hidden sm:inline font-medium">{selectedLanguage.nativeName}</span>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 
                           text-red-800 px-4 py-2 rounded-full transition-colors duration-300
                           focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Upload Section */}
        <div className="bg-black rounded-2xl p-1 transition-all duration-300 hover:shadow-2xl group relative">
          <div className="bg-gray-900 rounded-xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {t.uploadTitle}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {t.uploadSubtitle}
              </p>
            </div>

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-500 hover:animate-green-light ${
                isDragOver
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-gray-600 hover:border-green-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded animal"
                    className="max-h-64 sm:max-h-80 mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-green-400 font-medium">{t.uploadSuccess}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-white text-lg sm:text-xl font-medium mb-2">
                      {t.uploadPlaceholder}
                    </p>
                    <p className="text-gray-400 text-sm sm:text-base">
                      {t.uploadFormat}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {uploadedImage && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 
                           text-white font-bold py-3 px-8 sm:px-12 rounded-full text-lg 
                           transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center space-x-3 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t.identifying}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      <span>{t.identifyButton}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Best Results Tips */}
        {!result && !uploadedImage && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              {t.tipsTitle}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-base sm:text-lg">
                  {t.tip1}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-base sm:text-lg">
                  {t.tip2}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-base sm:text-lg">
                  {t.tip3}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-base sm:text-lg">
                  {t.tip4}
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <Info className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {t.resultsTitle}
              </h3>
              <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {result.confidence}% {t.confidence}
              </div>
            </div>

            <div className="space-y-6">
              {/* Breed Name */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-green-600 mb-2">
                  {t.breedName}
                </h4>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {result.breedName}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
                  {t.description}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* Purpose */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-purple-600 mb-2">
                  {t.purpose}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {result.purpose}
                </p>
              </div>

              {/* Milk Yield */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-2">
                  {t.milkYield}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg">
                  {result.milkYield}
                </p>
              </div>

              {/* Region */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-red-600 mb-2">
                  {t.region}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg">
                  {result.region}
                </p>
              </div>

              {/* Physical Traits */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-indigo-600 mb-2">
                  {t.physicalTraits}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {result.physicalTraits}
                </p>
              </div>

              {/* Management Tips */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-teal-600 mb-2">
                  {t.managementTips}
                </h4>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {result.managementTips}
                </p>
              </div>
            </div>

            {/* Try Another Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setResult(null);
                  setUploadedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                         text-white font-bold py-3 px-8 rounded-full text-lg 
                         transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {t.tryAnother}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm sm:text-base">
              {t.poweredBy} <span className="font-bold text-green-400">AgroMinds</span> | 
              {t.createdBy} <span className="font-bold text-blue-400">Yug Malviya</span> {t.forSih}{' '}
              <Heart className="inline w-4 h-4 text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainApp;