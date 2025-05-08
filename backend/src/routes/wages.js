const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/db');

// Get all wages (jailer only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const wages = await pool.query(`
      SELECT w.*, 
             p.name as prisoner_name,
             p.prisoner_id,
             wa.assignment as work_assignment
      FROM wages w
      JOIN prisoners p ON w.prisoner_id = p.id
      LEFT JOIN work_assignments wa ON p.id = wa.prisoner_id
      ORDER BY w.payment_date DESC
    `);

    res.json(wages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wages for a specific prisoner
router.get('/prisoner/:prisonerId', auth, async (req, res) => {
  try {
    const { prisonerId } = req.params;
    let query;

    if (req.user.role === 'jailer') {
      query = `
        SELECT w.*, 
               p.name as prisoner_name,
               p.prisoner_id,
               wa.assignment as work_assignment
        FROM wages w
        JOIN prisoners p ON w.prisoner_id = p.id
        LEFT JOIN work_assignments wa ON p.id = wa.prisoner_id
        WHERE w.prisoner_id = $1
        ORDER BY w.payment_date DESC
      `;
    } else {
      query = `
        SELECT w.*, 
               p.name as prisoner_name,
               p.prisoner_id,
               wa.assignment as work_assignment
        FROM wages w
        JOIN prisoners p ON w.prisoner_id = p.id
        LEFT JOIN work_assignments wa ON p.id = wa.prisoner_id
        JOIN family_connections fc ON p.id = fc.prisoner_id
        WHERE w.prisoner_id = $1 
        AND fc.family_member_id = $2
        ORDER BY w.payment_date DESC
      `;
    }

    const wages = await pool.query(query, [prisonerId, req.user.id]);
    res.json(wages.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create wage record (jailer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { prisoner_id, amount, payment_date } = req.body;

    const wage = await pool.query(
      `INSERT INTO wages (
        prisoner_id, amount, payment_date
      ) VALUES ($1, $2, $3) RETURNING *`,
      [prisoner_id, amount, payment_date]
    );

    res.status(201).json(wage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update wage status (jailer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const wage = await pool.query(
      'UPDATE wages SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (wage.rows.length === 0) {
      return res.status(404).json({ message: 'Wage record not found' });
    }

    res.json(wage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wage statistics (jailer only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_wages,
        SUM(amount) as total_amount,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_wages,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_wages,
        AVG(amount) as average_wage
      FROM wages
      WHERE payment_date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 