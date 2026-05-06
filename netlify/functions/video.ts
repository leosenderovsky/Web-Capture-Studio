import { Handler } from '@netlify/functions';

// ScreenshotOne Animate API does not support fps or scrollSpeed as native params.
// Scroll speed is simulated by scaling the duration:
//   slow   → 1.5× duration (longer recording = slower perceived scroll)
//   medium → 1.0× duration
//   fast   → 0.6× duration (shorter recording = faster perceived scroll)
// All values are capped at 30s (ScreenshotOne Animate maximum).
const SPEED_MULTIPLIER: Record<string, number> = {
  slow:   1.5,
  medium: 1.0,
  fast:   0.6,
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      url,
      viewportWidth  = 1440,
      viewportHeight = 900,
      duration       = 10,
      delay          = 1,
      scrollSpeed    = 'medium',
      userAgent      = 'desktop',
    } = data;

    const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
    if (!accessKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing SCREENSHOTONE_ACCESS_KEY' }),
      };
    }

    // Compute effective duration from scrollSpeed multiplier
    const multiplier = SPEED_MULTIPLIER[scrollSpeed] ?? 1.0;
    const effectiveDuration = Math.min(Math.round(duration * multiplier), 30);

    const apiUrl = new URL('https://api.screenshotone.com/animate');
    apiUrl.searchParams.set('access_key',      accessKey);
    apiUrl.searchParams.set('url',             url);
    apiUrl.searchParams.set('scenario',        'scroll');
    apiUrl.searchParams.set('duration',        effectiveDuration.toString());
    apiUrl.searchParams.set('format',          'mp4');
    apiUrl.searchParams.set('viewport_width',  viewportWidth.toString());
    apiUrl.searchParams.set('viewport_height', viewportHeight.toString());
    apiUrl.searchParams.set('delay',           delay.toString());
    apiUrl.searchParams.set('block_ads',            'true');
    apiUrl.searchParams.set('block_cookie_banners', 'true');
    apiUrl.searchParams.set('wait_until',      'networkidle2');
    apiUrl.searchParams.set('reduced_motion',  'false'); // Ensure CSS animations play during scroll

    if (userAgent === 'mobile') {
      apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    } else if (userAgent === 'tablet') {
      apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    } else if (userAgent === 'social') {
      apiUrl.searchParams.set('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }
    // 'desktop': no user_agent param — API default is desktop Chrome

    let response: Response;
    try {
      response = await fetch(apiUrl.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(120000),
      });
    } catch (e: any) {
      if (e.name === 'TimeoutError') {
        return {
          statusCode: 504,
          body: JSON.stringify({ error: 'Timeout — video generation took too long. Try a shorter duration or simpler page.' }),
        };
      }
      throw e;
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API Error: ${response.status} ${errorText}` }),
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'video/mp4' },
      body: base64,
      isBase64Encoded: true,
    };

  } catch (error: any) {
    console.error('Video error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
