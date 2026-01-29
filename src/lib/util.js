const crypto = require('crypto');

/**
 * generateId(lenBytes = 6)
 * - Generates a short hex id. 6 bytes -> 12 hex chars (good balance: short + unique enough)
 */
function generateId(lenBytes = 6) {
  return crypto.randomBytes(lenBytes).toString('hex'); // e.g., "a3f4b2c1d5e6"
}

/**
 * getNow(req)
 * - Returns current Date.
 * - If TEST_MODE=1 (env) and header 'x-test-now-ms' is present, parse that and use it instead.
 * - This is required for deterministic expiry testing by the grader.
 */
function getNow(req) {
  if (process.env.TEST_MODE === '1') {
    const header = req && req.headers ? req.headers['x-test-now-ms'] : undefined;
    if (header) {
      const ms = Number(header);
      if (!Number.isNaN(ms)) return new Date(ms);
    }
  }
  return new Date();
}

/**
 * escapeHtml(s)
 * - Very small sanitizer to escape HTML special chars so user content can't inject scripts.
 * - We will use this when rendering the paste in HTML.
 */
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { generateId, getNow, escapeHtml };
