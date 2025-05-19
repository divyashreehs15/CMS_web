const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  max: 1,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

async function initializeDatabase() {
  let client;
  let retries = 3;
  
  while (retries > 0) {
    try {
      // Get a client from the pool
      client = await pool.connect();
      console.log('Connected to database');

      // Read the schema file
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      // Execute the schema
      await client.query(schema);
      console.log('Database tables created successfully');

      // Create a default admin user
      const hashedPassword = '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0JxSqU9Ue'; // password: admin123
      await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
        ['admin', hashedPassword, 'jailer']
      );
      console.log('Default admin user created');

      process.exit(0);
    } catch (err) {
      console.error(`Error initializing database (attempts left: ${retries - 1}):`, err);
      
      if (err.code === 'XX000' || err.message.includes('timeout')) {
        console.error('Connection error. Please check your DATABASE_URL in .env file');
        console.error('Make sure your Neon Tech connection string is correct and the project is active');
      }
      
      retries--;
      if (retries === 0) {
        console.error('Failed to initialize database after multiple attempts');
        process.exit(1);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  
  await pool.end();
}

initializeDatabase(); 