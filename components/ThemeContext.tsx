import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeVariant, Language } from '../types';
import { FLOWER_THEMES } from '../constants';

interface ThemeContextType {
  theme: ThemeVariant;
  setThemeId: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeVariant>(FLOWER_THEMES[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const setThemeId = (id: string) => {
    const found = FLOWER_THEMES.find(t => t.id === id);
    if (found) setTheme(found);
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      root.style.setProperty('--color-bg-light', theme.backgroundDark); // In dark mode, light bg is actually dark base
      root.style.setProperty('--color-bg-dark', '#000000');
      root.style.setProperty('--color-surface-light', theme.surfaceDark);
      root.style.setProperty('--color-surface-dark', '#111111');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-bg-light', theme.backgroundLight);
      root.style.setProperty('--color-bg-dark', theme.backgroundDark);
      root.style.setProperty('--color-surface-light', theme.surfaceLight);
      root.style.setProperty('--color-surface-dark', theme.surfaceDark);
    }

    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    
  }, [theme, darkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeId, darkMode, toggleDarkMode, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};