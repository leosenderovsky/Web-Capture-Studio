import React, { useState } from 'react';
import { Job } from '../types';
import { Download, AlertCircle, RefreshCw, Maximize2, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const ResultCard: React.FC<{ job: Job, isVideo: boolean }> = ({ job, isVideo }) => {
  const { url, generateAll } = useAppStore(); // Assuming retry might need logic, but simplified to retry via global for now
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Shimmer loader
  if (job.status === 'pending' || job.status === 'loading') {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-[300px] animate-pulse">
        <div className="p-3 border-b border-slate-700/50 flex justify-between items-center">
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="flex-1 bg-slate-800/80 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-slate-600 border-t-slate-400 animate-spin"></div>
        </div>
        <div className="p-3 border-t border-slate-700/50 flex justify-between items-center bg-slate-800/60">
          <div className="h-3 bg-slate-700 rounded w-1/4"></div>
          <div className="h-6 w-20 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (job.status === 'error') {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl overflow-hidden flex flex-col h-[300px]">
        <div className="p-3 border-b border-red-900/50 flex justify-between items-center text-sm">
          <span className="font-medium text-red-200">{job.device.label}</span>
          <span className="text-red-400 font-mono text-xs">{job.device.width}x{job.device.height}</span>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-300 line-clamp-3">{job.errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-800 border items-stretch border-slate-700 rounded-xl overflow-hidden flex flex-col h-full shadow-lg group hover:border-slate-500 transition-colors">
        <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
          <span className="font-medium text-slate-200 text-sm">{job.device.label}</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-400 font-mono border border-slate-700">
            {job.device.width}x{job.device.height}
          </span>
        </div>
        
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[200px]">
          {isVideo ? (
            <video 
              src={job.resultUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full relative group/img cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
              <img 
                src={job.resultUrl} 
                alt={`${job.device.label} capture`} 
                className="absolute inset-0 w-full h-full object-cover sm:object-contain object-top transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                <div className="bg-black/60 text-white p-2 text-xs rounded-full backdrop-blur-md flex items-center gap-2 font-medium">
                  <Maximize2 className="w-4 h-4" /> Enlarge
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-700 flex flex-col gap-2 sm:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {job.fileSize && <span>{formatBytes(job.fileSize)}</span>}
            {job.generationTime && <span className="opacity-50">{(job.generationTime / 1000).toFixed(1)}s</span>}
          </div>
          <a
            href={job.resultUrl}
            download={`websnap_${job.device.id}.${isVideo ? 'mp4' : 'png'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors w-full sm:w-auto justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>

      {isFullscreen && !isVideo && job.resultUrl && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-full max-h-full overflow-auto rounded-lg shadow-2xl border border-slate-700/50">
            <img 
              src={job.resultUrl} 
              alt="Full preview" 
              className="max-w-full h-auto block"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};
