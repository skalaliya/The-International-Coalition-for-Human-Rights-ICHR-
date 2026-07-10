/**
 * Serialize a value for embedding inside <script type="application/ld+json">.
 *
 * `JSON.stringify` does NOT escape `<`, so CMS-authored text (a post title, say)
 * containing `</script><script>…` would terminate the block and execute. U+2028
 * and U+2029 are raw line terminators to a JS parser and must be escaped too.
 *
 * Those two cannot appear directly in a regex literal — a regex literal may not
 * contain a line terminator, and both of them are one — so the pattern is built
 * from char codes instead.
 *
 * The \uXXXX forms are byte-identical to the originals once the JSON is parsed,
 * so consumers (Google Rich Results, schema.org validators) see the same data.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  [LINE_SEPARATOR]: '\\u2028',
  [PARAGRAPH_SEPARATOR]: '\\u2029',
};

const UNSAFE = new RegExp(`[<>&${LINE_SEPARATOR}${PARAGRAPH_SEPARATOR}]`, 'g');

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(UNSAFE, (ch) => ESCAPES[ch] ?? ch);
}
