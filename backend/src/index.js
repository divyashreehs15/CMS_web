require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// Routes
const authRoutes = require('./routes/auth');
const prisonerRoutes = require('./routes/prisoners');
const visitRoutes = require('./routes/visits');
const wageRoutes = require('./routes/wages');
const healthRoutes = require('./routes/health');
const behaviorRoutes = require('./routes/behavior');
const workRoutes = require('./routes/work');
const legalRoutes = require('./routes/legal');
const familyRoutes = require('./routes/family');

app.use('/api/auth', authRoutes);
app.use('/api/prisoners', prisonerRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/wages', wageRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/work', workRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/family', familyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 