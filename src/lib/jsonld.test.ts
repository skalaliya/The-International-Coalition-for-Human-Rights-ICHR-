// Run: node --experimental-strip-types --test src/lib/jsonld.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeJsonLd } from './jsonld.ts';

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

test('escapes a script-breakout payload in a CMS title', () => {
  const payload = '</script><script>alert(1)</script>';
  const out = safeJsonLd({ headline: payload });

  // Nothing that can terminate the <script> block survives.
  assert.ok(!out.includes('<'), 'output must contain no literal <');
  assert.ok(!out.includes('>'), 'output must contain no literal >');
  assert.ok(!/<\/script/i.test(out), 'output must not contain a closing script tag');

  // ...and the data still round-trips unchanged for schema.org consumers.
  assert.equal(JSON.parse(out).headline, payload);
});

test('escapes raw line/paragraph separators', () => {
  const value = `a${LS}b${PS}c`;
  const out = safeJsonLd({ v: value });

  assert.ok(!out.includes(LS), 'U+2028 must not survive');
  assert.ok(!out.includes(PS), 'U+2029 must not survive');
  assert.equal(JSON.parse(out).v, value);
});

test('escapes ampersands without corrupting them', () => {
  const out = safeJsonLd({ name: 'Truth & Justice' });
  assert.ok(!out.includes('&'), 'output must contain no literal &');
  assert.equal(JSON.parse(out).name, 'Truth & Justice');
});

test('leaves ordinary NewsArticle payloads semantically identical', () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    inLanguage: 'ar',
    headline: 'بشأن الانحياز الإجرائي والانتقائية',
    author: { '@type': 'Organization', name: 'ICHR' },
  };
  assert.deepEqual(JSON.parse(safeJsonLd(jsonLd)), jsonLd);
});
