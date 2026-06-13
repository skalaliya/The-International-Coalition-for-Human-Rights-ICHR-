// Load env FIRST: Prisma reads DATABASE_URL and auth reads JWT_SECRET at
// module-construction time, so this must run before any ./routes require.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const { uploadDir } = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure the uploads directory exists.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
// Scope JSON parsing to /api only. A GLOBAL express.json() would consume the
// request body and break the Astro SSR handler when this app is reused in
// production (withastro/astro#11470). Multipart routes are unaffected — json()
// only parses application/json.
app.use('/api', express.json());

// Serve uploaded files statically.
app.use('/uploads', express.static(uploadDir));

// API routes.
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Map Multer errors to clean status codes instead of a generic 500.
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large (max 10MB)' });
        }
        return res.status(400).json({ error: err.field || `Upload error: ${err.code}` });
    }
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
    next();
});

// Only listen when run directly (dev). In production, server.mjs imports this
// app, appends the Astro SSR handler, and listens once on a single origin.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`API server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
