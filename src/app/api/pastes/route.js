import db from '@/lib/db';
import { generateId, getNow } from '@/lib/util';

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    // Temporary response (DB next step)
    const id = generateId();
const now = getNow(req);

let expiresAt = null;
if (ttl_seconds !== undefined) {
  expiresAt = new Date(now.getTime() + ttl_seconds * 1000);
}

await db.query(
  `INSERT INTO pastes (id, content, created_at, expires_at, max_views)
   VALUES ($1, $2, $3, $4, $5)`,
  [id, content, now, expiresAt, max_views ?? null]
);

return NextResponse.json({
  id,
  url: `${req.nextUrl.origin}/p/${id}`
});

  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
