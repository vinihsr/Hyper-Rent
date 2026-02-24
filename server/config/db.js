const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL via Environment Variables');
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};