import React, { useMemo, useState } from 'react';
import { useAppStore, ALL_DEVICES, SOCIAL_IMAGE_PRESETS, SOCIAL_VIDEO_PRESETS } from '../store/useAppStore';
import {
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Image as ImageIcon,
  Video,
  RectangleVertical,
  RectangleHorizontal,
  Square,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PresetCategory, DevicePreset } from '../types';

type Tab = { key: PresetCategory; label: string; Icon: any; showWhen?: 'always' | 'video-only' };

const tabs: Tab[] = [
  { key: 'responsive', label: 'Responsive', Icon: Monitor, showWhen: 'always' },
  { key: 'social-image', label: 'Social Image', Icon: ImageIcon, showWhen: 'always' },
  { key: 'social-video', label: 'Social Video', Icon: Video, showWhen: 'always' },
];

const iconMap: Record<string, any> = {
  portrait: RectangleVertical,
  landscape: RectangleHorizontal,
  square: Square,
  story: Smartphone,
  monitor: Monitor,
  laptop: Laptop,
  tablet: Tablet,
  smartphone: Smartphone,
  desktop: Monitor,
};

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  tiktok: '#69C9D0',
  facebook: '#1877F2',
  youtube: '#FF0000',
  twitter: '#000000',
  x: '#000000',
  linkedin: '#0A66C2',
  pinterest: '#E60023',
};

export const DevicePresetSelector: React.FC = () => {
  const { selectedDevices, toggleDevice, jobs, mode, clearDevices } = useAppStore();
  const isGenerating = jobs.some(j => j.status === 'loading');
  const [activeTab, setActiveTab] = useState<PresetCategory>('responsive');

  const visibleTabs = useMemo(() => tabs, []);

  const headerTitle = activeTab === 'responsive'
    ? 'Devices & Resolutions'
    : activeTab === 'social-image'
      ? 'Social Media Image Formats'
      : 'Social Media Video Formats';

  const socialSelectedCount = selectedDevices.filter(d => d.category === 'social-image' || d.category === 'social-video').length;

  const presetsToShow: DevicePreset[] = useMemo(() => {
    if (activeTab === 'responsive') return ALL_DEVICES;
    if (activeTab === 'social-image') return SOCIAL_IMAGE_PRESETS;
    return SOCIAL_VIDEO_PRESETS;
  }, [activeTab]);

  return (
    <div className="mb-8">
      <div className="mb-3">
        <div className="relative w-full bg-slate-800/30 rounded-md p-1 overflow-hidden" aria-hidden>
          <div
            className="absolute bg-slate-700 rounded-md transition-all duration-300 ease-out"
            style={{
              top: activeTab === 'responsive' ? '4px' : 'calc(50% + 2px)',
              left: activeTab === 'social-video' ? 'calc(50% + 2px)' : '4px',
              width: activeTab === 'responsive' ? 'calc(100% - 8px)' : 'calc(50% - 6px)',
              height: 'calc(50% - 6px)',
            }}
          />
          <div className="relative z-10 grid grid-cols-2 gap-1">
            {visibleTabs.map((t, idx) => {
              const TabIcon = t.Icon;
              const isActive = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={twMerge(clsx(
                    'min-w-0 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-semibold transition-colors whitespace-normal text-center',
                    isActive ? 'text-slate-100' : 'text-slate-300 hover:text-slate-100',
                    idx === 0 && 'col-span-2'
                  ))}
                >
                  <TabIcon className={clsx('w-5 h-5', isActive ? 'text-slate-100' : 'text-slate-300')} />
                  <span className="whitespace-normal">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          {headerTitle}{' '}
          {(activeTab === 'social-image' || activeTab === 'social-video') && socialSelectedCount > 0 && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-300">
              <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
              <span>({socialSelectedCount} selected)</span>
            </span>
          )}
        </h3>
        <div className="flex items-center gap-4">
          {selectedDevices.length > 0 && (
            <button
              onClick={clearDevices}
              disabled={isGenerating}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
            >
              Deselect all
            </button>
          )}
          {activeTab === 'social-video' && mode !== 'video' && (
            <div className="text-xs text-yellow-300">Switch to Video mode to use these presets</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {presetsToShow.map((device) => {
          const isSelected = selectedDevices.some(d => d.id === device.id);
          const Icon = iconMap[device.icon] || iconMap[device.userAgent] || Monitor;

          return (
              <button
              key={device.id}
              onClick={() => toggleDevice(device)}
              disabled={isGenerating}
              className={twMerge(clsx(
                'flex flex-col items-start p-3 rounded-xl border text-left transition-all overflow-hidden min-w-0 min-h-[96px]',
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/60 hover:border-slate-600',
                isGenerating && 'opacity-50 cursor-not-allowed'
              ))}
            >
              <div className="flex items-start gap-2 w-full mb-2 min-w-0">
                <Icon className={clsx('w-4 h-4 flex-shrink-0 mt-0.5', isSelected ? 'text-blue-400' : 'text-slate-400')} />
                <div className="flex flex-col">
                  <span className={clsx('text-base font-semibold', isSelected ? 'text-blue-100' : 'text-slate-200')}>
                    {device.label}
                  </span>
                  <div className="text-sm text-slate-400 font-mono mt-1">{device.width}x{device.height}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <div className="flex flex-col">
                  {device.platform && (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: platformColors[device.platform] || '#888' }} />
                      <span className="text-[12px]" style={{ color: platformColors[device.platform] || undefined }}>
                        {device.platform}
                      </span>
                    </span>
                  )}
                  {device.aspectRatio && (
                    <span className="text-slate-400 font-mono text-[12px] mt-1">{device.aspectRatio}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedDevices.length === 0 && (
        <p className="text-red-400 text-xs mt-3 flex items-center justify-center">Please select at least one device.</p>
      )}
    </div>
  );
};
