import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stashDraft,
  takeStashedDraft,
  clearStashedDraft,
  DRAFT_STASH_KEY,
  STASH_MAX_AGE_MS,
  type StorageLike,
} from './draftStash.ts';

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

const sample = { title: 'Statement of Condemnation', body: 'Two hours of writing.', gallery: [] };

test('a stashed draft round-trips', () => {
  const s = memoryStorage();
  assert.equal(stashDraft(s, sample, 'post-123', 1000), true);
  const got = takeStashedDraft<typeof sample>(s, 2000);
  assert.deepEqual(got?.draft, sample);
  assert.equal(got?.editingId, 'post-123');
});

test('a new (unsaved) post round-trips with a null id', () => {
  const s = memoryStorage();
  stashDraft(s, sample, null, 1000);
  assert.equal(takeStashedDraft(s, 1000)?.editingId, null);
});

test('taking the stash clears it — a draft is restored once, not on every login', () => {
  const s = memoryStorage();
  stashDraft(s, sample, null, 1000);
  assert.ok(takeStashedDraft(s, 1000));
  assert.equal(takeStashedDraft(s, 1000), null);
  assert.equal(s.data[DRAFT_STASH_KEY], undefined);
});

test('nothing stashed means nothing restored', () => {
  assert.equal(takeStashedDraft(memoryStorage(), 1000), null);
});

test('a stale stash is discarded, and clearing it still happens', () => {
  const s = memoryStorage();
  stashDraft(s, sample, null, 1000);
  assert.equal(takeStashedDraft(s, 1000 + STASH_MAX_AGE_MS + 1), null);
  assert.equal(s.data[DRAFT_STASH_KEY], undefined, 'a stale entry should not linger');
});

test('a stash from the future (clock change) is discarded', () => {
  const s = memoryStorage();
  stashDraft(s, sample, null, 10_000_000);
  assert.equal(takeStashedDraft(s, 1000), null);
});

test('corrupt or hand-edited JSON never throws', () => {
  for (const junk of ['{', 'null', '"a string"', '[]', '{"draft":null}', '{"draft":{},"savedAt":"nope"}']) {
    const s = memoryStorage({ [DRAFT_STASH_KEY]: junk });
    assert.equal(takeStashedDraft(s, 1000), null, junk);
  }
});

test('a storage that throws degrades quietly instead of breaking the login screen', () => {
  const throwing: StorageLike = {
    getItem() {
      throw new Error('SecurityError');
    },
    setItem() {
      throw new Error('QuotaExceededError');
    },
    removeItem() {
      throw new Error('SecurityError');
    },
  };
  assert.equal(stashDraft(throwing, sample, null), false);
  assert.equal(takeStashedDraft(throwing), null);
  assert.doesNotThrow(() => clearStashedDraft(throwing));
});

test('a missing storage (SSR, disabled cookies) is handled', () => {
  assert.equal(stashDraft(null, sample, null), false);
  assert.equal(takeStashedDraft(undefined), null);
  assert.doesNotThrow(() => clearStashedDraft(null));
});
