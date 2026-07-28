// Guards against a runaway-refetch regression in the admin island.
//
// useToasts() returned a single object literal holding both the toast list and the
// success/error actions, so the returned object had a NEW identity on every render.
// handleError depended on it, refreshList depended on handleError, and the effect that
// calls refreshList depended on refreshList — so the effect re-ran on every render, and
// every run set state and triggered another render.
//
// Measured with a stubbed client: 11,331 calls to getAllPosts in 2 seconds — roughly
// 5,600 requests per second at the admin API and Neon behind it — with the loading
// skeleton pinned on because each pass reset loadingList to true. After the fix: 1 call.
//
// This is invisible to eslint's exhaustive-deps: the dependency arrays were *correct*.
// The problem was the stability of what they pointed at, which only a human or a
// measurement catches. Hence a source-level guard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SRC = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'components', 'react', 'AdminDashboard.tsx'),
  'utf8',
);

test('useToasts returns memoized actions, not a fresh object literal', () => {
  const hook = SRC.slice(SRC.indexOf('function useToasts'), SRC.indexOf('const ToastStack'));
  assert.match(
    hook,
    /const notify = useMemo\(/,
    'useToasts must memoize its actions. Returning them in a plain object literal gives ' +
      'them a new identity every render, which makes every dependent callback and effect ' +
      'rebuild — the refresh effect then re-runs on every render (measured: ~5,600 req/s).',
  );
  assert.match(hook, /return \{ toasts, notify \}/, 'keep the changing list separate from the stable actions');
});

test('nothing depends on the whole toast object', () => {
  assert.doesNotMatch(
    SRC,
    /\[\s*toast\s*\]/,
    'depend on `notify` (stable), never on the object returned by useToasts as a whole',
  );
});

test('the toast id counter survives re-renders', () => {
  const hook = SRC.slice(SRC.indexOf('function useToasts'), SRC.indexOf('const ToastStack'));
  assert.match(hook, /idRef = React\.useRef\(/, 'a plain `let` resets every render, so ids collide');
  assert.doesNotMatch(hook, /let counter = 0/);
});

test('the list-refresh effect depends only on stable values', () => {
  // If either of these stops being stable, the effect turns into a render loop again.
  assert.match(SRC, /\}, \[authed, refreshList\]\);/, 'refresh effect deps changed — re-check stability');
  assert.match(SRC, /\[handleError\],/, 'refreshList should depend on handleError only');
  assert.match(SRC, /\[notify\],/, 'handleError should depend on the memoized notify only');
});
