// scripts/init-db.js
require('dotenv').config({ path: '.env.local' });

const { Client } = require('pg');

// Read DATABASE_URL from environment variables
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  try {
    // Connect to Neon Postgres
    await client.connect();
    console.log('Connected to database');

    // SQL must be inside a STRING (template string using backticks)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS pastes (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ NULL,
        max_views INTEGER NULL,
        view_count INTEGER NOT NULL DEFAULT 0
      );
    `;

    // Run the SQL query
    await client.query(createTableQuery);
    console.log('Table "pastes" is ready');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    // Always close DB connection
    await client.end();
    console.log('Done');
  }
}

init();
