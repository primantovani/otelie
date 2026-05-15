const { test } = require('node:test');
const assert = require('node:assert');
const { buildPrompt } = require('../api/_lib/brief');

test('buildPrompt includes space type', () => {
  const p = buildPrompt('Café / Coffee shop', '');
  assert.ok(p.includes('Café / Coffee shop'));
});

test('buildPrompt includes notes when provided', () => {
  const p = buildPrompt('Café / Coffee shop', '120sqm in São Paulo');
  assert.ok(p.includes('120sqm in São Paulo'));
});

test('buildPrompt omits additional context line when notes is empty', () => {
  const p = buildPrompt('Café / Coffee shop', '');
  assert.ok(!p.includes('Additional context:'));
});

test('buildPrompt covers Lighting section', () => {
  assert.ok(buildPrompt('Retail store', '').includes('Lighting'));
});

test('buildPrompt covers Materials section', () => {
  assert.ok(buildPrompt('Retail store', '').includes('Materials'));
});

test('buildPrompt covers Acoustics section', () => {
  assert.ok(buildPrompt('Retail store', '').includes('Acoustics'));
});

test('buildPrompt covers Layout section', () => {
  assert.ok(buildPrompt('Retail store', '').includes('Layout'));
});
