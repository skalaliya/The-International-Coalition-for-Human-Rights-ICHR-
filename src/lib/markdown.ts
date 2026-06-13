// SERVER-SIDE Markdown → sanitized HTML (used by the SSR article page).
// The admin live preview uses its own client renderer (marked + DOMPurify);
// both share the same `marked` grammar.
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

marked.setOptions({ gfm: true, breaks: false });

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  // sanitize-html defaults EXCLUDE img + table tags — add them explicitly.
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img',
    'figure',
    'figcaption',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'caption',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'loading'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    // Keep a single <h1> per page (the article title) — downgrade body h1 → h2.
    h1: 'h2',
  },
};

export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md ?? '', { async: false }) as string;
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
}
