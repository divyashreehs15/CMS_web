const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/db');

// Get all visits (jailer only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const visits = await pool.query(`
      SELECT vr.*, 
             p.name as prisoner_name,
             p.prisoner_id,
             u.username as visitor_name
      FROM visit_requests vr
      JOIN prisoners p ON vr.prisoner_id = p.id
      JOIN users u ON vr.visitor_id = u.id
      ORDER BY vr.visit_date DESC, vr.visit_time DESC
    `);

    res.json(visits.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visits for a specific prisoner (family members can only see their own visits)
router.get('/prisoner/:prisonerId', auth, async (req, res) => {
  try {
    const { prisonerId } = req.params;
    let query;

    if (req.user.role === 'jailer') {
      query = `
        SELECT vr.*, 
               p.name as prisoner_name,
               p.prisoner_id,
               u.username as visitor_name
        FROM visit_requests vr
        JOIN prisoners p ON vr.prisoner_id = p.id
        JOIN users u ON vr.visitor_id = u.id
        WHERE vr.prisoner_id = $1
        ORDER BY vr.visit_date DESC, vr.visit_time DESC
      `;
    } else {
      query = `
        SELECT vr.*, 
               p.name as prisoner_name,
               p.prisoner_id,
               u.username as visitor_name
        FROM visit_requests vr
        JOIN prisoners p ON vr.prisoner_id = p.id
        JOIN users u ON vr.visitor_id = u.id
        JOIN family_connections fc ON p.id = fc.prisoner_id
        WHERE vr.prisoner_id = $1 
        AND fc.family_member_id = $2
        ORDER BY vr.visit_date DESC, vr.visit_time DESC
      `;
    }

    const visits = await pool.query(query, [prisonerId, req.user.id]);
    res.json(visits.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create visit request (family members only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'family') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { prisoner_id, visit_date, visit_time, duration, type } = req.body;

    // Check if family member is connected to the prisoner
    const connection = await pool.query(
      'SELECT * FROM family_connections WHERE prisoner_id = $1 AND family_member_id = $2',
      [prisoner_id, req.user.id]
    );

    if (connection.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to visit this prisoner' });
    }

    // Create visit request
    const visit = await pool.query(
      `INSERT INTO visit_requests (
        prisoner_id, visitor_id, visit_date, visit_time, duration, type
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [prisoner_id, req.user.id, visit_date, visit_time, duration, type]
    );

    res.status(201).json(visit.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update visit status (jailer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const visit = await pool.query(
      'UPDATE visit_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (visit.rows.length === 0) {
      return res.status(404).json({ message: 'Visit request not found' });
    }

    res.json(visit.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visit statistics (jailer only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_visits,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_visits,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_visits,
        AVG(duration) as average_duration
      FROM visit_requests
      WHERE visit_date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 