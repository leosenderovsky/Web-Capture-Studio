export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  dpr: number;
  userAgent: 'desktop' | 'tablet' | 'mobile';
  icon: string;
}

export interface ScreenshotOptions {
  format: 'png' | 'jpg' | 'webp';
  quality: number;
  fullPage: boolean;
  darkMode: boolean;
  delay: number;
  blockAds: boolean;
}

export interface VideoOptions {
  duration: 5 | 10 | 20 | 30;
  fps: 24 | 30 | 60;
  scrollSpeed: 'slow' | 'medium' | 'fast';
  delay: number;
}

export interface Job {
  id: string;
  device: DevicePreset;
  status: 'pending' | 'loading' | 'done' | 'error';
  resultUrl?: string; // Blob URL
  fileSize?: number;
  generationTime?: number;
  errorMessage?: string;
}
