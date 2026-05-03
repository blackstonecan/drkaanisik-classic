import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import tourData from '@/data/tour.json'
import type { TourPoint, TourTransition } from '@/lib/types'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { TourInfoCard } from './TourInfoCard'
import { TourNavButtons } from './TourNavButtons'

const points = tourData.points as TourPoint[]
const transitions = tourData.transitions as TourTransition[]

const findPoint = (slug: string): TourPoint =>
  points.find((p) => p.slug === slug) ?? points[0]

const findTransition = (
  from: string,
  to: string,
): TourTransition | undefined =>
  transitions.find((t) => t.from === from && t.to === to)

const CROSSFADE_MS = 600
const VIDEO_SAFETY_TIMEOUT_MS = 8000

type Phase = 'idle' | 'video' | 'crossfade'

export function TourStage() {
  const { t } = useTranslation('tour')
  const reducedMotion = useReducedMotion()

  const [current, setCurrent] = useState<string>(points[0].slug)
  const [pending, setPending] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [videoLoading, setVideoLoading] = useState(false)

  const currentPoint = findPoint(current)
  const pendingPoint = pending ? findPoint(pending) : null

  const transitionVideo = useMemo(() => {
    if (!pending) return null
    return findTransition(current, pending)?.video ?? null
  }, [current, pending])

  const finishTransition = useCallback(() => {
    setCurrent((curr) => pending ?? curr)
    setPending(null)
    setVideoLoading(false)
    setPhase('idle')
  }, [pending])

  const navigateTo = useCallback(
    (target: string) => {
      if (target === current || phase !== 'idle') return
      const transition = findTransition(current, target)
      const useVideo = !!transition && !reducedMotion
      setPending(target)
      if (useVideo) {
        setVideoLoading(true)
        setPhase('video')
      } else {
        if (!transition && !reducedMotion) {
          // Spec: log a warning when a transition video is missing.
          console.warn(
            `[ClinicTour] No transition video for ${current} → ${target}; using crossfade.`,
          )
        }
        setPhase('crossfade')
      }
    },
    [current, phase, reducedMotion],
  )

  // Crossfade phase: auto-complete after fade duration.
  useEffect(() => {
    if (phase !== 'crossfade') return
    const timer = window.setTimeout(finishTransition, CROSSFADE_MS)
    return () => window.clearTimeout(timer)
  }, [phase, finishTransition])

  // Video phase safety net: if the source never loads or never ends,
  // fall back to crossfade.
  useEffect(() => {
    if (phase !== 'video') return
    const timer = window.setTimeout(() => {
      setVideoLoading(false)
      setPhase('crossfade')
    }, VIDEO_SAFETY_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [phase, pending])

  return (
    <div className="overflow-hidden rounded-3xl bg-trust-900 ring-1 ring-trust-800 shadow-2xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <AnimatePresence>
          {phase === 'video' && transitionVideo ? (
            <motion.video
              key={`video-${current}-${pending}`}
              src={transitionVideo}
              autoPlay
              muted
              playsInline
              preload="auto"
              onCanPlay={() => setVideoLoading(false)}
              onPlaying={() => setVideoLoading(false)}
              onEnded={finishTransition}
              onError={() => {
                setVideoLoading(false)
                setPhase('crossfade')
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
          ) : (
            <motion.img
              key={`img-${
                phase === 'crossfade' && pendingPoint ? pendingPoint.slug : current
              }`}
              src={
                phase === 'crossfade' && pendingPoint
                  ? pendingPoint.image
                  : currentPoint.image
              }
              alt=""
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-trust-950/30 via-transparent to-trust-950/70"
        />

        {videoLoading && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 flex items-center justify-center bg-trust-950/40 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3 text-paper">
              <span
                aria-hidden
                className="h-8 w-8 animate-spin rounded-full border-2 border-paper/30 border-t-paper"
              />
              <span className="text-xs uppercase tracking-widest text-paper/80">
                {t('ui.loadingTransition')}
              </span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              key={`info-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute left-4 top-4 max-w-md md:left-8 md:top-8"
            >
              <TourInfoCard slug={current} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-trust-700 p-5 md:p-7">
        <TourNavButtons
          points={points.filter((p) => p.slug !== current)}
          onNavigate={navigateTo}
          disabled={phase !== 'idle'}
        />
      </div>
    </div>
  )
}
