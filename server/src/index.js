const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Seed Admin User (for demo purposes)
async function seedAdmin() {
    const adminCount = await prisma.user.count();
    if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await prisma.user.create({
            data: {
                username: 'admin',
                password: hashedPassword
            }
        });
        console.log('Admin user created (username: admin, password: admin)');
    }
}

// Start Server
app.listen(PORT, async () => {
    await seedAdmin();
    console.log(`Server running on http://localhost:${PORT}`);
});