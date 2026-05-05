# Web Capture Studio

A powerful web application that lets you enter any public website URL and generate responsive screenshots and smooth automatic scroll videos across multiple devices.

## Features
- **Batch Screenshots:** Capture multiple viewports (Desktop, Tablet, Mobile) at once using ScreenshotOne's rendering engine.
- **Scroll Videos:** Automatically generate smooth-scrolling `.mp4` recordings of pages at specific breakpoints via Browserless.io.
- **Customizable:** Adjust image format, quality, dimensions, delay, dark mode, cookie banners, and more.
- **ZIP Export:** Download all generated assets in a single batch archive.

## Setup Instructions

### Prerequisites
1. You need a free or paid API key from [ScreenshotOne](https://screenshotone.com).
2. You need an API token from [Browserless.io](https://browserless.io).

### Installation (Local Development)

```bash
npm install
```

Copy the example environment variables file and fill in your keys:
```bash
cp .env.example .env
```
Edit `.env`:
```
SCREENSHOTONE_ACCESS_KEY="your_screenshotone_key"
BROWSERLESS_API_KEY="your_browserless_key"
```

Start the application:
```bash
npm run dev
```

### Deployment (Netlify)

This project uses Netlify Functions to keep your API keys secure server-side.
1. Connect your repository to Netlify.
2. The `netlify.toml` file will automatically configure build settings.
3. In the Netlify dashboard, go to **Site Settings > Environment Variables** and add:
   - `SCREENSHOTONE_ACCESS_KEY`
   - `BROWSERLESS_API_KEY`
4. Deploy!

## Architecture Details
- **Frontend:** React + Vite + Tailwind CSS + Zustand
- **Serverless:** Netlify Functions (Node.js) proxy requests to APIs
- **APIs:** 
  - `screenshotone.com/take` for images
  - `browserless.io/screencast` for videos
