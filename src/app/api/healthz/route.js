// src/app/api/healthz/route.js

import { Client } from 'pg';

export async function GET() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    // Try connecting to DB
    await client.connect();
    await client.end();

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
