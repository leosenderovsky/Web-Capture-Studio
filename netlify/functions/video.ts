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
      fps = 30,
      scrollSpeed = 'medium',
      delay = 0
    } = data;

    const apiKey = process.env.BROWSERLESS_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing BROWSERLESS_API_KEY' }) };
    }

    const durationMs = duration * 1000;
    const delayMs = delay * 1000;

    const scrollScript = `
      (async () => {
        const reqDuration = ${durationMs};
        const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const distance = maxScroll; 
        let startTime = performance.now();
        
        return new Promise((resolve) => {
          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / reqDuration, 1);
            const currentScroll = distance * progress;
            window.scrollTo(0, currentScroll);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          }
          requestAnimationFrame(step);
        });
      })();
    `;

    const browserlessPayload = {
      url,
      options: {
        type: 'mp4',
        quality: 100,
        frameRate: fps
      },
      gotoOptions: {
        waitUntil: 'networkidle2',
        timeout: 30000
      },
      viewport: {
        width: viewportWidth,
        height: viewportHeight
      },
      waitForTimeout: delayMs + durationMs + 1000,
      addScriptTag: [{ content: scrollScript }]
    };

    // Use chrome.browserless.io REST endpoint for screencast
    const apiUrl = `https://chrome.browserless.io/screencast?token=${apiKey}`;

    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(browserlessPayload),
        signal: AbortSignal.timeout(120000)
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
