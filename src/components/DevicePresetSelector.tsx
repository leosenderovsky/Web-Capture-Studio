import React from 'react';
import { useAppStore, ALL_DEVICES } from '../store/useAppStore';
import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const iconMap: Record<string, any> = {
  desktop: Monitor,
  laptop: Laptop,
  tablet: Tablet,
  mobile: Smartphone,
};

export const DevicePresetSelector = () => {
  const { selectedDevices, toggleDevice, jobs } = useAppStore();
  const isGenerating = jobs.some(j => j.status === 'loading');

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Devices & Resolutions</h3>
      <div className="grid grid-cols-2 gap-3">
        {ALL_DEVICES.map((device) => {
          const isSelected = selectedDevices.some(d => d.id === device.id);
          const Icon = iconMap[device.userAgent] || Monitor;
          
          return (
            <button
              key={device.id}
              onClick={() => toggleDevice(device)}
              disabled={isGenerating}
              className={twMerge(
                clsx(
                  "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                  isSelected 
                    ? "border-blue-500 bg-blue-500/10" 
                    : "border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/60 hover:border-slate-600",
                  isGenerating && "opacity-50 cursor-not-allowed"
                )
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={clsx("w-4 h-4", isSelected ? "text-blue-400" : "text-slate-400")} />
                <span className={clsx("text-sm font-medium", isSelected ? "text-blue-100" : "text-slate-200")}>
                  {device.label}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {device.width}x{device.height} (DPR {device.dpr})
              </span>
            </button>
          )
        })}
      </div>
      {selectedDevices.length === 0 && (
        <p className="text-red-400 text-xs mt-3 flex items-center justify-center">Please select at least one device.</p>
      )}
    </div>
  );
};
