const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/db');

// Get all health records (jailer only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const healthRecords = await pool.query(`
      SELECT h.*, 
             p.name as prisoner_name,
             p.prisoner_id
      FROM health_records h
      JOIN prisoners p ON h.prisoner_id = p.id
      ORDER BY h.last_checkup DESC
    `);

    res.json(healthRecords.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get health record for a specific prisoner
router.get('/prisoner/:prisonerId', auth, async (req, res) => {
  try {
    const { prisonerId } = req.params;
    let query;

    if (req.user.role === 'jailer') {
      query = `
        SELECT h.*, 
               p.name as prisoner_name,
               p.prisoner_id
        FROM health_records h
        JOIN prisoners p ON h.prisoner_id = p.id
        WHERE h.prisoner_id = $1
        ORDER BY h.last_checkup DESC
      `;
    } else {
      query = `
        SELECT h.status, h.last_checkup, h.conditions, h.medications, h.dietary_restrictions,
               p.name as prisoner_name,
               p.prisoner_id
        FROM health_records h
        JOIN prisoners p ON h.prisoner_id = p.id
        JOIN family_connections fc ON p.id = fc.prisoner_id
        WHERE h.prisoner_id = $1 
        AND fc.family_member_id = $2
        ORDER BY h.last_checkup DESC
      `;
    }

    const healthRecord = await pool.query(query, [prisonerId, req.user.id]);
    
    if (healthRecord.rows.length === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json(healthRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create health record (jailer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      prisoner_id,
      status,
      last_checkup,
      conditions,
      medications,
      dietary_restrictions
    } = req.body;

    const healthRecord = await pool.query(
      `INSERT INTO health_records (
        prisoner_id, status, last_checkup, conditions, medications, dietary_restrictions
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [prisoner_id, status, last_checkup, conditions, medications, dietary_restrictions]
    );

    res.status(201).json(healthRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update health record (jailer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const {
      status,
      last_checkup,
      conditions,
      medications,
      dietary_restrictions
    } = req.body;

    const healthRecord = await pool.query(
      `UPDATE health_records SET
        status = $1,
        last_checkup = $2,
        conditions = $3,
        medications = $4,
        dietary_restrictions = $5
      WHERE id = $6 RETURNING *`,
      [status, last_checkup, conditions, medications, dietary_restrictions, id]
    );

    if (healthRecord.rows.length === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    res.json(healthRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get health statistics (jailer only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'Good' THEN 1 END) as good_health,
        COUNT(CASE WHEN status = 'Fair' THEN 1 END) as fair_health,
        COUNT(CASE WHEN status = 'Poor' THEN 1 END) as poor_health,
        COUNT(CASE WHEN array_length(medications, 1) > 0 THEN 1 END) as on_medication
      FROM health_records
      WHERE last_checkup >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 