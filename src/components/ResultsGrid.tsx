import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ResultCard } from './ResultCard';
import { Image, MonitorPlay } from 'lucide-react';

export const ResultsGrid = () => {
  const { jobs, mode } = useAppStore();

  if (jobs.length === 0) {
    return (
      <div className="flex-1 border-2 border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center text-slate-500 p-8 min-h-[400px]">
        {mode === 'screenshot' ? <Image className="w-12 h-12 mb-4 opacity-50" /> : <MonitorPlay className="w-12 h-12 mb-4 opacity-50" />}
        <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to Capture</h3>
        <p className="text-center max-w-sm">Enter a URL and click Generate to see your multi-device preview.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(job => (
        <ResultCard key={job.id} job={job} isVideo={mode === 'video'} />
      ))}
    </div>
  );
};
