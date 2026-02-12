# Secure Server Layer (Node.js + Express)

This folder adds a hardened backend for Dhanu Tech.

## Features implemented

- Input validation with `express-validator`.
- SQL injection protection with parameterized SQLite queries (`?` placeholders).
- CSRF protection using per-session token (`/api/csrf-token` + `x-csrf-token` header).
- Output sanitization (HTML escaping) to prevent reflected/stored XSS execution.
- Authentication with bcrypt password hashing (`bcryptjs`, 12 rounds).
- Failed login logging in `auth-failures.log`.
- HTTPS support for development with self-signed cert files in `certs/`.

## OWASP Top 10 coverage

- **A01 Broken Access Control**: `requireAuth` middleware for protected routes.
- **A02 Cryptographic Failures**: bcrypt hashes, secure session cookie defaults.
- **A03 Injection**: parameterized DB queries + strict input validation.
- **A04 Insecure Design**: CSRF + session-bound token model.
- **A05 Security Misconfiguration**: Helmet headers, CSP, disable `x-powered-by`.
- **A06 Vulnerable Components**: limited to maintained mainstream packages.
- **A07 Identification/Auth Failures**: session auth, rate limiting, failed-auth logging.
- **A08 Software/Data Integrity Failures**: controlled payload size and strict parsers.
- **A09 Security Logging/Monitoring**: auth-failure audit log.
- **A10 SSRF**: no server-side outbound URL fetch endpoints exposed.

## Local usage

```bash
npm install
npm run gen:cert   # optional for HTTPS
npm start
npm test
```

## Production HTTPS reference

Use a reverse proxy (Nginx/Caddy/ALB) with managed TLS certificates (Let's Encrypt or cloud-managed certs). Keep app behind proxy and enforce HSTS.
