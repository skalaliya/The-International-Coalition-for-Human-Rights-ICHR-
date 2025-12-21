const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/auth');

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '12h' });
        res.json({ token });
    } catch (e) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;