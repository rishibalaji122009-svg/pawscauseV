/**
 * PawsCause - AI Studio Full-Stack Server Entry
 * Mounts Vite dev middleware in development and serves Express API routes.
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import { app } from './api-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

async function start() {
  const PORT = 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      const distIndex = path.resolve(__dirname, 'dist', 'index.html');
      const rootIndex = path.resolve(__dirname, 'index.html');
      res.sendFile(fs.existsSync(distIndex) ? distIndex : rootIndex);
    });
  } else {
    // Development mode: Mount Vite middleware (HMR explicitly disabled for AI Studio iFrame)
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐾 PawsCause server listening at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
