import { create } from 'zustand';
import { DevicePreset, Job, ScreenshotOptions, VideoOptions } from '../types';

interface AppState {
  url: string;
  mode: 'screenshot' | 'video';
  selectedDevices: DevicePreset[];
  screenshotOptions: ScreenshotOptions;
  videoOptions: VideoOptions;
  jobs: Job[];
  setUrl: (url: string) => void;
  setMode: (mode: 'screenshot' | 'video') => void;
  toggleDevice: (device: DevicePreset) => void;
  setScreenshotOptions: (opts: Partial<ScreenshotOptions>) => void;
  setVideoOptions: (opts: Partial<VideoOptions>) => void;
  generateAll: () => Promise<void>;
  clearResults: () => void;
}

const defaultDevices: DevicePreset[] = [
  { id: 'desktop-hd', label: 'Desktop HD', width: 1920, height: 1080, dpr: 1, userAgent: 'desktop', icon: 'monitor', category: 'responsive' },
  { id: 'desktop', label: 'Desktop', width: 1440, height: 900, dpr: 1, userAgent: 'desktop', icon: 'laptop', category: 'responsive' },
  { id: 'laptop', label: 'Laptop', width: 1280, height: 800, dpr: 1, userAgent: 'desktop', icon: 'laptop', category: 'responsive' },
  { id: 'ipad-pro', label: 'iPad Pro', width: 1024, height: 1366, dpr: 2, userAgent: 'tablet', icon: 'tablet', category: 'responsive' },
  { id: 'ipad', label: 'iPad', width: 768, height: 1024, dpr: 2, userAgent: 'tablet', icon: 'tablet', category: 'responsive' },
  { id: 'iphone-14-pro', label: 'iPhone 14 Pro', width: 393, height: 852, dpr: 3, userAgent: 'mobile', icon: 'smartphone', category: 'responsive' },
  { id: 'iphone-se', label: 'iPhone SE', width: 375, height: 667, dpr: 2, userAgent: 'mobile', icon: 'smartphone', category: 'responsive' },
  { id: 'android', label: 'Android', width: 360, height: 800, dpr: 3, userAgent: 'mobile', icon: 'smartphone', category: 'responsive' },
];

export const SOCIAL_IMAGE_PRESETS: DevicePreset[] = [
  { id: 'ig-square',      label: 'IG Square',      width: 1080, height: 1080, dpr: 1, userAgent: 'social', icon: 'square',      category: 'social-image', platform: 'instagram',  aspectRatio: '1:1'    },
  { id: 'ig-portrait',    label: 'IG Portrait',    width: 1080, height: 1350, dpr: 1, userAgent: 'social', icon: 'portrait',    category: 'social-image', platform: 'instagram',  aspectRatio: '4:5'    },
  { id: 'ig-landscape',   label: 'IG Landscape',   width: 1080, height: 566,  dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-image', platform: 'instagram',  aspectRatio: '1.91:1' },
  { id: 'ig-story-img',   label: 'IG Story',       width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',       category: 'social-image', platform: 'instagram',  aspectRatio: '9:16'   },
  { id: 'fb-feed',        label: 'FB Feed',        width: 1200, height: 630,  dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-image', platform: 'facebook',   aspectRatio: '1.91:1' },
  { id: 'x-post',         label: 'X / Twitter',   width: 1600, height: 900,  dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-image', platform: 'twitter',    aspectRatio: '16:9'   },
  { id: 'linkedin-post',  label: 'LinkedIn Post',  width: 1200, height: 627,  dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-image', platform: 'linkedin',   aspectRatio: '1.91:1' },
  { id: 'pinterest-pin',  label: 'Pinterest Pin',  width: 1000, height: 1500, dpr: 1, userAgent: 'social', icon: 'portrait',    category: 'social-image', platform: 'pinterest',  aspectRatio: '2:3'    },
  { id: 'yt-thumb',       label: 'YT Thumbnail',   width: 1280, height: 720,  dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-image', platform: 'youtube',    aspectRatio: '16:9'   },
  { id: 'tiktok-cover',   label: 'TikTok Cover',   width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',       category: 'social-image', platform: 'tiktok',     aspectRatio: '9:16'   },
];

export const SOCIAL_VIDEO_PRESETS: DevicePreset[] = [
  { id: 'ig-reels',       label: 'IG Reels',       width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',       category: 'social-video', platform: 'instagram',  aspectRatio: '9:16'   },
  { id: 'ig-feed-video',  label: 'IG Feed Video',  width: 1080, height: 1080, dpr: 1, userAgent: 'social', icon: 'square',      category: 'social-video', platform: 'instagram',  aspectRatio: '1:1'    },
  { id: 'tiktok-video',   label: 'TikTok',         width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',       category: 'social-video', platform: 'tiktok',     aspectRatio: '9:16'   },
  { id: 'yt-short',       label: 'YT Short',       width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',       category: 'social-video', platform: 'youtube',    aspectRatio: '9:16'   },
  { id: 'fb-reel',        label: 'FB Reel',        width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',       category: 'social-video', platform: 'facebook',   aspectRatio: '9:16'   },
  { id: 'yt-video',       label: 'YouTube Video',  width: 1920, height: 1080, dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-video', platform: 'youtube',    aspectRatio: '16:9'   },
  { id: 'linkedin-video', label: 'LinkedIn Video', width: 1920, height: 1080, dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-video', platform: 'linkedin',   aspectRatio: '16:9'   },
  { id: 'x-video',        label: 'X / Twitter Vid',width: 1280, height: 720,  dpr: 1, userAgent: 'social', icon: 'landscape',   category: 'social-video', platform: 'twitter',    aspectRatio: '16:9'   },
];

export const ALL_PRESETS = [...defaultDevices, ...SOCIAL_IMAGE_PRESETS, ...SOCIAL_VIDEO_PRESETS];

export const useAppStore = create<AppState>((set, get) => ({
  url: '',
  mode: 'screenshot',
  // Default select first two for quick start
  selectedDevices: [defaultDevices[1], defaultDevices[5]], 
  screenshotOptions: {
    format: 'png',
    quality: 90,
    fullPage: false,
    darkMode: false,
    delay: 0,
    blockAds: true,
  },
  videoOptions: {
    duration: 10,
    fps: 30,
    scrollSpeed: 'medium',
    delay: 1,
  },
  jobs: [],

  setUrl: (url) => set({ url }),
  setMode: (mode) => {
    get().clearResults();
    set({ mode });
  },
  toggleDevice: (device) => set((state) => {
    const exists = state.selectedDevices.find(d => d.id === device.id);
    if (exists) {
      return { selectedDevices: state.selectedDevices.filter(d => d.id !== device.id) };
    } else {
      return { selectedDevices: [...state.selectedDevices, device] };
    }
  }),
  setScreenshotOptions: (opts) => set((state) => ({ 
    screenshotOptions: { ...state.screenshotOptions, ...opts } 
  })),
  setVideoOptions: (opts) => set((state) => ({ 
    videoOptions: { ...state.videoOptions, ...opts } 
  })),

  clearResults: () => {
    const { jobs } = get();
    jobs.forEach(job => {
      if (job.resultUrl) {
        URL.revokeObjectURL(job.resultUrl);
      }
    });
    set({ jobs: [] });
  },

  generateAll: async () => {
    const state = get();
    const { url, mode, selectedDevices, screenshotOptions, videoOptions } = state;

    if (!url) return;

    // Create tracking jobs
    const timestamp = Date.now();
    const newJobs: Job[] = selectedDevices.map(device => ({
      id: `${device.id}-${timestamp}`,
      device,
      status: 'pending',
    }));

    set({ jobs: newJobs });

    const endpoint = mode === 'screenshot' ? '/api/screenshot' : '/api/video';

    await Promise.allSettled(
      newJobs.map(async (job) => {
        // Mark as loading
        set(state => ({
          jobs: state.jobs.map(j => j.id === job.id ? { ...j, status: 'loading' } : j)
        }));

        const startTime = performance.now();

        try {
          // Prepare payload depending on mode
          const payload = mode === 'screenshot' ? {
            url,
            viewportWidth: job.device.width,
            viewportHeight: job.device.height,
            deviceScaleFactor: job.device.dpr,
            userAgent: job.device.userAgent,
            ...screenshotOptions
          } : {
            url,
            viewportWidth: job.device.width,
            viewportHeight: job.device.height,
            ...videoOptions
          };

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => null);
            throw new Error(errData?.error || `HTTP ${response.status}`);
          }

          const blob = await response.blob();
          const resultUrl = URL.createObjectURL(blob);
          const generationTime = performance.now() - startTime;
          
          set(state => ({
            jobs: state.jobs.map(j => j.id === job.id ? {
              ...j,
              status: 'done',
              resultUrl,
              fileSize: blob.size,
              generationTime
            } : j)
          }));
        } catch (error: any) {
          set(state => ({
            jobs: state.jobs.map(j => j.id === job.id ? {
              ...j,
              status: 'error',
              errorMessage: error.message || 'Generation failed'
            } : j)
          }));
        }
      })
    );
  }
}));

export const ALL_DEVICES = defaultDevices;
