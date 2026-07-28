import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePageParam, clampPageNumber, MAX_PAGE } from './pagination.ts';

test('junk collapses to page 1 instead of NaN', () => {
  // The original bug: Math.max(1, Number('abc')) === NaN → skip: NaN → Prisma throws.
  for (const junk of ['abc', '', '   ', 'null', 'undefined', '--1', 'e', '1abc2']) {
    assert.equal(parsePageParam(junk), 1, JSON.stringify(junk));
  }
  assert.equal(parsePageParam(null), 1);
  assert.equal(parsePageParam(undefined), 1);
});

test('never returns NaN, for any input', () => {
  for (const input of ['abc', '', null, undefined, 'NaN', 'Infinity', '-Infinity']) {
    assert.ok(Number.isInteger(parsePageParam(input)), `${input} produced a non-integer`);
  }
});

test('reads ordinary page numbers', () => {
  assert.equal(parsePageParam('1'), 1);
  assert.equal(parsePageParam('7'), 7);
  assert.equal(parsePageParam(' 42 '), 42);
});

test('zero and negatives clamp up to 1', () => {
  assert.equal(parsePageParam('0'), 1);
  assert.equal(parsePageParam('-5'), 1);
  assert.equal(parsePageParam('-99999999'), 1);
});

test('huge values clamp to MAX_PAGE so OFFSET stays bounded', () => {
  assert.equal(parsePageParam('99999999'), MAX_PAGE);
  assert.equal(parsePageParam('1e12'), 1, 'parseInt stops at the "e" — 1, not a billion');
  assert.equal(parsePageParam(String(Number.MAX_SAFE_INTEGER)), MAX_PAGE);
});

test('floats floor rather than reaching Prisma as decimals', () => {
  assert.equal(parsePageParam('2.9'), 2);
  assert.equal(parsePageParam('1.0'), 1);
});

test('clampPageNumber defends the query boundary too', () => {
  assert.equal(clampPageNumber(NaN), 1);
  assert.equal(clampPageNumber(undefined), 1);
  assert.equal(clampPageNumber(0), 1);
  assert.equal(clampPageNumber(-3), 1);
  assert.equal(clampPageNumber(2.7), 2);
  assert.equal(clampPageNumber(1e9), MAX_PAGE);
  assert.equal(clampPageNumber(5), 5);
});

test('a clamped page always produces a finite, non-negative OFFSET', () => {
  const pageSize = 9;
  for (const input of ['abc', '-1', '0', '1e12', '99999999', null]) {
    const skip = (parsePageParam(input) - 1) * pageSize;
    assert.ok(Number.isFinite(skip) && skip >= 0, `${input} → skip ${skip}`);
  }
});
