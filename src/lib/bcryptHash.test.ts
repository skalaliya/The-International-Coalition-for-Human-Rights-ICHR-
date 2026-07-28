import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBcryptCost, needsRehash } from './bcryptHash.ts';

// A real cost-10 hash (the shape the production admin row was found in) and a cost-12 one.
const COST_10 = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const COST_12 = '$2a$12$3aFpeApy/3vnAC.Dydsaq.XrUPFo6t1MKDFlLwjnSHfaqj5lcmgEW';

test('reads the cost out of a bcrypt hash', () => {
  assert.equal(parseBcryptCost(COST_10), 10);
  assert.equal(parseBcryptCost(COST_12), 12);
  assert.equal(parseBcryptCost('$2b$14$' + 'a'.repeat(53)), 14);
  assert.equal(parseBcryptCost('$2y$08$' + 'a'.repeat(53)), 8);
});

test('rejects anything that is not a bcrypt hash', () => {
  for (const junk of ['', 'not-a-hash', '$2a$10$tooshort', '$1$md5$xxxx', null, undefined, '$2a$xx$' + 'a'.repeat(53)]) {
    assert.equal(parseBcryptCost(junk as string), null, JSON.stringify(junk));
  }
});

test('a weaker stored hash needs upgrading — this is the production case', () => {
  // The admin row was cost 10 while the dummy was cost 12, so a valid username
  // answered measurably faster than an unknown one.
  assert.equal(needsRehash(COST_10, 12), true);
});

test('a matching hash is left alone', () => {
  assert.equal(needsRehash(COST_12, 12), false);
});

test('a stronger hash is never downgraded', () => {
  assert.equal(needsRehash('$2a$14$' + 'a'.repeat(53), 12), false);
});

test('a malformed hash is not treated as rehashable', () => {
  // Nothing verified against it, so there is no verified password to re-hash.
  assert.equal(needsRehash('garbage', 12), false);
  assert.equal(needsRehash(null, 12), false);
});
