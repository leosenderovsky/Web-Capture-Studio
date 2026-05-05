import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ScreenshotOptions = () => {
  const { screenshotOptions: opts, setScreenshotOptions: setOpts, mode, jobs } = useAppStore();
  if (mode !== 'screenshot') return null;

  const isGenerating = jobs.some(j => j.status === 'loading');

  const Pill = ({ active, onClick, children }: any) => (
    <button
      disabled={isGenerating}
      onClick={onClick}
      className={twMerge(
        clsx(
          "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
          active ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200",
          isGenerating && "opacity-50 cursor-not-allowed"
        )
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-700/50 pb-2">Capture Options</h3>
      
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Format</span>
          <div className="flex gap-2">
            {(['png', 'jpg', 'webp'] as const).map(f => (
              <Pill key={f} active={opts.format === f} onClick={() => setOpts({ format: f })}>
                {f.toUpperCase()}
              </Pill>
            ))}
          </div>
        </div>

        {(opts.format === 'jpg' || opts.format === 'webp') && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Quality: {opts.quality}%</span>
            </div>
            <input
              type="range"
              min="10" max="100" step="5"
              disabled={isGenerating}
              value={opts.quality}
              onChange={(e) => setOpts({ quality: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Delay before capture</span>
          <select 
            disabled={isGenerating}
            value={opts.delay}
            onChange={(e) => setOpts({ delay: parseInt(e.target.value) })}
            className="bg-slate-800 text-white border border-slate-700 rounded-md px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>0s (Immediate)</option>
            <option value={1}>1s</option>
            <option value={2}>2s</option>
            <option value={3}>3s</option>
            <option value={5}>5s</option>
          </select>
        </div>

        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Full Page</span>
          <input type="checkbox" disabled={isGenerating} checked={opts.fullPage} onChange={(e) => setOpts({ fullPage: e.target.checked })} className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Dark Mode</span>
          <input type="checkbox" disabled={isGenerating} checked={opts.darkMode} onChange={(e) => setOpts({ darkMode: e.target.checked })} className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Block Ads & Cookie Banners</span>
          <input type="checkbox" disabled={isGenerating} checked={opts.blockAds} onChange={(e) => setOpts({ blockAds: e.target.checked })} className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
        </label>
      </div>
    </div>
  );
};
