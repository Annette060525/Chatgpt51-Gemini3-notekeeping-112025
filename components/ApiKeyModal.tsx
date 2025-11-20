import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { I18N } from '../constants';
import { geminiService } from '../services/geminiService';
import { Key, Lock } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { language } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [key, setKey] = useState('');

  useEffect(() => {
    const envKey = process.env.API_KEY;
    if (envKey) {
      geminiService.setApiKey(envKey);
      setIsOpen(false);
      return;
    }

    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setKey(storedKey);
      geminiService.setApiKey(storedKey);
      setIsOpen(false);
    }
  }, []);

  const handleSave = () => {
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key);
      geminiService.setApiKey(key);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const t = I18N[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-primary">
        <div className="flex items-center gap-3 mb-4 text-primary">
          <Lock className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{t.apiKeyNeeded}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t.apiKeyDesc}
        </p>
        <div className="relative mb-6">
          <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-[1.02] active:scale-95"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
};