import { create } from 'zustand';
import { DevicePreset, Job, ScreenshotOptions, VideoOptions } from '../types';

// ─── AppState interface ───────────────────────────────────────────────────────

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
  clearDevices: () => void;
}

// ─── Default option values ────────────────────────────────────────────────────
// Extracted as named constants so they can be reused in setMode, clearResults,
// and post-generation reset inside generateAll.

const defaultScreenshotOptions: ScreenshotOptions = {
  format:            'png',
  quality:           90,
  fullPage:          false,
  darkMode:          false,
  delay:             0,
  blockAds:          true,
};

const defaultVideoOptions: VideoOptions = {
  duration:    10,
  scrollSpeed: 'medium',
  delay:       1,
};

// ─── Device presets ───────────────────────────────────────────────────────────

const defaultDevices: DevicePreset[] = [
  { id: 'desktop-hd',    label: 'Desktop HD',    width: 1920, height: 1080, dpr: 1, userAgent: 'desktop', icon: 'monitor',    category: 'responsive' },
  { id: 'desktop',       label: 'Desktop',       width: 1440, height: 900,  dpr: 1, userAgent: 'desktop', icon: 'laptop',     category: 'responsive' },
  { id: 'laptop',        label: 'Laptop',        width: 1280, height: 800,  dpr: 1, userAgent: 'desktop', icon: 'laptop',     category: 'responsive' },
  { id: 'ipad-pro',      label: 'iPad Pro',      width: 1024, height: 1366, dpr: 2, userAgent: 'tablet',  icon: 'tablet',     category: 'responsive' },
  { id: 'ipad',          label: 'iPad',          width: 768,  height: 1024, dpr: 2, userAgent: 'tablet',  icon: 'tablet',     category: 'responsive' },
  { id: 'iphone-14-pro', label: 'iPhone 14 Pro', width: 393,  height: 852,  dpr: 3, userAgent: 'mobile',  icon: 'smartphone', category: 'responsive' },
  { id: 'iphone-se',     label: 'iPhone SE',     width: 375,  height: 667,  dpr: 2, userAgent: 'mobile',  icon: 'smartphone', category: 'responsive' },
  { id: 'android',       label: 'Android',       width: 360,  height: 800,  dpr: 3, userAgent: 'mobile',  icon: 'smartphone', category: 'responsive' },
];

export const SOCIAL_IMAGE_PRESETS: DevicePreset[] = [
  { id: 'ig-square',     label: 'IG Square',     width: 1080, height: 1080, dpr: 1, userAgent: 'social', icon: 'square',   category: 'social-image', platform: 'instagram', aspectRatio: '1:1'    },
  { id: 'ig-portrait',   label: 'IG Portrait',   width: 1080, height: 1350, dpr: 1, userAgent: 'social', icon: 'portrait', category: 'social-image', platform: 'instagram', aspectRatio: '4:5'    },
  { id: 'ig-landscape',  label: 'IG Landscape',  width: 1080, height: 566,  dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-image', platform: 'instagram', aspectRatio: '1.91:1' },
  { id: 'ig-story-img',  label: 'IG Story',      width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',    category: 'social-image', platform: 'instagram', aspectRatio: '9:16'   },
  { id: 'fb-feed',       label: 'FB Feed',       width: 1200, height: 630,  dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-image', platform: 'facebook',  aspectRatio: '1.91:1' },
  { id: 'x-post',        label: 'X / Twitter',   width: 1600, height: 900,  dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-image', platform: 'twitter',   aspectRatio: '16:9'   },
  { id: 'linkedin-post', label: 'LinkedIn Post', width: 1200, height: 627,  dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-image', platform: 'linkedin',  aspectRatio: '1.91:1' },
  { id: 'pinterest-pin', label: 'Pinterest Pin', width: 1000, height: 1500, dpr: 1, userAgent: 'social', icon: 'portrait', category: 'social-image', platform: 'pinterest', aspectRatio: '2:3'    },
  { id: 'yt-thumb',      label: 'YT Thumbnail',  width: 1280, height: 720,  dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-image', platform: 'youtube',   aspectRatio: '16:9'   },
  { id: 'tiktok-cover',  label: 'TikTok Cover',  width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',    category: 'social-image', platform: 'tiktok',    aspectRatio: '9:16'   },
];

export const SOCIAL_VIDEO_PRESETS: DevicePreset[] = [
  { id: 'ig-reels',       label: 'IG Reels',        width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',    category: 'social-video', platform: 'instagram', aspectRatio: '9:16'  },
  { id: 'ig-feed-video',  label: 'IG Feed Video',   width: 1080, height: 1080, dpr: 1, userAgent: 'social', icon: 'square',   category: 'social-video', platform: 'instagram', aspectRatio: '1:1'   },
  { id: 'tiktok-video',   label: 'TikTok',          width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',    category: 'social-video', platform: 'tiktok',    aspectRatio: '9:16'  },
  { id: 'yt-short',       label: 'YT Short',        width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',    category: 'social-video', platform: 'youtube',   aspectRatio: '9:16'  },
  { id: 'fb-reel',        label: 'FB Reel',         width: 1080, height: 1920, dpr: 1, userAgent: 'social', icon: 'story',    category: 'social-video', platform: 'facebook',  aspectRatio: '9:16'  },
  { id: 'yt-video',       label: 'YouTube Video',   width: 1920, height: 1080, dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-video', platform: 'youtube',   aspectRatio: '16:9'  },
  { id: 'linkedin-video', label: 'LinkedIn Video',  width: 1920, height: 1080, dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-video', platform: 'linkedin',  aspectRatio: '16:9'  },
  { id: 'x-video',        label: 'X / Twitter Vid', width: 1280, height: 720,  dpr: 1, userAgent: 'social', icon: 'landscape',category: 'social-video', platform: 'twitter',   aspectRatio: '16:9'  },
];

export const ALL_PRESETS = [...defaultDevices, ...SOCIAL_IMAGE_PRESETS, ...SOCIAL_VIDEO_PRESETS];
export const ALL_DEVICES = defaultDevices;

// ─── Social viewport resolution ───────────────────────────────────────────────

/**
 * Maps any social preset to the closest responsive viewport for rendering.
 * Aspect ratio determines the device class:
 *   ratio < 0.9   → portrait (9:16, 4:5, 2:3) → mobile (iPhone 14 Pro)
 *   ratio 0.9–1.1 → square (1:1)               → tablet (iPad)
 *   ratio > 1.1   → landscape (16:9, 1.91:1)   → desktop
 *
 * For video: this IS the capture viewport (ScreenshotOne Animate has no separate output size).
 * For screenshots: this is the render viewport; social dimensions are sent as imageWidth/imageHeight.
 */
function resolveToResponsiveViewport(device: DevicePreset): {
  renderWidth:  number;
  renderHeight: number;
  userAgent:    'mobile' | 'tablet' | 'desktop';
} {
  const ratio = device.width / device.height;
  if (ratio < 0.9)  return { renderWidth: 393,  renderHeight: 852,  userAgent: 'mobile'  };
  if (ratio <= 1.1) return { renderWidth: 768,  renderHeight: 1024, userAgent: 'tablet'  };
  return              { renderWidth: 1440, renderHeight: 900,  userAgent: 'desktop' };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  url:              '',
  mode:             'screenshot',
  selectedDevices:  [defaultDevices[1], defaultDevices[5]], // Desktop + iPhone 14 Pro
  screenshotOptions: { ...defaultScreenshotOptions },
  videoOptions:      { ...defaultVideoOptions },
  jobs:             [],

  setUrl: (url) => set({ url }),

  // On mode change:
  // 1. Revoke existing blob URLs
  // 2. Filter selectedDevices — keep only presets compatible with the new mode
  // 3. Reset jobs and both option sets to defaults
  setMode: (mode) => {
    const { jobs, selectedDevices } = get();
    jobs.forEach(job => { if (job.resultUrl) URL.revokeObjectURL(job.resultUrl); });

    const compatibleDevices = selectedDevices.filter(d =>
      d.category === 'responsive' ||
      (mode === 'screenshot' && d.category === 'social-image') ||
      (mode === 'video'      && d.category === 'social-video')
    );

    set({
      mode,
      jobs:              [],
      selectedDevices:   compatibleDevices.length > 0 ? compatibleDevices : [defaultDevices[1], defaultDevices[5]],
      screenshotOptions: { ...defaultScreenshotOptions },
      videoOptions:      { ...defaultVideoOptions },
    });
  },

  toggleDevice: (device) => set((state) => {
    const exists = state.selectedDevices.find(d => d.id === device.id);
    return {
      selectedDevices: exists
        ? state.selectedDevices.filter(d => d.id !== device.id)
        : [...state.selectedDevices, device],
    };
  }),

  setScreenshotOptions: (opts) => set((state) => ({
    screenshotOptions: { ...state.screenshotOptions, ...opts },
  })),

  setVideoOptions: (opts) => set((state) => ({
    videoOptions: { ...state.videoOptions, ...opts },
  })),

  // Manual clear: revoke blobs, reset jobs AND selectedDevices to defaults.
  // Does NOT reset options (user may want to re-run with same settings).
  clearResults: () => {
    const { jobs } = get();
    jobs.forEach(job => { if (job.resultUrl) URL.revokeObjectURL(job.resultUrl); });
    set({
      jobs:            [],
      selectedDevices: [defaultDevices[1], defaultDevices[5]],
    });
  },

  clearDevices: () => set({ selectedDevices: [] }),

  generateAll: async () => {
    const { url, mode, selectedDevices, screenshotOptions, videoOptions } = get();
    if (!url || selectedDevices.length === 0) return;

    const timestamp = Date.now();
    const newJobs: Job[] = selectedDevices.map(device => ({
      id:     `${device.id}-${timestamp}`,
      device,
      status: 'pending',
    }));

    set({ jobs: newJobs });

    const endpoint = mode === 'screenshot' ? '/api/screenshot' : '/api/video';

    await Promise.allSettled(
      newJobs.map(async (job) => {
        set(state => ({
          jobs: state.jobs.map(j => j.id === job.id ? { ...j, status: 'loading' } : j),
        }));

        const startTime = performance.now();

        try {
          const isSocialPreset =
            job.device.category === 'social-image' ||
            job.device.category === 'social-video';

          let payload: Record<string, unknown>;

          if (mode === 'screenshot') {
            if (isSocialPreset) {
              const resolved = resolveToResponsiveViewport(job.device);
              payload = {
                url,
                viewportWidth:       resolved.renderWidth,
                viewportHeight:      resolved.renderHeight,
                deviceScaleFactor:   1,
                userAgent:           resolved.userAgent,
                imageWidth:          job.device.width,
                imageHeight:         job.device.height,
                ...screenshotOptions,
              };
            } else {
              payload = {
                url,
                viewportWidth:       job.device.width,
                viewportHeight:      job.device.height,
                deviceScaleFactor:   job.device.dpr,
                userAgent:           job.device.userAgent,
                ...screenshotOptions,
              };
            }
          } else {
            // Video: pass scrollSpeed and duration raw — video.ts computes effectiveDuration
            if (isSocialPreset) {
              const resolved = resolveToResponsiveViewport(job.device);
              payload = {
                url,
                viewportWidth:  resolved.renderWidth,
                viewportHeight: resolved.renderHeight,
                userAgent:      resolved.userAgent,
                duration:       videoOptions.duration,
                scrollSpeed:    videoOptions.scrollSpeed,
                delay:          videoOptions.delay,
              };
            } else {
              payload = {
                url,
                viewportWidth:  job.device.width,
                viewportHeight: job.device.height,
                userAgent:      job.device.userAgent,
                duration:       videoOptions.duration,
                scrollSpeed:    videoOptions.scrollSpeed,
                delay:          videoOptions.delay,
              };
            }
          }

          const response = await fetch(endpoint, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => null) as { error?: string } | null;
            throw new Error(errData?.error || `HTTP ${response.status}`);
          }

          const blob          = await response.blob();
          const resultUrl     = URL.createObjectURL(blob);
          const generationTime = performance.now() - startTime;

          set(state => ({
            jobs: state.jobs.map(j => j.id === job.id ? {
              ...j,
              status: 'done',
              resultUrl,
              fileSize: blob.size,
              generationTime,
            } : j),
          }));

        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Generation failed';
          set(state => ({
            jobs: state.jobs.map(j => j.id === job.id ? {
              ...j,
              status:       'error',
              errorMessage: message,
            } : j),
          }));
        }
      })
    );

    // ── POST-GENERATION AUTO-RESET ────────────────────────────────────────────
    // After all jobs settle (success or error), reset selectedDevices and options
    // to defaults so the next generation starts clean. Jobs are preserved so the
    // user can still view and download results until they click "Clear & Reset".
    set({
      selectedDevices:   [defaultDevices[1], defaultDevices[5]],
      screenshotOptions: { ...defaultScreenshotOptions },
      videoOptions:      { ...defaultVideoOptions },
    });
  },
}));
