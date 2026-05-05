import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Image, Video } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ModeSelector = () => {
  const { mode, setMode, jobs } = useAppStore();
  const isGenerating = jobs.some(j => j.status === 'loading');

  const modes = [
    { id: 'screenshot', label: 'Screenshots', icon: Image },
    { id: 'video', label: 'Video Scroll', icon: Video },
  ] as const;

  return (
    <div className="flex bg-slate-800/40 p-1 rounded-xl mb-8 relative">
      {modes.map((m) => {
        const isSelected = mode === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            disabled={isGenerating}
            onClick={() => setMode(m.id)}
            className={twMerge(
              clsx(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all relative z-10",
                isSelected ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30",
                isGenerating && "opacity-50 cursor-not-allowed"
              )
            )}
          >
            <Icon className="w-4 h-4" />
            {m.label}
          </button>
        );
      })}
      
      {/* Animated background pill */}
      <div 
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-700 rounded-lg shadow-sm transition-transform duration-300 ease-out pointer-events-none"
        style={{ transform: `translateX(${mode === 'screenshot' ? '4px' : 'calc(100% + 4px)'})` }}
      />
    </div>
  );
};
