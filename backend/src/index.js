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
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

// Test database connection with retries
async function testConnection(retries = 3) {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL database');
      client.release();
      return true;
    } catch (err) {
      console.error(`Database connection attempt failed (attempts left: ${retries - 1}):`, err);
      retries--;
      
      if (retries === 0) {
        console.error('Failed to connect to database after multiple attempts');
        console.error('Please check your DATABASE_URL in .env file');
        console.error('Make sure your Neon Tech connection string is correct and the project is active');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Test connection on startup
testConnection();

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