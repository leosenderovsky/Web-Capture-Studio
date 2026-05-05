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
      duration = 10,
      delay = 1,
      userAgent = 'desktop'
    } = data;

    const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
    if (!accessKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing SCREENSHOTONE_ACCESS_KEY' }) };
    }

    // ScreenshotOne Animate API is much more reliable for scrolling videos
    const apiUrl = new URL('https://api.screenshotone.com/animate');
    apiUrl.searchParams.set('access_key', accessKey);
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('scenario', 'scroll');
    apiUrl.searchParams.set('duration', Math.min(duration, 30).toString()); // Max 30s
    apiUrl.searchParams.set('format', 'mp4');
    apiUrl.searchParams.set('viewport_width', viewportWidth.toString());
    apiUrl.searchParams.set('viewport_height', viewportHeight.toString());
    apiUrl.searchParams.set('delay', delay.toString());
    apiUrl.searchParams.set('block_ads', 'true');
    apiUrl.searchParams.set('block_cookie_banners', 'true');
    apiUrl.searchParams.set('wait_until', 'networkidle2');

    if (userAgent === 'mobile') {
      apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    } else if (userAgent === 'tablet') {
      apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    } else if (userAgent === 'social') {
      // social presets get desktop Chrome UA (cleanest rendering at any size)
      apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }
    // 'desktop': no user_agent param needed, API default is desktop Chrome

    let response;
    try {
      response = await fetch(apiUrl.toString(), {
        method: 'GET', // ScreenshotOne animate uses GET for these params
        signal: AbortSignal.timeout(120000)
      });
    } catch (e: any) {
      if (e.name === 'TimeoutError') {
         return { statusCode: 504, body: JSON.stringify({ error: 'Timeout - video generation took too long' }) };
      }
      throw e;
    }

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: `API Error: ${response.status} ${errorText}` }) };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'video/mp4',
      },
      body: base64,
      isBase64Encoded: true
    };

  } catch (error: any) {
    console.error('Video error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};



