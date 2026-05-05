import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { downloadAllAsZip, parseDomain } from '../utils/download';
import { Download, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

export const ExportBar = () => {
  const { jobs, url, clearResults, mode, screenshotOptions } = useAppStore();
  const [isZipping, setIsZipping] = useState(false);

  if (jobs.length === 0) return null;

  const successfulJobs = jobs.filter(j => j.status === 'done' && j.resultUrl);
  const isGenerating = jobs.some(j => j.status === 'loading');

  if (successfulJobs.length === 0 && !isGenerating) return null;

  const handleDownload = async () => {
    setIsZipping(true);
    try {
      const domain = parseDomain(url);
      await downloadAllAsZip(jobs, domain, mode, screenshotOptions.format);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-80 right-0 p-4 pointer-events-none z-40">
      <div className="max-w-4xl mx-auto bg-slate-800/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto animate-in slide-in-from-bottom-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-medium text-slate-200">
              {isGenerating 
                ? `Generating ${jobs.filter(j => j.status === 'done').length} of ${jobs.length}...`
                : `Completed ${successfulJobs.length} captures`}
            </h4>
            <p className="text-xs text-slate-400">
              {isGenerating ? 'Please wait, depending on the site it might take a moment.' : 'Ready to export.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={clearResults}
            disabled={isGenerating}
            className="flex-1 sm:flex-none px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating || successfulJobs.length === 0 || isZipping}
            className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isZipping ? 'Zipping...' : 'Download ZIP'}
          </button>
        </div>
      </div>
    </div>
  );
};
