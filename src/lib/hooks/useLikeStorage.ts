import { useSyncExternalStore } from 'react'

const KEY = 'liked-posts'

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]'
  try {
    return window.localStorage.getItem(KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function getServerSnapshot(): string {
  return '[]'
}

function parseLiked(snapshot: string): Set<string> {
  try {
    const arr = JSON.parse(snapshot) as unknown
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === 'string')) : new Set()
  } catch {
    return new Set()
  }
}

function writeLiked(set: Set<string>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    // ignore (privacy mode)
  }
  for (const listener of listeners) listener()
}

/**
 * Like-state for a single post slug, persisted in localStorage.
 * `slug` is the canonical (locale-independent) post slug.
 */
export function useLikeStorage(slug: string) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const set = parseLiked(snapshot)
  const liked = set.has(slug)

  const toggle = () => {
    const next = parseLiked(getSnapshot())
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    writeLiked(next)
  }

  return { liked, toggle }
}

/** Read-only count of currently-liked slugs (across the whole site). */
export function useTotalLikedCount(): number {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return parseLiked(snapshot).size
}
