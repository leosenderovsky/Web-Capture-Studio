import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Job } from '../types';

export const downloadAllAsZip = async (jobs: Job[], domain: string, mode: 'screenshot' | 'video', format: string = 'png') => {
  const zip = new JSZip();
  const successfulJobs = jobs.filter(j => j.status === 'done' && j.resultUrl);
  
  if (successfulJobs.length === 0) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  for (const job of successfulJobs) {
    if (!job.resultUrl) continue;
    
    // Fetch the blob from the object URL
    const response = await fetch(job.resultUrl);
    const blob = await response.blob();
    
    const ext = mode === 'screenshot' ? format : 'mp4';
    const filename = `websnap_${domain}_${job.device.id}_${timestamp}.${ext}`;
    
    zip.file(filename, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `websnap_${domain}_${timestamp}.zip`);
};

export const parseDomain = (url: string) => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch (e) {
    return 'website';
  }
};
