import express from 'express';
import { createServer as createViteServer } from 'vite';
import { handler as screenshotHandler } from './netlify/functions/screenshot.js';
import { handler as videoHandler } from './netlify/functions/video.js';
import path from 'path';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Make sure we can parse large payloads if ever needed, but standard is fine
  app.use(express.json());

  // Adapt Express request to Netlify Event format
  const adaptRequest = (req: express.Request) => ({
    httpMethod: req.method,
    body: JSON.stringify(req.body),
    headers: req.headers as any,
    queryStringParameters: req.query as any
  });

  // Netlify functions endpoints mounted for local development
  app.post('/api/screenshot', async (req, res) => {
    try {
      const event = adaptRequest(req);
      const response = await screenshotHandler(event as any, {} as any) as any;
      res.status(response.statusCode);
      Object.entries(response.headers || {}).forEach(([k, v]) => res.setHeader(k, v as string));
      res.send(Buffer.from(response.body, response.isBase64Encoded ? 'base64' : 'utf-8'));
    } catch (e: any) {
      res.status(500).json({ error: String(e) });
    }
  });

  app.post('/api/video', async (req, res) => {
    try {
      if (!process.env.BROWSERLESS_API_KEY) {
        console.warn('BROWSERLESS_API_KEY is missing');
      }
      const event = adaptRequest(req);
      const response = await videoHandler(event as any, {} as any) as any;
      res.status(response.statusCode);
      Object.entries(response.headers || {}).forEach(([k, v]) => res.setHeader(k, v as string));
      // Always send correctly decoded base64 buffer for images/videos
      res.send(Buffer.from(response.body, response.isBase64Encoded ? 'base64' : 'utf-8'));
    } catch (e: any) {
      res.status(500).json({ error: String(e) });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
