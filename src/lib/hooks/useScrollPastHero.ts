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
    if (!enabled) return
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setPast(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId, enabled])

  return past
}
