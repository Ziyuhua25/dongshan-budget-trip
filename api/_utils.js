const defaultAllowedOrigin = '*';

export function applyCors(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || defaultAllowedOrigin;
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function sendJson(res, status, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(payload);
}

export function requirePost(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
    return false;
  }
  return true;
}

export function requireAdmin(req, res) {
  const expected = process.env.ADMIN_TOKEN;
  const actual = req.headers['x-admin-token'];

  if (!expected) {
    sendJson(res, 500, {
      error: 'ADMIN_TOKEN is not configured on the backend.',
    });
    return false;
  }

  if (!actual || actual !== expected) {
    sendJson(res, 401, {
      error: 'Invalid admin token.',
    });
    return false;
  }

  return true;
}

export function safeString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

export function extractResponseText(data) {
  if (typeof data?.output_text === 'string') {
    return data.output_text;
  }

  const chunks = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join('\n').trim();
}

export function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export function slugify(input) {
  return String(input || 'travel-update')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'travel-update';
}
