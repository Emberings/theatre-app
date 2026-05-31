const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    conn.release();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;