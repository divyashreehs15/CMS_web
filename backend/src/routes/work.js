const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/db');

// Get all work assignments (jailer only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const workAssignments = await pool.query(`
      SELECT w.*, 
             p.name as prisoner_name,
             p.prisoner_id
      FROM work_assignments w
      JOIN prisoners p ON w.prisoner_id = p.id
      ORDER BY w.start_date DESC
    `);

    res.json(workAssignments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get work assignment for a specific prisoner
router.get('/prisoner/:prisonerId', auth, async (req, res) => {
  try {
    const { prisonerId } = req.params;
    let query;

    if (req.user.role === 'jailer') {
      query = `
        SELECT w.*, 
               p.name as prisoner_name,
               p.prisoner_id
        FROM work_assignments w
        JOIN prisoners p ON w.prisoner_id = p.id
        WHERE w.prisoner_id = $1
        ORDER BY w.start_date DESC
      `;
    } else {
      query = `
        SELECT w.work_type, w.start_date, w.end_date, w.status, w.performance_rating,
               p.name as prisoner_name,
               p.prisoner_id
        FROM work_assignments w
        JOIN prisoners p ON w.prisoner_id = p.id
        JOIN family_connections fc ON p.id = fc.prisoner_id
        WHERE w.prisoner_id = $1 
        AND fc.family_member_id = $2
        ORDER BY w.start_date DESC
      `;
    }

    const workAssignment = await pool.query(query, [prisonerId, req.user.id]);
    
    if (workAssignment.rows.length === 0) {
      return res.status(404).json({ message: 'Work assignment not found' });
    }

    res.json(workAssignment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create work assignment (jailer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      prisoner_id,
      work_type,
      start_date,
      end_date,
      status,
      performance_rating
    } = req.body;

    const workAssignment = await pool.query(
      `INSERT INTO work_assignments (
        prisoner_id, work_type, start_date, end_date, status, performance_rating
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [prisoner_id, work_type, start_date, end_date, status, performance_rating]
    );

    res.status(201).json(workAssignment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update work assignment (jailer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const {
      work_type,
      start_date,
      end_date,
      status,
      performance_rating
    } = req.body;

    const workAssignment = await pool.query(
      `UPDATE work_assignments SET
        work_type = $1,
        start_date = $2,
        end_date = $3,
        status = $4,
        performance_rating = $5
      WHERE id = $6 RETURNING *`,
      [work_type, start_date, end_date, status, performance_rating, id]
    );

    if (workAssignment.rows.length === 0) {
      return res.status(404).json({ message: 'Work assignment not found' });
    }

    res.json(workAssignment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get work statistics (jailer only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_assignments,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_assignments,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_assignments,
        COUNT(CASE WHEN status = 'Suspended' THEN 1 END) as suspended_assignments,
        AVG(performance_rating) as average_rating
      FROM work_assignments
      WHERE start_date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 