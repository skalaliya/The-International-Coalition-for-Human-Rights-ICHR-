// Production single-origin entry: one Node server serves the API, uploaded
// files, the Astro static client, and the Astro SSR handler.
//
//   npm run build      # astro build → dist/client + dist/server/entry.mjs
//   node server.mjs    # this file
//
// Load order matters: dotenv first (Prisma + auth read env at require time),
// then the CommonJS API route modules, then the Astro handler LAST.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve all backend CommonJS deps (express/cors/multer/dotenv/routes) from
// server/node_modules by anchoring the require at server/package.json.
const serverRequire = createRequire(path.join(__dirname, 'server', 'package.json'));

// Load the backend env (DATABASE_URL, JWT_SECRET, …) BEFORE requiring routes.
serverRequire('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const express = serverRequire('express');
const cors = serverRequire('cors');
const multer = serverRequire('multer');
const authRoutes = serverRequire('./src/routes/auth.js');
const contentRoutes = serverRequire('./src/routes/content.js');
const { uploadDir } = serverRequire('./src/middleware/upload.js');

const PORT = process.env.PORT || 4321;

// Single origin: SSR pages fetch the API from THIS server. Set the runtime
// internal URL BEFORE importing the SSR bundle (api.ts reads it at module load).
process.env.API_INTERNAL_URL = process.env.API_INTERNAL_URL || `http://localhost:${PORT}`;

// Astro SSR handler (built by `astro build` with the node adapter, middleware mode).
const { handler: ssrHandler } = await import('./dist/server/entry.mjs');

const app = express();

app.use(cors());

// Scope JSON parsing to /api so the Astro SSR handler always gets the raw body.
app.use('/api', express.json());
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Multer error → clean status codes (mirrors server/src/index.js).
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large (max 10MB)' });
    return res.status(400).json({ error: err.field || `Upload error: ${err.code}` });
  }
  if (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});

// Uploaded files (same origin as the site).
app.use('/uploads', express.static(uploadDir));

// Astro static client assets + prerendered pages.
app.use(express.static(path.join(__dirname, 'dist', 'client')));

// Everything else → Astro SSR. MUST be last.
app.use(ssrHandler);

app.listen(PORT, () => {
  console.log(`ICHR (Astro SSR + API) running on http://localhost:${PORT}`);
});
