import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the element matching `location.hash` whenever the route or hash
 * changes. Polls briefly so it works after lazy-loaded routes mount.
 * When there's no hash, scrolls to the top on path change.
 */
export function useHashScroll() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    if (!id) return

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

    let cancelled = false
    let attempts = 0
    const maxAttempts = 30 // ~1s at 16ms intervals

    const tryScroll = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior, block: 'start' })
        return
      }
      if (++attempts < maxAttempts) {
        window.requestAnimationFrame(tryScroll)
      }
    }

    tryScroll()

    return () => {
      cancelled = true
    }
  }, [pathname, hash, key])
}
