const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// --- PUBLIC ROUTES (Read Only) ---

router.get('/news', async (req, res) => {
    const news = await prisma.newsItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(news);
});

router.get('/videos', async (req, res) => {
    const videos = await prisma.videoItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(videos);
});

// --- PROTECTED ROUTES (Admin Only) ---

// Create News
router.post('/news', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, summary, source, category, date } = req.body;
        // Construct full URL for the uploaded file
        const imageUrl = req.file 
            ? `http://localhost:3001/uploads/${req.file.filename}` 
            : 'https://picsum.photos/400/300';

        const news = await prisma.newsItem.create({
            data: { title, summary, source, category, date, imageUrl }
        });
        res.json(news);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to create news" });
    }
});

// Delete News
router.delete('/news/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.newsItem.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete news" });
    }
});

// Create Video
router.post('/videos', authenticateToken, upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, videoUrl, duration, date } = req.body;
        const thumbnailUrl = req.file 
            ? `http://localhost:3001/uploads/${req.file.filename}` 
            : 'https://picsum.photos/400/250';

        const video = await prisma.videoItem.create({
            data: { title, description, videoUrl, duration, date, thumbnailUrl }
        });
        res.json(video);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to create video" });
    }
});

// Delete Video
router.delete('/videos/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.videoItem.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;