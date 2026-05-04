import { useEffect, useState } from 'react'

/**
 * Returns true once the page has scrolled past the element with id `targetId`.
 * The caller decides whether observation should run (e.g., only on routes that
 * actually have a hero); when `enabled` is false the hook returns its default
 * `false` so the caller can compose with its own "force solid" logic.
 */
export function useScrollPastHero(targetId: string = 'hero', enabled: boolean = true): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setPast(false)
      return
    }

    let intersectionObserver: IntersectionObserver | null = null
    let mutationObserver: MutationObserver | null = null

    const attach = (target: Element) => {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          setPast(!entry.isIntersecting)
        },
        { threshold: 0, rootMargin: '-64px 0px 0px 0px' },
      )
      intersectionObserver.observe(target)
    }

    const initial = document.getElementById(targetId)
    if (initial) {
      attach(initial)
    } else {
      // Hero may not be in the DOM yet (e.g., lazy-loaded route still suspended
      // on a hard refresh). Watch for it to appear, then attach.
      mutationObserver = new MutationObserver(() => {
        const found = document.getElementById(targetId)
        if (found) {
          mutationObserver?.disconnect()
          mutationObserver = null
          attach(found)
        }
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      intersectionObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [targetId, enabled])

  return past
}
