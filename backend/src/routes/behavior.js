const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/db');

// Get all behavior records (jailer only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const behaviorRecords = await pool.query(`
      SELECT b.*, 
             p.name as prisoner_name,
             p.prisoner_id
      FROM behavior_records b
      JOIN prisoners p ON b.prisoner_id = p.id
      ORDER BY b.date DESC
    `);

    res.json(behaviorRecords.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get behavior records for a specific prisoner
router.get('/prisoner/:prisonerId', auth, async (req, res) => {
  try {
    const { prisonerId } = req.params;
    let query;

    if (req.user.role === 'jailer') {
      query = `
        SELECT b.*, 
               p.name as prisoner_name,
               p.prisoner_id
        FROM behavior_records b
        JOIN prisoners p ON b.prisoner_id = p.id
        WHERE b.prisoner_id = $1
        ORDER BY b.date DESC
      `;
    } else {
      query = `
        SELECT b.date, b.behavior_type, b.description, b.points,
               p.name as prisoner_name,
               p.prisoner_id
        FROM behavior_records b
        JOIN prisoners p ON b.prisoner_id = p.id
        JOIN family_connections fc ON p.id = fc.prisoner_id
        WHERE b.prisoner_id = $1 
        AND fc.family_member_id = $2
        ORDER BY b.date DESC
      `;
    }

    const behaviorRecords = await pool.query(query, [prisonerId, req.user.id]);
    res.json(behaviorRecords.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create behavior record (jailer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      prisoner_id,
      behavior_type,
      description,
      points,
      date
    } = req.body;

    const behaviorRecord = await pool.query(
      `INSERT INTO behavior_records (
        prisoner_id, behavior_type, description, points, date
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [prisoner_id, behavior_type, description, points, date]
    );

    res.status(201).json(behaviorRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update behavior record (jailer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const {
      behavior_type,
      description,
      points,
      date
    } = req.body;

    const behaviorRecord = await pool.query(
      `UPDATE behavior_records SET
        behavior_type = $1,
        description = $2,
        points = $3,
        date = $4
      WHERE id = $5 RETURNING *`,
      [behavior_type, description, points, date, id]
    );

    if (behaviorRecord.rows.length === 0) {
      return res.status(404).json({ message: 'Behavior record not found' });
    }

    res.json(behaviorRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get behavior statistics (jailer only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN behavior_type = 'Positive' THEN 1 END) as positive_records,
        COUNT(CASE WHEN behavior_type = 'Negative' THEN 1 END) as negative_records,
        COUNT(CASE WHEN behavior_type = 'Neutral' THEN 1 END) as neutral_records,
        AVG(points) as average_points
      FROM behavior_records
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 