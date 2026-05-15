const { test } = require('node:test');
const assert = require('node:assert');
const { isValidEmail, validateAccess, validateNewsletter } = require('../api/_lib/validate');

test('isValidEmail rejects string without @', () => {
  assert.strictEqual(isValidEmail('notanemail'), false);
});

test('isValidEmail rejects empty string', () => {
  assert.strictEqual(isValidEmail(''), false);
});

test('isValidEmail accepts valid email', () => {
  assert.strictEqual(isValidEmail('user@example.com'), true);
});

test('validateAccess rejects missing name', () => {
  const r = validateAccess({ email: 'a@b.com', spaceType: 'Café' });
  assert.strictEqual(r.valid, false);
  assert.ok(r.error.toLowerCase().includes('name'));
});

test('validateAccess rejects invalid email', () => {
  const r = validateAccess({ name: 'Alice', email: 'bad', spaceType: 'Café' });
  assert.strictEqual(r.valid, false);
  assert.ok(r.error.toLowerCase().includes('email'));
});

test('validateAccess rejects missing spaceType', () => {
  const r = validateAccess({ name: 'Alice', email: 'a@b.com' });
  assert.strictEqual(r.valid, false);
  assert.ok(r.error.toLowerCase().includes('space type'));
});

test('validateAccess accepts valid input with optional notes', () => {
  const r = validateAccess({ name: 'Alice', email: 'a@b.com', spaceType: 'Café', notes: '120sqm' });
  assert.strictEqual(r.valid, true);
});

test('validateAccess accepts valid input without notes', () => {
  const r = validateAccess({ name: 'Alice', email: 'a@b.com', spaceType: 'Café' });
  assert.strictEqual(r.valid, true);
});

test('validateNewsletter rejects invalid email', () => {
  const r = validateNewsletter({ email: 'bad' });
  assert.strictEqual(r.valid, false);
});

test('validateNewsletter rejects missing email', () => {
  const r = validateNewsletter({});
  assert.strictEqual(r.valid, false);
});

test('validateNewsletter accepts valid email', () => {
  const r = validateNewsletter({ email: 'a@b.com' });
  assert.strictEqual(r.valid, true);
});
