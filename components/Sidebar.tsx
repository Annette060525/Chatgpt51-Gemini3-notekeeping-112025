import React from 'react';
import { Page, ModelProvider } from '../types';
import { FLOWER_THEMES, PROMPT_TEMPLATES, I18N } from '../constants';
import { useTheme } from './ThemeContext';
import { MessageSquare, Paperclip, FileText, BarChart, Flower2, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setPage: (p: Page) => void;
  provider: ModelProvider;
  setProvider: (p: ModelProvider) => void;
  model: string;
  setModel: (m: string) => void;
  promptId: string;
  setPromptId: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setPage,
  provider,
  setProvider,
  model,
  setModel,
  promptId,
  setPromptId
}) => {
  const { theme, setThemeId, darkMode, toggleDarkMode, language, setLanguage } = useTheme();
  const t = I18N[language];

  return (
    <aside className="w-72 h-screen flex flex-col border-r bg-surfaceLight dark:bg-surfaceDark border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary text-white">
          <Flower2 size={24} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          {t.title}
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavButton 
          active={currentPage === 'agents'} 
          onClick={() => setPage('agents')} 
          icon={<MessageSquare size={20} />} 
          label={t.agentsConsole} 
        />
        <NavButton 
          active={currentPage === 'attachment'} 
          onClick={() => setPage('attachment')} 
          icon={<Paperclip size={20} />} 
          label={t.attachmentChat} 
        />
        <NavButton 
          active={currentPage === 'notes'} 
          onClick={() => setPage('notes')} 
          icon={<FileText size={20} />} 
          label={t.notesStudio} 
        />
        <NavButton 
          active={currentPage === 'dashboard'} 
          onClick={() => setPage('dashboard')} 
          icon={<BarChart size={20} />} 
          label={t.dashboard} 
        />
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-5">
        
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Model Settings</label>
          <select 
            className="w-full p-2 rounded-md text-sm border bg-transparent dark:text-white dark:border-gray-700"
            value={provider}
            onChange={(e) => setProvider(e.target.value as ModelProvider)}
          >
            <option value="Gemini">Gemini</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Anthropic">Anthropic</option>
          </select>
          <select 
            className="w-full p-2 rounded-md text-sm border bg-transparent dark:text-white dark:border-gray-700"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {provider === 'Gemini' && (
              <>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
              </>
            )}
            {provider === 'OpenAI' && (
              <>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4o">GPT-4o</option>
              </>
            )}
             {provider === 'Anthropic' && (
              <>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </>
            )}
          </select>
        </div>

        {/* Prompt ID */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Prompt ID</label>
          <select 
             className="w-full p-2 rounded-md text-sm border bg-transparent dark:text-white dark:border-gray-700"
             value={promptId}
             onChange={(e) => setPromptId(e.target.value)}
          >
            {PROMPT_TEMPLATES.map(pt => (
              <option key={pt.id} value={pt.id}>{pt.label}</option>
            ))}
          </select>
        </div>

        {/* Appearance */}
        <div className="space-y-2">
           <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{t.theme}</label>
           <div className="flex items-center justify-between gap-2">
              <select 
                className="flex-1 p-2 rounded-md text-sm border bg-transparent dark:text-white dark:border-gray-700"
                value={theme.id}
                onChange={(e) => setThemeId(e.target.value)}
              >
                {FLOWER_THEMES.map(ft => (
                  <option key={ft.id} value={ft.id}>{language === 'en' ? ft.labelEN : ft.labelZH}</option>
                ))}
              </select>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              >
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </button>
           </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{t.language}</label>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button 
              className={`flex-1 text-xs py-1 rounded ${language === 'en' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`flex-1 text-xs py-1 rounded ${language === 'zhTW' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'}`}
              onClick={() => setLanguage('zhTW')}
            >
              繁體
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-secondary text-primary font-semibold shadow-sm' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);
