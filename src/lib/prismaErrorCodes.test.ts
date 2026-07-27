import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyDbError, isNotFoundCode, isUnavailableCode } from './prismaErrorCodes.ts';

test('P2025 is the only genuine not-found', () => {
  assert.ok(isNotFoundCode('P2025'));
  assert.equal(isNotFoundCode('P1001'), false);
  assert.equal(isNotFoundCode(undefined), false);
});

test('connection-level codes are unavailable', () => {
  for (const code of ['P1000', 'P1001', 'P1002', 'P1008', 'P1011', 'P1017']) {
    assert.ok(isUnavailableCode(code), code);
  }
  assert.equal(isUnavailableCode('P2025'), false);
});

test('a missing record classifies as not-found', () => {
  assert.equal(classifyDbError({ code: 'P2025' }), 'not-found');
});

test('an unreachable database classifies as unavailable, not not-found', () => {
  // This is the bug: an outage used to surface to the editor as "Post not found".
  assert.equal(classifyDbError({ code: 'P1001' }), 'unavailable');
  assert.equal(classifyDbError({ name: 'PrismaClientInitializationError' }), 'unavailable');
});

test('unknown failures default to unavailable rather than claiming the row is gone', () => {
  assert.equal(classifyDbError(new Error('boom')), 'unavailable');
  assert.equal(classifyDbError(null), 'unavailable');
  assert.equal(classifyDbError(undefined), 'unavailable');
  assert.equal(classifyDbError('a string'), 'unavailable');
});
