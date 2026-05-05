import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Camera, Search, AlertCircle } from 'lucide-react';
import { parseDomain } from '../utils/download';

export const UrlInput = () => {
  const { url, setUrl, generateAll, jobs } = useAppStore();
  const [inputVal, setInputVal] = useState(url);
  const [error, setError] = useState('');

  const isGenerating = jobs.some(j => j.status === 'loading');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputVal.trim();
    if (!finalUrl) {
      setError('Please enter a URL');
      return;
    }
    
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      const parsed = new URL(finalUrl);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.startsWith('192.168.')) {
        setError("Private URLs can't be captured by external APIs.");
        return;
      }
      setError('');
      setUrl(finalUrl);
      // Wait for state to settle then generate
      setTimeout(() => generateAll(), 50);
    } catch {
      setError('Invalid URL format');
    }
  };

  const domain = url ? parseDomain(url) : '';

  return (
    <div className="w-full mb-6">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          {domain ? (
            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="favicon" className="w-5 h-5 opacity-80 rounded-[4px]" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter website URL (e.g. example.com)"
          className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-xl h-14 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={isGenerating || !inputVal.trim()}
          className="absolute right-2 px-5 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {isGenerating ? 'Wait...' : 'Generate'}
        </button>
      </form>
      {error && (
        <div className="mt-2 text-red-400 text-sm flex items-center gap-1.5 flex-row">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
