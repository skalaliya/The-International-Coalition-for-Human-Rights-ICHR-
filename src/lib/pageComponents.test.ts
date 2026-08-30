// Guards the boundary that caused a live production bug.
//
// src/components/pages/ArticlePage.astro used to call `return Astro.rewrite('/404')`.
// Astro sent the rewrite, kept rendering the component into the already-sent response,
// and the Vercel adapter served the string "Internal server error" with HTTP 200 — for
// every missing slug, every draft, and every article during a database outage. Crawlers
// index a soft-200 error page.
//
// Response control (status, rewrite, redirect, returning a Response) belongs to a PAGE,
// where frontmatter runs before the body streams. These tests fail if it creeps back
// into a component.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join } from 'node:path';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_COMPONENTS = join(SRC, 'components', 'pages');

const componentFiles = readdirSync(PAGE_COMPONENTS).filter((f) => f.endsWith('.astro'));

test('page components exist to be checked', () => {
  assert.ok(componentFiles.length >= 5, `expected several *Page.astro components, found ${componentFiles.length}`);
});

for (const file of componentFiles) {
  test(`${file} does not control the response (that is the route's job)`, () => {
    const src = readFileSync(join(PAGE_COMPONENTS, file), 'utf8');
    // Only the frontmatter can execute; the markup below it cannot call these.
    const frontmatter = src.startsWith('---') ? src.slice(3, src.indexOf('\n---', 3)) : '';
    const code = frontmatter
      .split('\n')
      .filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*'))
      .join('\n');

    for (const forbidden of ['Astro.rewrite', 'Astro.redirect', 'Astro.response.status']) {
      assert.ok(
        !code.includes(forbidden),
        `${file} uses ${forbidden} in its frontmatter. A component renders into an ` +
          'already-sent response — move this into the route file under src/pages/.',
      );
    }
  });
}

test('every [slug] route owns its own 404 decision', () => {
  // Each route must RESOLVE its content itself and set the status from the route file.
  // The resolver differs per section (the newsroom hits the database, /media reads the
  // static registry), so the loader is named per route rather than assumed.
  const routes: { file: string; resolver: RegExp }[] = [
    { file: join(SRC, 'pages', 'news', '[slug].astro'), resolver: /loadArticle\(/ },
    { file: join(SRC, 'pages', 'ar', 'news', '[slug].astro'), resolver: /loadArticle\(/ },
    { file: join(SRC, 'pages', 'fr', 'news', '[slug].astro'), resolver: /loadArticle\(/ },
    { file: join(SRC, 'pages', 'media', '[slug].astro'), resolver: /getVideo\(/ },
    { file: join(SRC, 'pages', 'ar', 'media', '[slug].astro'), resolver: /getVideo\(/ },
    { file: join(SRC, 'pages', 'fr', 'media', '[slug].astro'), resolver: /getVideo\(/ },
  ];
  for (const { file, resolver } of routes) {
    const src = readFileSync(file, 'utf8');
    assert.match(src, resolver, `${file} should resolve its own content`);
    assert.match(src, /Astro\.response\.status = 404/, `${file} should set a 404 status when the content is missing`);
    assert.match(src, /NotFoundPage/, `${file} should render the localized not-found body`);
  }
});

test('every dynamic route under src/pages is covered by the 404 test above', () => {
  // The list above is hand-written, so a NEW section could add a [slug] route and quietly
  // skip the check that this whole file exists to enforce. This finds that.
  const known = new Set(['news', 'media']);
  const found = new Set<string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.startsWith('[') && entry.name.endsWith('.astro')) found.add(basename(dirname(full)));
    }
  };
  walk(join(SRC, 'pages'));
  for (const section of found) {
    assert.ok(
      known.has(section),
      `src/pages/**/${section}/[...].astro is a dynamic route with no entry in the 404 test — ` +
        'add it there, or a missing slug will serve a soft 200.',
    );
  }
});

test('the 404 pages stay on-demand — prerendering them would freeze the status at build time', () => {
  for (const p of ['404.astro', join('ar', '404.astro'), join('fr', '404.astro')]) {
    const src = readFileSync(join(SRC, 'pages', p), 'utf8');
    assert.doesNotMatch(
      src,
      /export const prerender\s*=\s*true/,
      `${p} must not be prerendered: Astro.response.status becomes a build-time no-op and the page would serve 200.`,
    );
  }
});
