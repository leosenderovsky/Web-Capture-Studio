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
      delay = 1
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
    apiUrl.searchParams.set('width', viewportWidth.toString());
    apiUrl.searchParams.set('height', viewportHeight.toString());
    apiUrl.searchParams.set('delay', delay.toString());
    apiUrl.searchParams.set('block_ads', 'true');
    apiUrl.searchParams.set('block_cookie_banners', 'true');
    apiUrl.searchParams.set('wait_until', 'networkidle2');

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



