import type { APIRoute } from 'astro';

export const prerender = false;

// Collector for the Content-Security-Policy-Report-Only header in vercel.json.
//
// The policy shipped for months with no report-uri and no report-to, so it enforced
// nothing AND reported nowhere — a header that looked like a control and wasn't. This
// endpoint makes the report-only phase actually produce evidence: run it for a while,
// read the violations in the Vercel function logs, and use them to decide what an
// enforcing policy can safely contain.
//
// Deliberately minimal: unauthenticated (browsers send these without credentials),
// nothing persisted, a hard body cap so it can't be used for log flooding, and always
// 204 so a misbehaving reporter never retries against us.
const MAX_BODY_BYTES = 8 * 1024;

export const POST: APIRoute = async ({ request }) => {
  try {
    const length = Number(request.headers.get('content-length') ?? '0');
    if (length > MAX_BODY_BYTES) return new Response(null, { status: 204 });

    const text = (await request.text()).slice(0, MAX_BODY_BYTES);
    if (!text) return new Response(null, { status: 204 });

    // Two wire formats: the legacy report-uri body is { "csp-report": {…} }, the
    // Reporting API sends { body: {…} } (or an array of those).
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const first = Array.isArray(parsed) ? ((parsed[0] ?? {}) as Record<string, unknown>) : parsed;
    const report = (first['csp-report'] ?? first.body ?? first) as Record<string, unknown>;

    // One line, only the fields that identify what to allow — never the whole payload.
    console.warn('[csp]', {
      directive: report['effective-directive'] ?? report['effectiveDirective'] ?? report['violated-directive'],
      blocked: report['blocked-uri'] ?? report['blockedURL'],
      document: report['document-uri'] ?? report['documentURL'],
      sample: String(report['script-sample'] ?? report['sample'] ?? '').slice(0, 120),
    });
  } catch {
    // A malformed report is not worth an error response — the browser can't fix it.
  }
  return new Response(null, { status: 204 });
};
