import React, { useState } from 'react';
import { UploadCloud, FileText, Send, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useTheme } from './ThemeContext';
import { I18N } from '../constants';

interface Props {
  model: string;
  systemPrompt: string;
}

export const AttachmentChat: React.FC<Props> = ({ model, systemPrompt }) => {
  const { language } = useTheme();
  const t = I18N[language];
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<{q: string, a: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileContent(null);
    setFileName(null);
    setHistory([]);
  };

  const handleAsk = async () => {
    if (!fileContent || !question.trim() || loading) return;
    setLoading(true);

    try {
      const answer = await geminiService.analyzeAttachment(model, fileContent, question, systemPrompt);
      setHistory(prev => [...prev, { q: question, a: answer }]);
      setQuestion('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-6 gap-6">
      {!fileContent ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-10 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <UploadCloud size={64} className="text-primary mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{t.upload}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
            Upload a text-based file (txt, md, csv, code) to start chatting with it.
          </p>
          <label className="cursor-pointer bg-primary hover:bg-accent text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.md,.csv,.json,.js,.ts,.py,.html" />
            Select File
          </label>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-secondary dark:bg-primary/20 p-4 rounded-xl border border-primary/20">
            <div className="flex items-center gap-3 text-primary dark:text-white">
              <FileText size={24} />
              <span className="font-semibold truncate max-w-[200px] md:max-w-md">{fileName}</span>
              <span className="text-xs opacity-70 bg-white dark:bg-black/20 px-2 py-1 rounded">{fileContent.length} chars</span>
            </div>
            <button onClick={clearFile} className="p-2 hover:bg-white/50 rounded-full transition-colors text-primary dark:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl rounded-tr-none shadow-sm border border-gray-100 dark:border-gray-700 ml-auto max-w-[85%]">
                  <p className="font-semibold text-primary text-sm mb-1">You</p>
                  <p className="text-gray-800 dark:text-gray-200">{item.q}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl rounded-tl-none border border-transparent mr-auto max-w-[85%]">
                  <p className="font-semibold text-primary text-sm mb-1">AI Analysis</p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.a}</p>
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-center py-4">
                 <span className="animate-pulse text-primary font-semibold">Analyzing document...</span>
               </div>
            )}
          </div>

          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about the file..."
              className="w-full pl-4 pr-14 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary shadow-sm resize-none outline-none dark:text-white"
              rows={1}
            />
            <button 
              onClick={handleAsk}
              disabled={loading}
              className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg shadow hover:bg-accent disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};