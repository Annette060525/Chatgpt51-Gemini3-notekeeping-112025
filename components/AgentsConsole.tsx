import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { useTheme } from './ThemeContext';
import { I18N } from '../constants';

interface Props {
  systemPrompt: string;
  model: string;
}

export const AgentsConsole: React.FC<Props> = ({ systemPrompt, model }) => {
  const { language } = useTheme();
  const t = I18N[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Include history + new message
      const history = [...messages, userMsg];
      const responseText = await geminiService.generateResponse(model, history, systemPrompt);
      
      setMessages(prev => [...prev, { role: 'model', content: responseText, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: 'Error generating response', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
             <Bot size={64} className="mb-4" />
             <p>Start chatting with {model}</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary text-white'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tr-none' 
                : 'bg-secondary dark:bg-primary/20 text-gray-900 dark:text-gray-50 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 ml-14">
             <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
             <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
             <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-900/50 backdrop-blur border-t border-gray-100 dark:border-gray-800 rounded-t-xl">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder={t.inputPlaceholder}
            className="w-full pl-4 pr-12 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary resize-none shadow-inner text-gray-800 dark:text-gray-100 outline-none"
            rows={1}
            style={{ minHeight: '60px' }}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};