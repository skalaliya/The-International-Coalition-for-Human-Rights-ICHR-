// The failure this pins down: a malformed ISO-8601 duration is not an error anywhere —
// the page renders, the build passes, and Google silently drops the video rich result.
// So the formatter is tested rather than eyeballed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toIso8601, toClock, toSpoken } from './duration.ts';

test('toIso8601 emits the Schema.org form', () => {
  assert.equal(toIso8601(856), 'PT14M16S', 'the real 14:16 panel video');
  assert.equal(toIso8601(292), 'PT4M52S');
  assert.equal(toIso8601(45), 'PT45S', 'under a minute has no M component');
  assert.equal(toIso8601(60), 'PT1M', 'an exact minute has no S component');
  assert.equal(toIso8601(3600), 'PT1H');
  assert.equal(toIso8601(3723), 'PT1H2M3S');
  assert.equal(toIso8601(3660), 'PT1H1M', 'zero seconds is omitted, not written as 0S');
});

test('toIso8601 never returns an empty or NaN-bearing duration', () => {
  // "PT" alone is invalid ISO-8601; so is "PTNaNS". Either would poison the JSON-LD.
  for (const input of [0, -1, -3600, NaN, Infinity, -Infinity, 0.4]) {
    const out = toIso8601(input);
    assert.match(out, /^PT(\d+H)?(\d+M)?(\d+S)?$/, `${input} → ${out}`);
    assert.notEqual(out, 'PT', `${input} produced the empty duration`);
    assert.ok(!out.includes('NaN'), `${input} produced ${out}`);
  }
  assert.equal(toIso8601(0), 'PT0S');
});

test('toClock is the badge form, Latin digits, hour-aware', () => {
  assert.equal(toClock(856), '14:16');
  assert.equal(toClock(292), '4:52');
  assert.equal(toClock(45), '0:45', 'seconds-only still shows a minutes field');
  assert.equal(toClock(60), '1:00');
  assert.equal(toClock(3723), '1:02:03', 'past an hour, minutes and seconds are padded');
  assert.equal(toClock(0), '0:00');
  assert.equal(toClock(NaN), '0:00', 'a bad number degrades to 0:00, never "NaN:NaN"');
});

test('toClock always has two digits after the last colon', () => {
  for (const s of [5, 61, 599, 600, 3601, 3661, 7199]) {
    assert.match(toClock(s), /:\d{2}$/, `${s} → ${toClock(s)}`);
  }
});

test('toSpoken says the duration in words, per locale', () => {
  assert.equal(toSpoken(856, 'en'), '14 minutes 16 seconds');
  assert.equal(toSpoken(856, 'fr'), '14 minutes 16 secondes');
  assert.equal(toSpoken(3723, 'en'), '1 hour 2 minutes 3 seconds');
  assert.equal(toSpoken(45, 'en'), '45 seconds');
  assert.equal(toSpoken(60, 'en'), '1 minute', 'an exact minute does not say "0 seconds"');
  assert.equal(toSpoken(0, 'en'), '0 seconds', 'zero still says something');
});

test('toSpoken follows Arabic number agreement', () => {
  // Arabic is not one/other: 1 is singular, 2 is the dual, 3–10 takes the plural,
  // and 11+ returns to the singular. A naive `${n} دقائق` sounds wrong to a native ear.
  assert.equal(toSpoken(60, 'ar'), 'دقيقة', '1 → singular, no numeral');
  assert.equal(toSpoken(120, 'ar'), 'دقيقتان', '2 → the dual, no numeral');
  assert.equal(toSpoken(300, 'ar'), '5 دقائق', '3–10 → plural');
  assert.equal(toSpoken(856, 'ar'), '14 دقيقة و16 ثانية', '11+ → singular form with the numeral');
  assert.equal(toSpoken(1, 'ar'), 'ثانية');
});

test('toSpoken defaults to English and never throws on a bad locale', () => {
  assert.equal(toSpoken(856), '14 minutes 16 seconds');
  // @ts-expect-error — deliberately passing an unsupported locale
  assert.ok(toSpoken(856, 'de').length > 0);
});
