// Keeps an in-progress admin draft alive across a session expiry.
//
// The admin token lasts 2 hours and there is no refresh. Before this, writing a long
// statement and hitting Save after the token expired showed "Your session has expired",
// cleared the token, and left the editor mounted — so every retry went out
// unauthenticated and the text was unrecoverable without a reload that discarded it.
//
// The draft is stashed in sessionStorage (not localStorage: it should not outlive the
// tab) and restored after signing back in.
//
// Storage is injected so this is testable without a browser, and every function is
// total — a full disk, private-mode quota errors, or hand-edited JSON must never take
// down the editor on top of an expired session.

export const DRAFT_STASH_KEY = 'ichr.admin.pendingDraft';

export interface StashedDraft<T = unknown> {
  /** Post id being edited, or null for a new post. */
  editingId: string | null;
  draft: T;
  /** Epoch ms, so a stale stash can be ignored. */
  savedAt: number;
}

/** Anything shaped like sessionStorage. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Stashes are only worth restoring for as long as someone is plausibly still working. */
export const STASH_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function stashDraft<T>(
  storage: StorageLike | null | undefined,
  draft: T,
  editingId: string | null,
  now: number = Date.now(),
): boolean {
  if (!storage) return false;
  try {
    const payload: StashedDraft<T> = { editingId, draft, savedAt: now };
    storage.setItem(DRAFT_STASH_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // Quota exceeded, private mode, storage disabled — losing the stash is bad, but
    // throwing here would break the sign-in screen too.
    return false;
  }
}

/** Reads and CLEARS the stash. Returns null when there is nothing usable. */
export function takeStashedDraft<T>(
  storage: StorageLike | null | undefined,
  now: number = Date.now(),
  maxAgeMs: number = STASH_MAX_AGE_MS,
): StashedDraft<T> | null {
  if (!storage) return null;
  let raw: string | null = null;
  try {
    raw = storage.getItem(DRAFT_STASH_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  clearStashedDraft(storage);

  try {
    const parsed = JSON.parse(raw) as Partial<StashedDraft<T>>;
    if (!parsed || typeof parsed !== 'object' || parsed.draft == null) return null;
    if (typeof parsed.savedAt !== 'number' || !Number.isFinite(parsed.savedAt)) return null;
    if (now - parsed.savedAt > maxAgeMs || parsed.savedAt > now + 60_000) return null;
    return {
      editingId: typeof parsed.editingId === 'string' ? parsed.editingId : null,
      draft: parsed.draft as T,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

export function clearStashedDraft(storage: StorageLike | null | undefined): void {
  if (!storage) return;
  try {
    storage.removeItem(DRAFT_STASH_KEY);
  } catch {
    /* nothing useful to do */
  }
}
