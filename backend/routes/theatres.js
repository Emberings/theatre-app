const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all theatres
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM theatres');
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single theatre
router.get('/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM theatres WHERE theatre_id = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;