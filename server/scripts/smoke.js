// API smoke test (Node 18+ built-in fetch). Start the API first: `npm run dev`.
// Verifies: login → create draft → draft hidden publicly → publish → listed →
// get by slug → unpublish → slug 404 → delete.
const BASE = process.env.SMOKE_BASE || 'http://localhost:3001';
const USER = process.env.ADMIN_USERNAME || 'admin';
const PASS = process.env.ADMIN_PASSWORD || 'admin';

let pass = 0;
let fail = 0;
function check(name, ok, extra = '') {
    if (ok) {
        pass += 1;
        console.log(`  ✓ ${name}`);
    } else {
        fail += 1;
        console.error(`  ✗ ${name} ${extra}`);
    }
}

async function main() {
    // 1. Login
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: USER, password: PASS }),
    });
    const { token } = await loginRes.json();
    check('login returns token', loginRes.status === 200 && !!token, `status=${loginRes.status}`);
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 2. Create draft
    const draft = {
        title: 'Smoke Test Draft Post',
        category: 'News',
        status: 'draft',
        date: '2026-06-13',
        location: 'Test',
        excerpt: 'A smoke-test excerpt.',
        body: 'Smoke **body**.',
        hashtags: ['#smoke', 'test'],
        gallery: [{ url: '/uploads/x.jpg', caption: 'cap' }],
    };
    const createRes = await fetch(`${BASE}/api/content/posts`, {
        method: 'POST',
        headers: auth,
        body: JSON.stringify(draft),
    });
    const created = await createRes.json();
    check('create draft → 201', createRes.status === 201, `status=${createRes.status} ${JSON.stringify(created)}`);
    check('hashtags round-trip as array', Array.isArray(created.hashtags) && created.hashtags.length === 2);
    check('gallery created', Array.isArray(created.gallery) && created.gallery.length === 1);
    const id = created.id;
    const slug = created.slug;

    // 3. Draft hidden from public list
    const pubList = await (await fetch(`${BASE}/api/content/posts?pageSize=50`)).json();
    check('draft NOT in public list', !pubList.items.some((p) => p.id === id));

    // 4. Draft slug 404 publicly
    const draftSlug = await fetch(`${BASE}/api/content/posts/${slug}`);
    check('draft slug → 404 publicly', draftSlug.status === 404, `status=${draftSlug.status}`);

    // 5. Publish
    const pubRes = await fetch(`${BASE}/api/content/posts/${id}/publish`, { method: 'POST', headers: auth });
    check('publish → 200', pubRes.status === 200);

    // 6. Now listed + fetchable by slug
    const pubList2 = await (await fetch(`${BASE}/api/content/posts?pageSize=50`)).json();
    check('published IN public list', pubList2.items.some((p) => p.id === id));
    const bySlug = await fetch(`${BASE}/api/content/posts/${slug}`);
    check('published slug → 200', bySlug.status === 200);

    // 7. Unpublish → slug 404 again
    await fetch(`${BASE}/api/content/posts/${id}/unpublish`, { method: 'POST', headers: auth });
    const draftSlug2 = await fetch(`${BASE}/api/content/posts/${slug}`);
    check('unpublished slug → 404 again', draftSlug2.status === 404, `status=${draftSlug2.status}`);

    // 8. Admin list includes the draft
    const adminList = await (await fetch(`${BASE}/api/content/admin/posts?pageSize=50`, { headers: auth })).json();
    check('admin list includes draft', adminList.items.some((p) => p.id === id));

    // 9. Delete
    const delRes = await fetch(`${BASE}/api/content/posts/${id}`, { method: 'DELETE', headers: auth });
    check('delete → 200', delRes.status === 200);

    console.log(`\nSmoke: ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
    console.error('Smoke run crashed:', e);
    process.exit(1);
});
