const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const jwt = require('jsonwebtoken');

// Add this utility function at the top after imports
function fixArrayField(val) {
  if (val === 'None' || val === null || val === undefined) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return [val];
  return val;
}

// Get all prisoners (jailer only)
router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prisoners = await pool.query(`
      SELECT p.*, 
             h.status as health_status,
             w.assignment as current_assignment,
             l.case_number,
             b.conduct
      FROM prisoners p
      LEFT JOIN health_records h ON p.id = h.prisoner_id
      LEFT JOIN work_assignments w ON p.id = w.prisoner_id
      LEFT JOIN legal_info l ON p.id = l.prisoner_id
      LEFT JOIN behavior_records b ON p.id = b.prisoner_id
      ORDER BY p.created_at DESC
    `);

    res.json(prisoners.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prisoner by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    let query;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'family') {
        query = `
          SELECT p.*, 
                 h.*,
                 w.*,
                 l.*,
                 b.*
          FROM prisoners p
          LEFT JOIN health_records h ON p.id = h.prisoner_id
          LEFT JOIN work_assignments w ON p.id = w.prisoner_id
          LEFT JOIN legal_info l ON p.id = l.prisoner_id
          LEFT JOIN behavior_records b ON p.id = b.prisoner_id
          JOIN family_connections fc ON p.id = fc.prisoner_id
          WHERE p.id = $1 AND fc.family_member_id = $2
        `;
        const prisoner = await pool.query(query, [id, decoded.id]);
        if (prisoner.rows.length === 0) {
          return res.status(404).json({ message: 'Prisoner not found or not authorized' });
        }
        return res.json(prisoner.rows[0]);
      }
    }

    // Default query for jailer or no token
    query = `
      SELECT p.*, 
             h.*,
             w.*,
             l.*,
             b.*
      FROM prisoners p
      LEFT JOIN health_records h ON p.id = h.prisoner_id
      LEFT JOIN work_assignments w ON p.id = w.prisoner_id
      LEFT JOIN legal_info l ON p.id = l.prisoner_id
      LEFT JOIN behavior_records b ON p.id = b.prisoner_id
      WHERE p.id = $1
    `;
    const prisoner = await pool.query(query, [id]);

    if (prisoner.rows.length === 0) {
      return res.status(404).json({ message: 'Prisoner not found' });
    }

    res.json(prisoner.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new prisoner (jailer only)
router.post('/', async (req, res) => {
  try {
    const {
      prisoner_id,
      name,
      age,
      gender,
      cell_number,
      admission_date,
      expected_release_date,
      status,
      category,
      health_info,
      work_info,
      legal_info,
      behavior_info
    } = req.body;

    // Fix array fields for health_info if present
    let fixedHealthInfo = health_info;
    if (health_info) {
      fixedHealthInfo = {
        ...health_info,
        conditions: fixArrayField(health_info.conditions),
        medications: fixArrayField(health_info.medications),
        dietary_restrictions: fixArrayField(health_info.dietary_restrictions)
      };
    }
    let fixedBehaviorInfo = behavior_info;
    if (behavior_info) {
      fixedBehaviorInfo = {
        ...behavior_info,
        privileges: fixArrayField(behavior_info.privileges),
        restrictions: fixArrayField(behavior_info.restrictions)
      };
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert prisoner
      const prisonerResult = await client.query(
        `INSERT INTO prisoners (
          prisoner_id, name, age, gender, cell_number,
          admission_date, expected_release_date, status, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [prisoner_id, name, age, gender, cell_number, admission_date, expected_release_date, status, category]
      );

      const prisonerId = prisonerResult.rows[0].id;

      // Insert health record
      if (fixedHealthInfo) {
        await client.query(
          `INSERT INTO health_records (
            prisoner_id, status, last_checkup, conditions, medications, dietary_restrictions
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            prisonerId,
            fixedHealthInfo.status || null,
            fixedHealthInfo.last_checkup || null,
            fixedHealthInfo.conditions || '{}',
            fixedHealthInfo.medications || '{}',
            fixedHealthInfo.dietary_restrictions || '{}'
          ]
        );
      }

      // Insert work assignment
      if (work_info) {
        await client.query(
          `INSERT INTO work_assignments (
            prisoner_id, assignment, start_date, hours_per_week, wage_rate, performance
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            prisonerId,
            work_info.assignment || 'none',
            work_info.start_date || new Date().toISOString().split('T')[0],
            work_info.hours_per_week || 8,
            work_info.wage_rate || 5.00,
            work_info.performance || 'pending'
          ]
        );
      }

      // Insert legal info
      if (legal_info) {
        await client.query(
          `INSERT INTO legal_info (
            prisoner_id, case_number, sentence, next_court_date, parole_eligibility_date
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            prisonerId,
            legal_info.case_number || null,
            legal_info.sentence || null,
            legal_info.next_court_date || null,
            legal_info.parole_eligibility_date || null
          ]
        );
      }

      // Insert behavior record
      if (fixedBehaviorInfo) {
        await client.query(
          `INSERT INTO behavior_records (
            prisoner_id, conduct, last_incident, privileges, restrictions
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            prisonerId,
            fixedBehaviorInfo.conduct || null,
            fixedBehaviorInfo.last_incident || null,
            fixedBehaviorInfo.privileges || '{}',
            fixedBehaviorInfo.restrictions || '{}'
          ]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ message: 'Prisoner created successfully', id: prisonerId });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error creating prisoner:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update prisoner (jailer only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      gender,
      cell_number,
      status,
      category,
      health_info,
      work_info,
      legal_info,
      behavior_info
    } = req.body;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update prisoner
      await client.query(
        `UPDATE prisoners SET
          name = $1,
          age = $2,
          gender = $3,
          cell_number = $4,
          status = $5,
          category = $6
        WHERE id = $7`,
        [name, age, gender, cell_number, status, category, id]
      );

      // Update health record
      if (health_info) {
        await client.query(
          `UPDATE health_records SET
            status = $1,
            last_checkup = $2,
            conditions = $3,
            medications = $4,
            dietary_restrictions = $5
          WHERE prisoner_id = $6`,
          [
            health_info.status,
            health_info.last_checkup,
            health_info.conditions,
            health_info.medications,
            health_info.dietary_restrictions,
            id
          ]
        );
      }

      // Update work assignment
      if (work_info) {
        await client.query(
          `UPDATE work_assignments SET
            assignment = $1,
            start_date = $2,
            hours_per_week = $3,
            wage_rate = $4,
            performance = $5
          WHERE prisoner_id = $6`,
          [
            work_info.assignment,
            work_info.start_date,
            work_info.hours_per_week,
            work_info.wage_rate,
            work_info.performance,
            id
          ]
        );
      }

      // Update legal info
      if (legal_info) {
        await client.query(
          `UPDATE legal_info SET
            case_number = $1,
            sentence = $2,
            next_court_date = $3,
            parole_eligibility_date = $4
          WHERE prisoner_id = $5`,
          [
            legal_info.case_number,
            legal_info.sentence,
            legal_info.next_court_date,
            legal_info.parole_eligibility_date,
            id
          ]
        );
      }

      // Update behavior record
      if (behavior_info) {
        await client.query(
          `UPDATE behavior_records SET
            conduct = $1,
            last_incident = $2,
            privileges = $3,
            restrictions = $4
          WHERE prisoner_id = $5`,
          [
            behavior_info.conduct,
            behavior_info.last_incident,
            behavior_info.privileges,
            behavior_info.restrictions,
            id
          ]
        );
      }

      await client.query('COMMIT');
      res.json({ message: 'Prisoner updated successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new prisoner (jailer only)
router.post('/add', async (req, res) => {
  try {
    const {
      prisoner_id,
      name,
      age,
      gender,
      cell_number,
      admission_date,
      expected_release_date,
      status,
      category,
      health_info,
      work_info,
      legal_info,
      behavior_info
    } = req.body;

    // Fix array fields for health_info if present
    let fixedHealthInfo2 = health_info;
    if (health_info) {
      fixedHealthInfo2 = {
        ...health_info,
        conditions: fixArrayField(health_info.conditions),
        medications: fixArrayField(health_info.medications),
        dietary_restrictions: fixArrayField(health_info.dietary_restrictions)
      };
    }
    let fixedBehaviorInfo2 = behavior_info;
    if (behavior_info) {
      fixedBehaviorInfo2 = {
        ...behavior_info,
        privileges: fixArrayField(behavior_info.privileges),
        restrictions: fixArrayField(behavior_info.restrictions)
      };
    }

    // Validate required fields
    if (!prisoner_id || !name || !age || !gender || !cell_number || !admission_date || !expected_release_date || !status || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert prisoner
      const prisonerResult = await client.query(
        `INSERT INTO prisoners (
          prisoner_id, name, age, gender, cell_number,
          admission_date, expected_release_date, status, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [prisoner_id, name, age, gender, cell_number, admission_date, expected_release_date, status, category]
      );

      const prisonerId = prisonerResult.rows[0].id;

      // Insert health record
      if (fixedHealthInfo2) {
        await client.query(
          `INSERT INTO health_records (
            prisoner_id, status, last_checkup, conditions, medications, dietary_restrictions
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            prisonerId,
            fixedHealthInfo2.status || null,
            fixedHealthInfo2.last_checkup || null,
            fixedHealthInfo2.conditions || '{}',
            fixedHealthInfo2.medications || '{}',
            fixedHealthInfo2.dietary_restrictions || '{}'
          ]
        );
      }

      // Insert work assignment
      if (work_info) {
        await client.query(
          `INSERT INTO work_assignments (
            prisoner_id, assignment, start_date, hours_per_week, wage_rate, performance
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            prisonerId,
            work_info.assignment || 'none',
            work_info.start_date || new Date().toISOString().split('T')[0],
            work_info.hours_per_week || 8,
            work_info.wage_rate || 5.00,
            work_info.performance || 'pending'
          ]
        );
      }

      // Insert legal info
      if (legal_info) {
        await client.query(
          `INSERT INTO legal_info (
            prisoner_id, case_number, sentence, next_court_date, parole_eligibility_date
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            prisonerId,
            legal_info.case_number || null,
            legal_info.sentence || null,
            legal_info.next_court_date || null,
            legal_info.parole_eligibility_date || null
          ]
        );
      }

      // Insert behavior record
      if (fixedBehaviorInfo2) {
        await client.query(
          `INSERT INTO behavior_records (
            prisoner_id, conduct, last_incident, privileges, restrictions
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            prisonerId,
            fixedBehaviorInfo2.conduct || null,
            fixedBehaviorInfo2.last_incident || null,
            fixedBehaviorInfo2.privileges || '{}',
            fixedBehaviorInfo2.restrictions || '{}'
          ]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ message: 'Prisoner added successfully', id: prisonerId });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 