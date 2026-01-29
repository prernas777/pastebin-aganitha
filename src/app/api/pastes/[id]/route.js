// File: src/app/api/pastes/[id]/route.js

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";            // our Postgres pool
import { getNow } from "@/lib/util";       // deterministic now for TEST_MODE

export async function GET(request, { params }) {
  const { id } = params;
  // compute "now" using getNow so TEST_MODE header works
  const now = getNow(request);

  try {
    // Atomic update: increment view_count only if paste exists AND
    // (no expires_at OR expires_at > now) AND (no max_views OR view_count < max_views)
    // The RETURNING clause gives us the row after increment so we can return content and remaining views.
    const updateSql = `
      UPDATE pastes
      SET view_count = view_count + 1
      WHERE id = $1
        AND (expires_at IS NULL OR expires_at > $2)
        AND (max_views IS NULL OR view_count < max_views)
      RETURNING id, content, expires_at, max_views, view_count;
    `;

    const res = await pool.query(updateSql, [id, now.toISOString()]);

    // If no row returned, either the paste doesn't exist OR it's expired OR views exhausted
    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Paste not available" }, { status: 404 });
    }

    const row = res.rows[0];

    // Compute remaining_views: null if unlimited
    const remaining_views = row.max_views === null ? null : Math.max(0, row.max_views - row.view_count);

    return NextResponse.json({
      content: row.content,
      remaining_views,
      expires_at: row.expires_at, // will be null or ISO timestamp
    });
  } catch (err) {
    console.error("Error fetching paste:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
