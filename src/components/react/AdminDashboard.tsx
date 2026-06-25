import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  LayoutDashboard, LogOut, Plus, Pencil, Trash2, Eye, EyeOff, ChevronLeft,
  UploadCloud, X, CheckCircle, AlertCircle,
} from 'lucide-react';
import { api, getToken, clearToken, resolveAssetUrl, errMessage, ApiError } from './apiClient';
import { POST_CATEGORIES, type Post, type PostInput, type PostCategory, type PostStatus } from '@/types';

marked.setOptions({ gfm: true, breaks: false });

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

const LOCALE_OPTIONS: { value: string; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
  { value: 'fr', label: 'Français' },
];

const emptyDraft: PostInput = {
  slug: '',
  locale: 'en',
  title: '',
  category: 'News',
  status: 'draft',
  date: todayISODate(),
  location: '',
  excerpt: '',
  coverImageUrl: '',
  body: '',
  gallery: [],
  hashtags: [],
  authorName: '',
};

const inputCls =
  'w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1a4a68] focus:border-[#1a4a68] outline-none text-sm';

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
interface Toast { id: number; type: 'success' | 'error'; message: string; }

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;
  const push = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now() + counter++;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return {
    toasts,
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
  };
}

const ToastStack: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-50 space-y-2" role="status" aria-live="polite">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-sm ${
          t.type === 'success' ? 'bg-[#1a4a68]' : 'bg-[#b91c1c]'
        }`}
      >
        {t.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Shared Markdown preview (client-side: marked + DOMPurify)
// ---------------------------------------------------------------------------
const MarkdownPreview: React.FC<{ source: string }> = ({ source }) => {
  const html = useMemo(() => {
    const raw = marked.parse(source ?? '', { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [source]);
  return <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />;
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
const LoginScreen: React.FC<{ onAuthed: () => void }> = ({ onAuthed }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const ok = await api.login(username, password);
    setBusy(false);
    if (ok) onAuthed();
    else setError(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1a4a68] rounded-full flex items-center justify-center text-white mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">ICHR Newsroom CMS</h2>
          <p className="text-slate-500 mt-2">Secure admin login</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="login-user">Username</label>
            <input
              id="login-user"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false); }}
              className={inputCls}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`${inputCls} ${error ? 'border-red-500 focus:ring-red-400' : ''}`}
              autoComplete="current-password"
              placeholder="Password"
            />
            {error && <p className="text-red-500 text-xs mt-2">Invalid credentials</p>}
          </div>
          <button
            disabled={busy}
            className="w-full bg-[#1a4a68] hover:bg-[#133549] text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
const StatusBadge: React.FC<{ status: PostStatus }> = ({ status }) => (
  <span
    className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
      status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
    }`}
  >
    {status}
  </span>
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export const AdminDashboard: React.FC = () => {
  const [authed, setAuthed] = useState<boolean>(() => !!getToken());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PostInput>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(false);
  const [hashtagText, setHashtagText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const toast = useToasts();

  const refreshList = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await api.getAllPosts();
      setPosts(data.items);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setAuthed(false);
      } else {
        toast.error(errMessage(e));
      }
    } finally {
      setLoadingList(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authed) refreshList();
  }, [authed, refreshList]);

  const logout = () => {
    clearToken();
    window.location.href = '/';
  };

  // ----- editor open/close -----
  const openNew = () => {
    setDraft({ ...emptyDraft, date: todayISODate() });
    setEditingId(null);
    setSlugTouched(false);
    setHashtagText('');
    setErrors({});
    setView('edit');
  };

  const openEdit = (p: Post) => {
    setDraft({
      slug: p.slug,
      locale: p.locale,
      translationKey: p.translationKey,
      title: p.title,
      category: p.category,
      status: p.status,
      date: p.date.slice(0, 10),
      location: p.location ?? '',
      excerpt: p.excerpt ?? '',
      coverImageUrl: p.coverImageUrl ?? '',
      body: p.body,
      gallery: p.gallery ?? [],
      hashtags: p.hashtags ?? [],
      authorName: p.authorName ?? '',
    });
    setEditingId(p.id);
    setSlugTouched(true);
    setHashtagText((p.hashtags ?? []).map((t) => `#${t.replace(/^#/, '')}`).join(', '));
    setErrors({});
    setView('edit');
  };

  // ----- field updates -----
  const setTitle = (title: string) => {
    setDraft((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }));
  };
  const setSlug = (slug: string) => {
    setSlugTouched(true);
    setDraft((d) => ({ ...d, slug: slugify(slug) }));
  };
  const setHashtags = (text: string) => {
    setHashtagText(text);
    const tags = text
      .split(',')
      .map((s) => s.trim().replace(/^#/, ''))
      .filter(Boolean);
    setDraft((d) => ({ ...d, hashtags: tags }));
  };

  // ----- uploads -----
  const uploadCover = async (file: File) => {
    setCoverBusy(true);
    try {
      const { url } = await api.uploadImage(file);
      setDraft((d) => ({ ...d, coverImageUrl: url }));
      toast.success('Cover image uploaded');
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setCoverBusy(false);
    }
  };

  const uploadGallery = async (files: FileList) => {
    setGalleryBusy(true);
    try {
      for (const file of Array.from(files)) {
        const { url } = await api.uploadImage(file);
        setDraft((d) => ({ ...d, gallery: [...d.gallery, { url, caption: '' }] }));
      }
      toast.success('Gallery updated');
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setGalleryBusy(false);
    }
  };

  const setGalleryCaption = (i: number, caption: string) => {
    setDraft((d) => {
      const gallery = [...d.gallery];
      gallery[i] = { ...gallery[i], caption };
      return { ...d, gallery };
    });
  };
  const removeGallery = (i: number) => {
    setDraft((d) => ({ ...d, gallery: d.gallery.filter((_, idx) => idx !== i) }));
  };

  // ----- validation + save -----
  const validate = (d: PostInput): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!d.title.trim()) e.title = 'Title is required';
    if (!d.slug.trim()) e.slug = 'Slug is required';
    if (!d.excerpt.trim()) e.excerpt = 'Excerpt is required';
    if (!d.body.trim()) e.body = 'Body is required';
    if (!d.category) e.category = 'Category is required';
    return e;
  };

  const save = async (status: PostStatus) => {
    const payload: PostInput = {
      ...draft,
      status,
      date: `${draft.date}T00:00:00.000Z`,
      location: draft.location || '',
      authorName: draft.authorName || undefined,
    };
    const v = validate(payload);
    setErrors(v);
    if (Object.keys(v).length) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    setSaving(true);
    try {
      if (editingId) await api.updatePost(editingId, payload);
      else await api.createPost(payload);
      toast.success(status === 'published' ? 'Post published' : 'Draft saved');
      await refreshList();
      setView('list');
    } catch (e) {
      if (e instanceof ApiError && e.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(e.fieldErrors)) {
          if (Array.isArray(msgs) && msgs.length) mapped[k] = msgs[0];
        }
        setErrors(mapped);
      }
      toast.error(errMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: Post) => {
    try {
      if (p.status === 'published') await api.unpublish(p.id);
      else await api.publish(p.id);
      toast.success(p.status === 'published' ? 'Moved to draft' : 'Published');
      await refreshList();
    } catch (e) {
      toast.error(errMessage(e));
    }
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    try {
      await api.deletePost(p.id);
      toast.success('Post deleted');
      await refreshList();
    } catch (e) {
      toast.error(errMessage(e));
    }
  };

  if (!authed) {
    return (
      <>
        <LoginScreen onAuthed={() => setAuthed(true)} />
        <ToastStack toasts={toast.toasts} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1a4a68] text-white flex-shrink-0 md:min-h-screen flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">ICHR Newsroom</h2>
          <p className="text-xs text-white/60 mt-1">Content management</p>
        </div>
        <nav className="p-4 flex-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white">
            <LayoutDashboard className="w-5 h-5" /> Posts
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/news" className="block text-sm text-white/70 hover:text-white px-4 py-2">View live newsroom →</a>
          <button onClick={logout} className="w-full flex items-center gap-2 text-white/70 hover:text-white px-4 py-2">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {view === 'list' ? (
          <section className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Posts</h1>
                <p className="text-sm text-slate-500">{posts.length} total</p>
              </div>
              <button
                onClick={openNew}
                className="bg-[#1a4a68] hover:bg-[#133549] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" /> New Post
              </button>
            </div>

            {loadingList ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">No posts yet. Create your first one.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {posts.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4">
                    <img
                      src={resolveAssetUrl(p.coverImageUrl) || '/og-image.png'}
                      alt=""
                      className="w-16 h-16 rounded object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={p.status} />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1">{p.locale}</span>
                        <span className="text-xs font-semibold uppercase text-[#1a4a68]">{p.category}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 truncate">{p.title}</h3>
                      <p className="text-xs text-slate-400">
                        {p.date.slice(0, 10)}{p.location ? ` · ${p.location}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(p)}
                        title={p.status === 'published' ? 'Unpublish' : 'Publish'}
                        className="p-2 rounded hover:bg-slate-100 text-slate-500"
                      >
                        {p.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(p)} title="Edit" className="p-2 rounded hover:bg-slate-100 text-slate-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(p)} title="Delete" className="p-2 rounded hover:bg-red-50 text-[#b91c1c]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Back to list
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => save('draft')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg border border-[#1a4a68] text-[#1a4a68] font-semibold disabled:opacity-50 hover:bg-[#1a4a68]/5 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save draft'}
                </button>
                <button
                  onClick={() => save('published')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#1a4a68] hover:bg-[#133549] text-white font-semibold disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Publish'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <Field label="Title" error={errors.title}>
                  <input value={draft.title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Slug" hint="URL: /news/<slug>" error={errors.slug}>
                  <input value={draft.slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" error={errors.category}>
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as PostCategory }))}
                      className={inputCls}
                    >
                      {POST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Date">
                    <input type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Language" hint="locale of this version">
                    <select
                      value={draft.locale}
                      onChange={(e) => setDraft((d) => ({ ...d, locale: e.target.value }))}
                      className={inputCls}
                    >
                      {LOCALE_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Translation key" hint="links a story's languages">
                    <input
                      value={draft.translationKey ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, translationKey: e.target.value || undefined }))}
                      className={inputCls}
                      placeholder="(auto for new stories)"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Location">
                    <input value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} className={inputCls} placeholder="Geneva" />
                  </Field>
                  <Field label="Author">
                    <input value={draft.authorName ?? ''} onChange={(e) => setDraft((d) => ({ ...d, authorName: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
                <Field label="Excerpt" error={errors.excerpt}>
                  <textarea rows={3} value={draft.excerpt} onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Hashtags" hint="comma-separated">
                  <input value={hashtagText} onChange={(e) => setHashtags(e.target.value)} className={inputCls} placeholder="#human_rights, #sudan" />
                  {draft.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {draft.hashtags.map((t) => (
                        <span key={t} className="text-xs text-[#1a4a68] bg-[#1a4a68]/10 px-2 py-0.5 rounded-full">#{t}</span>
                      ))}
                    </div>
                  )}
                </Field>

                {/* Cover */}
                <Field label="Cover image">
                  <div className="flex items-center gap-4">
                    {draft.coverImageUrl ? (
                      <img src={resolveAssetUrl(draft.coverImageUrl)} alt="" className="w-24 h-16 object-cover rounded border border-slate-200" />
                    ) : (
                      <div className="w-24 h-16 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                    )}
                    <label className="cursor-pointer text-sm font-medium text-[#1a4a68] hover:underline">
                      {coverBusy ? 'Uploading…' : draft.coverImageUrl ? 'Replace' : 'Upload cover'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ''; }}
                      />
                    </label>
                  </div>
                </Field>

                {/* Gallery */}
                <Field label="Gallery" hint="3-up on the article; add captions">
                  <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-[#1a4a68] hover:underline">
                    <UploadCloud className="w-4 h-4" /> {galleryBusy ? 'Uploading…' : 'Add images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.length) uploadGallery(e.target.files); e.target.value = ''; }}
                    />
                  </label>
                  {draft.gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {draft.gallery.map((g, i) => (
                        <div key={i} className="border border-slate-200 rounded p-2">
                          <div className="relative">
                            <img src={resolveAssetUrl(g.url)} alt="" className="w-full h-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => removeGallery(i)}
                              className="absolute -top-2 -right-2 bg-[#b91c1c] text-white rounded-full p-1"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            placeholder="Caption"
                            value={g.caption ?? ''}
                            onChange={(e) => setGalleryCaption(i, e.target.value)}
                            className="w-full text-xs mt-1 border border-slate-200 rounded px-1.5 py-1"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                <Field label="Body (Markdown)" error={errors.body}>
                  <textarea
                    rows={16}
                    value={draft.body}
                    onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                    className={`${inputCls} font-mono text-sm`}
                  />
                </Field>
              </form>

              {/* Live preview */}
              <div className="lg:sticky lg:top-6 self-start">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Live preview</p>
                <article className="bg-white border border-slate-200 rounded-xl p-6 max-h-[80vh] overflow-y-auto">
                  <h1 className="text-2xl font-bold text-[#1a4a68] mb-2">{draft.title || 'Untitled'}</h1>
                  <p className="text-xs text-slate-400 mb-4">
                    {draft.date}{draft.location ? ` · ${draft.location}` : ''}
                  </p>
                  <MarkdownPreview source={draft.body} />
                </article>
              </div>
            </div>
          </section>
        )}
      </main>

      <ToastStack toasts={toast.toasts} />
    </div>
  );
};

const Field: React.FC<{ label: string; hint?: string; error?: string; children: React.ReactNode }> = ({
  label, hint, error, children,
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label}{hint && <span className="font-normal text-slate-400 ml-2">{hint}</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default AdminDashboard;
