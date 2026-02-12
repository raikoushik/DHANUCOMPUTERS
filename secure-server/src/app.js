const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { initDb, get, run } = require('./db');

const app = express();

const AUTH_LOG_FILE = path.join(__dirname, '..', 'auth-failures.log');


function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


function logFailedAuth(message, meta = {}) {
  const line = `${new Date().toISOString()} ${message} ${JSON.stringify(meta)}\n`;
  fs.appendFileSync(AUTH_LOG_FILE, line);
}

function generateCsrfToken() {
  return crypto.randomBytes(24).toString('hex');
}

function requireCsrf(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  const sentToken = req.get('x-csrf-token') || req.body._csrf;
  const sessionToken = req.session.csrfToken;
  if (!sentToken || !sessionToken) return res.status(403).json({ error: 'Invalid CSRF token' });

  const valid = crypto.timingSafeEqual(Buffer.from(sentToken), Buffer.from(sessionToken));
  if (!valid) return res.status(403).json({ error: 'Invalid CSRF token' });
  return next();
}

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Authentication required' });
  return next();
}

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use(session({
  name: 'dhanu.sid',
  secret: process.env.SESSION_SECRET || 'dev-only-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 30
  }
}));

app.use((req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = generateCsrfToken();
  res.locals.csrfToken = req.session.csrfToken;
  next();
});
app.use(requireCsrf);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' }
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken });
});

app.get('/api/echo', (req, res) => {
  const q = String(req.query.q || '').slice(0, 300);
  res.json({ message: escapeHtml(q) });
});

app.post(
  '/api/register',
  authLimiter,
  body('username').trim().isLength({ min: 3, max: 64 }).isAlphanumeric(),
  body('password').isStrongPassword({ minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    await run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
    return res.status(201).json({ message: 'Registered' });
  }
);

app.post(
  '/api/login',
  authLimiter,
  body('username').trim().isLength({ min: 3, max: 64 }).isAlphanumeric(),
  body('password').isLength({ min: 1, max: 255 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logFailedAuth('validation_failed', { ip: req.ip, body: { username: req.body.username || null } });
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await get('SELECT id, username, password_hash FROM users WHERE username = ?', [username]);
    if (!user) {
      logFailedAuth('login_failed_user_not_found', { ip: req.ip, username });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      logFailedAuth('login_failed_bad_password', { ip: req.ip, username });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    return res.json({ message: 'Logged in' });
  }
);

app.post('/api/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ username: escapeHtml(req.session.username) });
});

app.use(express.static(path.join(__dirname, '..', '..')));

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'Payload too large' });
  if (err) return res.status(500).json({ error: 'Server error' });
  return next();
});

async function prepareApp() {
  await initDb();
  return app;
}

module.exports = { app, prepareApp, requireCsrf };
