/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UrlInput } from './components/UrlInput';
import { ModeSelector } from './components/ModeSelector';
import { DevicePresetSelector } from './components/DevicePresetSelector';
import { ScreenshotOptions } from './components/ScreenshotOptions';
import { VideoOptions } from './components/VideoOptions';
import { ResultsGrid } from './components/ResultsGrid';
import { ExportBar } from './components/ExportBar';
import { Camera } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/50 backdrop-blur flex flex-col h-[50vh] lg:h-full z-20 shadow-2xl relative">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Web Capture Studio</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <ModeSelector />
            <DevicePresetSelector />
            <ScreenshotOptions />
            <VideoOptions />
            
            <div className="mt-12 text-xs text-slate-600 text-center flex flex-col gap-1 items-center justify-center">
              <p>Powered by ScreenshotOne & Browserless</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative h-[50vh] lg:h-full overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          {/* Subtle grid background overlay */}
          <div className="absolute inset-0 bg-slate-900/80 pointer-events-none" />
          
          <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 pb-32">
            <div className="max-w-6xl mx-auto space-y-8">
              <UrlInput />
              <div className="pb-8">
                <ResultsGrid />
              </div>
            </div>
          </div>
          
          <ExportBar />
        </main>
        
      </div>
    </div>
  );
}

