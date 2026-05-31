const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all shows
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM shows');
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get shows by theatre
router.get('/theatre/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM shows WHERE theatre_id = ?', [req.params.id]);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get showtimes for a show
router.get('/:id/showtimes', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM showtimes WHERE show_id = ?', [req.params.id]);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;