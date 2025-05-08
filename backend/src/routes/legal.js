const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/db');

// Get all legal records (jailer only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const legalRecords = await pool.query(`
      SELECT l.*, 
             p.name as prisoner_name,
             p.prisoner_id
      FROM legal_information l
      JOIN prisoners p ON l.prisoner_id = p.id
      ORDER BY l.case_date DESC
    `);

    res.json(legalRecords.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get legal information for a specific prisoner
router.get('/prisoner/:prisonerId', auth, async (req, res) => {
  try {
    const { prisonerId } = req.params;
    let query;

    if (req.user.role === 'jailer') {
      query = `
        SELECT l.*, 
               p.name as prisoner_name,
               p.prisoner_id
        FROM legal_information l
        JOIN prisoners p ON l.prisoner_id = p.id
        WHERE l.prisoner_id = $1
        ORDER BY l.case_date DESC
      `;
    } else {
      query = `
        SELECT l.case_number, l.case_type, l.case_date, l.court_name, l.status,
               p.name as prisoner_name,
               p.prisoner_id
        FROM legal_information l
        JOIN prisoners p ON l.prisoner_id = p.id
        JOIN family_connections fc ON p.id = fc.prisoner_id
        WHERE l.prisoner_id = $1 
        AND fc.family_member_id = $2
        ORDER BY l.case_date DESC
      `;
    }

    const legalInfo = await pool.query(query, [prisonerId, req.user.id]);
    
    if (legalInfo.rows.length === 0) {
      return res.status(404).json({ message: 'Legal information not found' });
    }

    res.json(legalInfo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create legal record (jailer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      prisoner_id,
      case_number,
      case_type,
      case_date,
      court_name,
      status,
      sentence_length,
      next_hearing_date
    } = req.body;

    const legalRecord = await pool.query(
      `INSERT INTO legal_information (
        prisoner_id, case_number, case_type, case_date, court_name, 
        status, sentence_length, next_hearing_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [prisoner_id, case_number, case_type, case_date, court_name, 
       status, sentence_length, next_hearing_date]
    );

    res.status(201).json(legalRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update legal record (jailer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const {
      case_number,
      case_type,
      case_date,
      court_name,
      status,
      sentence_length,
      next_hearing_date
    } = req.body;

    const legalRecord = await pool.query(
      `UPDATE legal_information SET
        case_number = $1,
        case_type = $2,
        case_date = $3,
        court_name = $4,
        status = $5,
        sentence_length = $6,
        next_hearing_date = $7
      WHERE id = $8 RETURNING *`,
      [case_number, case_type, case_date, court_name, 
       status, sentence_length, next_hearing_date, id]
    );

    if (legalRecord.rows.length === 0) {
      return res.status(404).json({ message: 'Legal record not found' });
    }

    res.json(legalRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get legal statistics (jailer only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_cases,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_cases,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_cases,
        COUNT(CASE WHEN status = 'Appeal' THEN 1 END) as appeal_cases,
        AVG(sentence_length) as average_sentence_length
      FROM legal_information
      WHERE case_date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 