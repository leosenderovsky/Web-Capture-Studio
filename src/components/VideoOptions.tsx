import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const VideoOptions = () => {
  const { videoOptions: opts, setVideoOptions: setOpts, mode, jobs } = useAppStore();
  if (mode !== 'video') return null;

  const isGenerating = jobs.some(j => j.status === 'loading');

  const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      disabled={isGenerating}
      onClick={onClick}
      className={twMerge(clsx(
        'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
        active ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200',
        isGenerating && 'opacity-50 cursor-not-allowed'
      ))}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-700/50 pb-2">
        Video Options
      </h3>

      <div className="space-y-4 text-sm">
        <div className="space-y-2">
          <span className="text-slate-400">Duration</span>
          <div className="flex gap-2">
            {([5, 10, 20, 30] as const).map(d => (
              <Pill key={d} active={opts.duration === d} onClick={() => setOpts({ duration: d })}>
                {d}s
              </Pill>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-slate-400">Scroll Speed</span>
          <div className="flex gap-2">
            {(['slow', 'medium', 'fast'] as const).map(s => (
              <Pill key={s} active={opts.scrollSpeed === s} onClick={() => setOpts({ scrollSpeed: s })}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Pill>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Delay before start</span>
          <select
            disabled={isGenerating}
            value={opts.delay}
            onChange={(e) => setOpts({ delay: parseInt(e.target.value) })}
            className="bg-slate-800 text-white border border-slate-700 rounded-md px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>0s</option>
            <option value={1}>1s</option>
            <option value={2}>2s</option>
            <option value={3}>3s</option>
          </select>
        </div>

        <p className="text-xs text-slate-500 mt-4 leading-relaxed bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
          Scroll Speed adjusts effective capture duration: Slow = 1.5×, Medium = 1×, Fast = 0.6× of the selected duration (max 30s). Output frame rate is fixed by the ScreenshotOne API (~30fps).
        </p>
      </div>
    </div>
  );
};
