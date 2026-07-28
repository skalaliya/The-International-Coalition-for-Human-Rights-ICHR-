import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteUrl, LOCAL_SITE_URL } from './siteUrl.ts';

test('an explicit PUBLIC_SITE_URL wins', () => {
  assert.equal(
    resolveSiteUrl({ PUBLIC_SITE_URL: 'https://www.ichr-international.org' }),
    'https://www.ichr-international.org',
  );
});

test('trailing slashes are stripped, so callers can concatenate paths', () => {
  assert.equal(
    resolveSiteUrl({ PUBLIC_SITE_URL: 'https://www.ichr-international.org//' }),
    'https://www.ichr-international.org',
  );
});

test('an empty or whitespace PUBLIC_SITE_URL falls through instead of emitting ""', () => {
  assert.equal(
    resolveSiteUrl({ PUBLIC_SITE_URL: '   ', VERCEL_BRANCH_URL: 'ichr-git-x.vercel.app' }),
    'https://ichr-git-x.vercel.app',
  );
});

// The bug this module exists for: PUBLIC_SITE_URL is set for Production and
// Development but not Preview, so every preview deploy published a sitemap of
// http://localhost:4321/... URLs and canonical tags nobody could reach.
test('a preview deploy resolves to its branch alias, not localhost', () => {
  const url = resolveSiteUrl({
    VERCEL_ENV: 'preview',
    VERCEL_BRANCH_URL: 'ichr-git-fix-site-robustness-skalaliyas-projects.vercel.app',
    VERCEL_URL: 'ichr-o3vh8tbkq-skalaliyas-projects.vercel.app',
  });
  assert.equal(url, 'https://ichr-git-fix-site-robustness-skalaliyas-projects.vercel.app');
  assert.ok(!url.includes('localhost'));
});

test('VERCEL_URL is used when there is no branch alias', () => {
  assert.equal(
    resolveSiteUrl({ VERCEL_ENV: 'preview', VERCEL_URL: 'ichr-o3vh8tbkq.vercel.app' }),
    'https://ichr-o3vh8tbkq.vercel.app',
  );
});

test('production prefers the project domain over the deployment hostname', () => {
  assert.equal(
    resolveSiteUrl({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'www.ichr-international.org',
      VERCEL_URL: 'ichr-9t0c2muum-skalaliyas-projects.vercel.app',
    }),
    'https://www.ichr-international.org',
  );
});

test('the bare hostnames Vercel supplies get an https:// scheme', () => {
  assert.equal(resolveSiteUrl({ VERCEL_URL: 'ichr.vercel.app' }), 'https://ichr.vercel.app');
});

test('off-platform it still resolves to localhost', () => {
  assert.equal(resolveSiteUrl({}), LOCAL_SITE_URL);
});
