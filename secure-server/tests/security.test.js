const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const request = require('supertest');

process.env.DB_PATH = path.join(__dirname, 'test.sqlite');
process.env.SESSION_SECRET = 'test-secret';

const { prepareApp } = require('../src/app');

let app;
let agent;

async function csrfToken() {
  const res = await agent.get('/api/csrf-token');
  return res.body.csrfToken;
}

test.before(async () => {
  if (fs.existsSync(process.env.DB_PATH)) fs.unlinkSync(process.env.DB_PATH);
  app = await prepareApp();
  agent = request.agent(app);
});

test.after(() => {
  if (fs.existsSync(process.env.DB_PATH)) fs.unlinkSync(process.env.DB_PATH);
  const authLog = path.join(__dirname, '..', 'auth-failures.log');
  if (fs.existsSync(authLog)) fs.unlinkSync(authLog);
});

test('blocks SQL injection payload in login via validation + parameterized query', async () => {
  const token = await csrfToken();
  const res = await agent
    .post('/api/login')
    .set('x-csrf-token', token)
    .send({ username: "admin' OR 1=1 --", password: 'anything' });

  assert.equal(res.status, 400);
});

test('blocks state-changing request when CSRF token is missing', async () => {
  const res = await agent.post('/api/login').send({ username: 'admin', password: 'ChangeMe123!' });
  assert.equal(res.status, 403);
});

test('sanitizes XSS content in output', async () => {
  const payload = '<img src=x onerror=alert(1)>';
  const res = await agent.get('/api/echo').query({ q: payload }).expect(200);
  assert.equal(res.body.message, '&lt;img src=x onerror=alert(1)&gt;');
});

test('logs failed authentication attempts', async () => {
  const token = await csrfToken();
  await agent
    .post('/api/login')
    .set('x-csrf-token', token)
    .send({ username: 'admin', password: 'WrongPassword!1' })
    .expect(401);

  const authLog = path.join(__dirname, '..', 'auth-failures.log');
  assert.equal(fs.existsSync(authLog), true);
  const content = fs.readFileSync(authLog, 'utf8');
  assert.match(content, /login_failed_bad_password/);
});
