import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      url,
      viewportWidth = 1440,
      viewportHeight = 900,
      deviceScaleFactor = 1,
      format = 'png',
      quality = 90,
      fullPage = false,
      delay = 0,
      blockAds = true,
      blockCookieBanners = true,
      darkMode = false,
      userAgent = 'desktop',
      imageWidth,   // optional: output image width (used for social presets)
      imageHeight,  // optional: output image height (used for social presets)
    } = data;

    const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
    if (!accessKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing SCREENSHOTONE_ACCESS_KEY' }) };
    }

    const apiUrl = new URL('https://api.screenshotone.com/take');
    apiUrl.searchParams.set('access_key', accessKey);
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('viewport_width', viewportWidth.toString());
    apiUrl.searchParams.set('viewport_height', viewportHeight.toString());
    apiUrl.searchParams.set('device_scale_factor', deviceScaleFactor.toString());
    apiUrl.searchParams.set('format', format);
    if (format === 'jpg' || format === 'webp') {
      apiUrl.searchParams.set('image_quality', quality.toString());
    }
    apiUrl.searchParams.set('full_page', fullPage ? 'true' : 'false');
    apiUrl.searchParams.set('delay', delay.toString());
    apiUrl.searchParams.set('block_ads', blockAds ? 'true' : 'false');
    apiUrl.searchParams.set('block_cookie_banners', blockCookieBanners ? 'true' : 'false');
    apiUrl.searchParams.set('dark_mode', darkMode ? 'true' : 'false');
    
    // If imageWidth/imageHeight are provided (social presets), set output image size.
    // This makes ScreenshotOne scale/crop the output to the social format dimensions
    // while the page itself renders at the responsive viewport set above.
    if (imageWidth && imageHeight) {
      apiUrl.searchParams.set('image_width', imageWidth.toString());
      apiUrl.searchParams.set('image_height', imageHeight.toString());
    }
    
    apiUrl.searchParams.set('wait_until', 'networkidle2');

    if (userAgent !== 'auto') {
       if (userAgent.includes('mobile') || userAgent === 'mobile') {
         apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
       } else if (userAgent === 'tablet') {
         apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
       } else if (userAgent === 'social') {
         // Social presets use desktop Chrome UA for cleanest rendering
         apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
       }
    }

    // Try catch just around the fetch
    let response;
    try {
      response = await fetch(apiUrl.toString(), {
        signal: AbortSignal.timeout(30000)
      });
    } catch (e: any) {
      if (e.name === 'TimeoutError') {
        return { statusCode: 504, body: JSON.stringify({ error: 'Timeout - try a simpler page or shorter duration' }) };
      }
      throw e;
    }

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: `API Error: ${response.status} ${errorText}` }) };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const contentType = response.headers.get('content-type') || `image/${format}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
      },
      body: base64,
      isBase64Encoded: true
    };
  } catch (error: any) {
    console.error('Screenshot error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
