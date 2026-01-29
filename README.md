# Pastebin Clone (TTL & View-Limited)

A simple Pastebin-like service built as part of an assignment.

## Features
- Create text pastes
- Time-based expiry (TTL)
- View-count based expiry
- Pastes auto-expire after limits
- Simple frontend to view pastes

## Tech Stack
- Node.js
- Next.js (App Router)
- PostgreSQL (Neon)
- REST APIs

- ## Running Locally

```bash
npm install
npm run dev


## API Endpoints

### Create Paste
POST `/api/pastes`

```json
{
  "content": "hello world",
  "ttl_seconds": 60,
  "max_views": 2
}
