const { Pool } = require('pg');

/**
 * DB helper: uses DATABASE_URL from .env or Vercel env.
 * In production (NODE_ENV=production) we set ssl.rejectUnauthorized=false
 * because Neon requires TLS and serverless environments sometimes need that.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Simple wrapper to run queries: db.query(text, params)
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
