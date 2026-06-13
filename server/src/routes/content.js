const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { createPostSchema, updatePostSchema, CATEGORIES } = require('../validation/post');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(input) {
    return (
        String(input)
            .normalize('NFKD')
            .replace(/[̀-ͯ]/g, '') // strip accents
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80) || 'post'
    );
}

// Ensure a unique slug; the @unique constraint is the real guard (P2002 → 409),
// this just produces a friendly base.
async function uniqueSlug(base, excludeId = null) {
    const root = slugify(base);
    let candidate = root;
    let n = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const existing = await prisma.post.findUnique({ where: { slug: candidate } });
        if (!existing || existing.id === excludeId) return candidate;
        n += 1;
        candidate = `${root}-${n}`;
    }
}

// Shape a Post row for the API: parse hashtags JSON, sort gallery by order.
function serializePost(p) {
    if (!p) return p;
    let hashtags = [];
    try {
        const parsed = JSON.parse(p.hashtags ?? '[]');
        if (Array.isArray(parsed)) hashtags = parsed;
    } catch {
        hashtags = [];
    }
    return {
        ...p,
        hashtags,
        gallery: (p.gallery ?? []).slice().sort((a, b) => a.order - b.order),
    };
}

function clampPage(q) {
    const page = Math.max(1, parseInt(q.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(q.pageSize, 10) || 10));
    return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

function validationError(res, parsed) {
    return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
}

// ---------------------------------------------------------------------------
// PUBLIC ROUTES (published only — drafts are never exposed)
// ---------------------------------------------------------------------------

router.get('/posts', async (req, res) => {
    const { page, pageSize, skip, take } = clampPage(req.query);
    const where = { status: 'published' };
    if (req.query.category) {
        if (!CATEGORIES.includes(req.query.category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        where.category = req.query.category;
    }
    try {
        const [items, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
                skip,
                take,
                include: { gallery: true },
            }),
            prisma.post.count({ where }),
        ]);
        res.json({
            items: items.map(serializePost),
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load posts' });
    }
});

router.get('/posts/:slug', async (req, res) => {
    try {
        const post = await prisma.post.findFirst({
            where: { slug: req.params.slug, status: 'published' },
            include: { gallery: true },
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(serializePost(post));
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load post' });
    }
});

// ---------------------------------------------------------------------------
// ADMIN ROUTES (protected) — list includes drafts
// ---------------------------------------------------------------------------

router.get('/admin/posts', authenticateToken, async (req, res) => {
    const { page, pageSize, skip, take } = clampPage(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.category && CATEGORIES.includes(req.query.category)) where.category = req.query.category;
    try {
        const [items, total] = await Promise.all([
            prisma.post.findMany({ where, orderBy: [{ updatedAt: 'desc' }], skip, take, include: { gallery: true } }),
            prisma.post.count({ where }),
        ]);
        res.json({
            items: items.map(serializePost),
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load posts' });
    }
});

router.get('/admin/posts/:id', authenticateToken, async (req, res) => {
    try {
        const post = await prisma.post.findUnique({ where: { id: req.params.id }, include: { gallery: true } });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(serializePost(post));
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load post' });
    }
});

// Create
router.post('/posts', authenticateToken, async (req, res) => {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed);
    const d = parsed.data;

    try {
        const slug = await uniqueSlug(d.slug && d.slug.trim() ? d.slug : d.title);
        const post = await prisma.post.create({
            data: {
                slug,
                title: d.title,
                category: d.category,
                status: d.status,
                date: d.date,
                location: d.location ?? null,
                excerpt: d.excerpt,
                coverImageUrl: d.coverImageUrl ?? null,
                body: d.body,
                authorName: d.authorName ?? null,
                hashtags: JSON.stringify(d.hashtags ?? []),
                gallery: {
                    create: (d.gallery ?? []).map((g, i) => ({
                        url: g.url,
                        caption: g.caption ?? null,
                        order: g.order ?? i,
                    })),
                },
            },
            include: { gallery: true },
        });
        res.status(201).json(serializePost(post));
    } catch (e) {
        if (e.code === 'P2002') return res.status(409).json({ error: 'A post with this slug already exists' });
        console.error(e);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update (PUT = full, PATCH = partial). Gallery replaced atomically.
async function updateHandler(req, res) {
    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed);
    const d = parsed.data;

    try {
        const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ error: 'Post not found' });

        let slug = existing.slug;
        if (d.slug !== undefined || d.title !== undefined) {
            const base = d.slug && d.slug.trim() ? d.slug : d.title ?? existing.title;
            slug = await uniqueSlug(base, existing.id);
        }

        const scalar = { slug };
        if (d.title !== undefined) scalar.title = d.title;
        if (d.category !== undefined) scalar.category = d.category;
        if (d.status !== undefined) scalar.status = d.status;
        if (d.date !== undefined) scalar.date = d.date;
        if (d.location !== undefined) scalar.location = d.location;
        if (d.excerpt !== undefined) scalar.excerpt = d.excerpt;
        if (d.coverImageUrl !== undefined) scalar.coverImageUrl = d.coverImageUrl;
        if (d.body !== undefined) scalar.body = d.body;
        if (d.authorName !== undefined) scalar.authorName = d.authorName;
        if (d.hashtags !== undefined) scalar.hashtags = JSON.stringify(d.hashtags);

        // Replace gallery only when the client sent one. Use an explicit
        // transaction so delete strictly precedes create (nested deleteMany+create
        // in a single update has no guaranteed ordering — prisma#16606).
        const post = await prisma.$transaction(async (tx) => {
            await tx.post.update({ where: { id: existing.id }, data: scalar });
            if (d.gallery !== undefined) {
                await tx.galleryImage.deleteMany({ where: { postId: existing.id } });
                if (d.gallery.length > 0) {
                    await tx.galleryImage.createMany({
                        data: d.gallery.map((g, i) => ({
                            postId: existing.id,
                            url: g.url,
                            caption: g.caption ?? null,
                            order: g.order ?? i,
                        })),
                    });
                }
            }
            return tx.post.findUnique({ where: { id: existing.id }, include: { gallery: true } });
        });

        res.json(serializePost(post));
    } catch (e) {
        if (e.code === 'P2002') return res.status(409).json({ error: 'A post with this slug already exists' });
        console.error(e);
        res.status(500).json({ error: 'Failed to update post' });
    }
}
router.put('/posts/:id', authenticateToken, updateHandler);
router.patch('/posts/:id', authenticateToken, updateHandler);

// Publish / unpublish (no body)
router.post('/posts/:id/publish', authenticateToken, async (req, res) => {
    try {
        const post = await prisma.post.update({
            where: { id: req.params.id },
            data: { status: 'published' },
            include: { gallery: true },
        });
        res.json(serializePost(post));
    } catch (e) {
        if (e.code === 'P2025') return res.status(404).json({ error: 'Post not found' });
        console.error(e);
        res.status(500).json({ error: 'Failed to publish post' });
    }
});

router.post('/posts/:id/unpublish', authenticateToken, async (req, res) => {
    try {
        const post = await prisma.post.update({
            where: { id: req.params.id },
            data: { status: 'draft' },
            include: { gallery: true },
        });
        res.json(serializePost(post));
    } catch (e) {
        if (e.code === 'P2025') return res.status(404).json({ error: 'Post not found' });
        console.error(e);
        res.status(500).json({ error: 'Failed to unpublish post' });
    }
});

// Delete (gallery cascades via schema)
router.delete('/posts/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.post.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        if (e.code === 'P2025') return res.status(404).json({ error: 'Post not found' });
        console.error(e);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Image upload (cover or gallery) → returns a relative URL
router.post('/posts/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
});

// ---------------------------------------------------------------------------
// LEGACY VIDEO ROUTES (kept so existing callers don't break; cuid String ids)
// ---------------------------------------------------------------------------

router.get('/videos', async (req, res) => {
    try {
        const videos = await prisma.videoItem.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(videos);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load videos' });
    }
});

router.post('/videos', authenticateToken, upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, videoUrl, duration, date } = req.body;
        const thumbnailUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const video = await prisma.videoItem.create({
            data: { title, description, videoUrl, duration, date, thumbnailUrl },
        });
        res.status(201).json(video);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create video' });
    }
});

router.delete('/videos/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.videoItem.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        if (e.code === 'P2025') return res.status(404).json({ error: 'Video not found' });
        console.error(e);
        res.status(500).json({ error: 'Failed to delete video' });
    }
});

module.exports = router;
