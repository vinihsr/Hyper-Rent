const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// db_connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://vini:vini@Oncar_test_db:5432/Oncar_test'
});

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Database Test Route
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ db_status: 'Connected', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});