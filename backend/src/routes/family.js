const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const jwt = require('jsonwebtoken');

// Get all family connections (for jailers)
router.get('/connections', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    if (decoded.role !== 'jailer') {
      console.log('Not authorized: not a jailer');
      return res.status(403).json({ message: 'Not authorized' });
    }

    const connections = await pool.query(`
      SELECT 
        fc.id,
        fc.family_member_id,
        fc.prisoner_id,
        fc.relationship,
        u.name as family_member_name,
        u.email as family_member_email,
        p.name as prisoner_name,
        p.prisoner_id as prisoner_prisoner_id
      FROM family_connections fc
      JOIN users u ON fc.family_member_id = u.id
      JOIN prisoners p ON fc.prisoner_id = p.id
      ORDER BY fc.id DESC
    `);
    console.log('Connections query result:', connections.rows);

    const formattedConnections = connections.rows.map(conn => ({
      id: conn.id,
      family_member_id: conn.family_member_id,
      prisoner_id: conn.prisoner_id,
      relationship: conn.relationship,
      family_member: {
        id: conn.family_member_id,
        name: conn.family_member_name,
        email: conn.family_member_email
      },
      prisoner: {
        id: conn.prisoner_id,
        name: conn.prisoner_name,
        prisoner_id: conn.prisoner_prisoner_id
      }
    }));

    res.json(formattedConnections);
  } catch (err) {
    console.error('Error in /connections route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create family connection (for jailers)
router.post('/connect', async (req, res) => {
  try {
    const { family_member_id, prisoner_id, relationship } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!relationship || !family_member_id || !prisoner_id) {
      return res.status(400).json({ message: 'Missing required fields: family_member_id, prisoner_id, relationship' });
    }

    // Check if connection already exists
    const existingConnection = await pool.query(
      'SELECT * FROM family_connections WHERE prisoner_id = $1 AND family_member_id = $2',
      [prisoner_id, family_member_id]
    );

    if (existingConnection.rows.length > 0) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    // Create connection
    const connection = await pool.query(
      'INSERT INTO family_connections (prisoner_id, family_member_id, relationship) VALUES ($1, $2, $3) RETURNING *',
      [prisoner_id, family_member_id, relationship]
    );

    res.status(201).json(connection.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete family connection (for jailers)
router.delete('/connections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'jailer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query('DELETE FROM family_connections WHERE id = $1', [id]);
    res.json({ message: 'Connection deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get connected prisoners for family member
router.get('/prisoners', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'family') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prisoners = await pool.query(`
      SELECT p.* 
      FROM prisoners p
      JOIN family_connections fc ON p.id = fc.prisoner_id
      WHERE fc.family_member_id = $1
    `, [decoded.id]);

    res.json(prisoners.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 