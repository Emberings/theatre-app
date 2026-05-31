const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware για έλεγχο token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user reservations
router.get('/', verifyToken, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT r.*, s.show_date, s.show_time, sh.title FROM reservations r JOIN showtimes s ON r.showtime_id = s.showtime_id JOIN shows sh ON s.show_id = sh.show_id WHERE r.user_id = ?',
      [req.user_id]
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create reservation
router.post('/', verifyToken, async (req, res) => {
  const { showtime_id, seats_reserved } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO reservations (user_id, showtime_id, seats_reserved) VALUES (?, ?, ?)',
      [req.user_id, showtime_id, seats_reserved]
    );
    await conn.query(
      'UPDATE showtimes SET available_seats = available_seats - ? WHERE showtime_id = ?',
      [seats_reserved, showtime_id]
    );
    conn.release();
    res.json({ message: 'Reservation created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel reservation
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query(
      'UPDATE reservations SET status = ? WHERE reservation_id = ? AND user_id = ?',
      ['cancelled', req.params.id, req.user_id]
    );
    conn.release();
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;