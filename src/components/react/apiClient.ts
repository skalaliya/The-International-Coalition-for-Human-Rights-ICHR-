// Browser-side API client for the admin island. Uses same-origin by default
// (dev proxy / single-origin prod). JWT lives in localStorage.
import type { Post, PostInput, PaginatedPosts } from '@/types';

const BASE = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
const TOKEN_KEY = 'ichr_token';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;
  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}
function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function handle(res: Response): Promise<any> {
  if (res.status === 401 || res.status === 403) {
    clearToken();
    throw new ApiError(res.status, 'Your session has expired. Please sign in again.');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    let fieldErrors: Record<string, string[]> | undefined;
    try {
      const body = await res.json();
      if (body?.error) message = String(body.error);
      // zod flatten() → { fieldErrors, formErrors }
      if (body?.details?.fieldErrors) fieldErrors = body.details.fieldErrors;
    } catch {
      /* non-JSON */
    }
    throw new ApiError(res.status, message, fieldErrors);
  }
  if (res.status === 204) return null;
  return res.json();
}

/** Resolve a stored image path for <img src> in the admin UI. */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${BASE}${url}`;
  return url;
}

export const api = {
  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const { token } = (await res.json()) as { token: string };
      setToken(token);
      return true;
    } catch {
      return false;
    }
  },
  logout() {
    clearToken();
  },
  // pageSize is capped at 50 server-side (clampPage in src/server/posts.ts). Asking for
  // 100 didn't fetch 100 — it silently returned the 50 most recently updated posts, and
  // the dashboard showed no sign that older ones existed.
  getAllPosts(page = 1): Promise<PaginatedPosts> {
    return fetch(`${BASE}/api/content/admin/posts?pageSize=50&page=${page}`, {
      headers: authHeaders(),
    }).then(handle);
  },
  createPost(input: PostInput): Promise<Post> {
    return fetch(`${BASE}/api/content/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(input),
    }).then(handle);
  },
  updatePost(id: string, input: PostInput): Promise<Post> {
    return fetch(`${BASE}/api/content/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(input),
    }).then(handle);
  },
  deletePost(id: string): Promise<void> {
    return fetch(`${BASE}/api/content/posts/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle);
  },
  publish(id: string): Promise<Post> {
    return fetch(`${BASE}/api/content/posts/${id}/publish`, { method: 'POST', headers: authHeaders() }).then(handle);
  },
  unpublish(id: string): Promise<Post> {
    return fetch(`${BASE}/api/content/posts/${id}/unpublish`, { method: 'POST', headers: authHeaders() }).then(handle);
  },
  async uploadImage(file: File): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append('image', file); // do NOT set Content-Type — the browser sets the multipart boundary
    return fetch(`${BASE}/api/content/posts/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: fd,
    }).then(handle);
  },
};

export function errMessage(e: unknown): string {
  return e instanceof ApiError ? e.message : 'Something went wrong. Please try again.';
}
