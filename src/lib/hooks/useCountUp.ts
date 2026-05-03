import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  target: number,
  durationMs = 1500,
) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef<T>(null)
  const reducedMotion = useReducedMotion()
  const startedRef = useRef(false)

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || startedRef.current) continue
          startedRef.current = true
          obs.disconnect()
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs)
            const eased = 1 - Math.pow(1 - t, 3)
            setAnimated(Math.round(target * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, durationMs, reducedMotion])

  const value = reducedMotion ? target : animated
  return { ref, value }
}
