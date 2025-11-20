import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Sidebar } from './components/Sidebar';
import { AgentsConsole } from './components/AgentsConsole';
import { AttachmentChat } from './components/AttachmentChat';
import { NotesStudio } from './components/NotesStudio';
import { Dashboard } from './components/Dashboard';
import { Page, ModelProvider } from './types';
import { PROMPT_TEMPLATES } from './constants';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('agents');
  const [provider, setProvider] = useState<ModelProvider>('Gemini');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [promptId, setPromptId] = useState('custom');
  const [systemPrompt, setSystemPrompt] = useState(PROMPT_TEMPLATES[0].systemPrompt);

  // Update system prompt when ID changes
  useEffect(() => {
    const template = PROMPT_TEMPLATES.find(p => p.id === promptId);
    if (template) {
      setSystemPrompt(template.systemPrompt);
    }
  }, [promptId]);

  return (
    <div className="flex min-h-screen bg-bgLight dark:bg-bgDark transition-colors duration-300">
      <ApiKeyModal />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage}
        setPage={setCurrentPage}
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
        promptId={promptId}
        setPromptId={setPromptId}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-hidden relative">
        {currentPage === 'agents' && (
          <AgentsConsole systemPrompt={systemPrompt} model={model} />
        )}
        {currentPage === 'attachment' && (
          <AttachmentChat model={model} systemPrompt={systemPrompt} />
        )}
        {currentPage === 'notes' && (
          <NotesStudio model={model} />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;