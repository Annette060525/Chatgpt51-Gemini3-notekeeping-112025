import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Wand2, Paintbrush, ArrowRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useTheme } from './ThemeContext';
import { I18N } from '../constants';

interface Props {
  model: string;
}

export const NotesStudio: React.FC<Props> = ({ model }) => {
  const { language } = useTheme();
  const t = I18N[language];
  const [rawNotes, setRawNotes] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [keywords, setKeywords] = useState('Important, Todo, Deadline, Idea');
  const [loading, setLoading] = useState(false);

  const handleTransform = async () => {
    if(!rawNotes.trim()) return;
    setLoading(true);
    const res = await geminiService.processNotes(model, rawNotes, 'markdown');
    setMarkdown(res);
    setLoading(false);
  };

  const handleImprove = async () => {
    if(!markdown.trim()) return;
    setLoading(true);
    const res = await geminiService.processNotes(model, markdown, 'improve');
    setMarkdown(res);
    setLoading(false);
  };

  const processKeywords = (md: string) => {
    if (!keywords.trim()) return md;
    const kws = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    let processed = md;
    kws.forEach(kw => {
       // Simple case-insensitive replacement wrapper
       const regex = new RegExp(`(${kw})`, 'gi');
       processed = processed.replace(regex, `<span style="background-color: var(--color-secondary); color: var(--color-primary); padding: 2px 6px; border-radius: 4px; font-weight: bold;">$1</span>`);
    });
    return processed;
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6">
      {/* Left: Input */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Raw Input</h3>
        <textarea
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          placeholder="Type your rough notes here..."
          className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary resize-y overflow-y-auto custom-scrollbar outline-none dark:text-white shadow-sm font-mono text-sm"
        />
        <div className="flex gap-3">
          <button 
            onClick={handleTransform}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white py-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-50"
          >
            <Wand2 size={18} /> {t.transformMarkdown}
          </button>
        </div>
      </div>

      {/* Center: Action Indicator (Desktop) */}
      <div className="hidden md:flex flex-col justify-center items-center text-gray-300 dark:text-gray-600">
        <ArrowRight size={32} />
      </div>

      {/* Right: Preview */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">AI Enhanced Preview</h3>
        
        <div className="flex flex-col gap-2">
           <label className="text-xs font-semibold uppercase text-gray-500">{t.keywords}</label>
           <input 
             value={keywords}
             onChange={(e) => setKeywords(e.target.value)}
             className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white"
           />
        </div>

        <div className="flex-1 relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
           <div className="absolute inset-0 overflow-y-auto p-6 markdown-preview text-gray-800 dark:text-gray-200 custom-scrollbar">
             {markdown ? (
               <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                 {processKeywords(markdown)}
               </ReactMarkdown>
             ) : (
               <div className="h-full flex items-center justify-center text-gray-400 italic">
                 AI output will appear here...
               </div>
             )}
           </div>
           {loading && (
             <div className="absolute inset-0 bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Wand2 className="animate-spin text-primary" size={32} />
                  <span className="font-bold text-primary">Generating magic...</span>
                </div>
             </div>
           )}
        </div>

        <button 
            onClick={handleImprove}
            disabled={loading || !markdown}
            className="flex items-center justify-center gap-2 bg-secondary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Paintbrush size={18} /> {t.improveFormat}
          </button>
      </div>
    </div>
  );
};