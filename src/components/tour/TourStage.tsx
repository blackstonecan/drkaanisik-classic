import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import tourData from '@/data/tour.json'
import type { TourPoint, TourData } from '@/lib/types'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import { TourInfoCard } from './TourInfoCard'
import { TourNavButtons } from './TourNavButtons'

const data = tourData as TourData
const points = data.points
const corridorImage = data.corridorImage

const findPoint = (slug: string): TourPoint =>
  points.find((p) => p.slug === slug) ?? points[0]

const STILL_FADE_MS = 700
const VIDEO_SAFETY_TIMEOUT_MS = 8000

type Phase = 'idle' | 'leg1' | 'leg2'

export function TourStage() {
  const { t } = useTranslation('tour')
  const reducedMotion = useReducedMotion()

  const [current, setCurrent] = useState<string>(points[0].slug)
  const [pending, setPending] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [visited, setVisited] = useState<Set<string>>(
    () => new Set([points[0].slug]),
  )
  const [videoLoading, setVideoLoading] = useState(false)

  const currentPoint = findPoint(current)
  const pendingPoint = pending ? findPoint(pending) : null
  const currentIndex = points.findIndex((p) => p.slug === current)

  const finishTransition = useCallback(() => {
    if (!pending) return
    setCurrent(pending)
    setVisited((prev) => new Set([...prev, pending]))
    setPending(null)
    setPhase('idle')
    setVideoLoading(false)
  }, [pending])

  const advanceToLeg2 = useCallback(() => {
    setPhase('leg2')
  }, [])

  const navigateTo = useCallback(
    (target: string) => {
      if (target === current || phase !== 'idle') return
      setPending(target)
      if (reducedMotion) {
        // Reduced motion: skip the corridor walk entirely.
        setCurrent(target)
        setVisited((prev) => new Set([...prev, target]))
        setPending(null)
        setPhase('idle')
        return
      }
      setVideoLoading(true)
      setPhase('leg1')
    },
    [current, phase, reducedMotion],
  )

  // Leg fallback: if a leg has no video, crossfade still images for STILL_FADE_MS.
  useEffect(() => {
    if (phase === 'idle' || !pendingPoint) return
    const legSrc =
      phase === 'leg1' ? currentPoint.exitVideo : pendingPoint.enterVideo
    if (legSrc) return
    const timer = window.setTimeout(
      () => (phase === 'leg1' ? advanceToLeg2() : finishTransition()),
      STILL_FADE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [phase, pendingPoint, currentPoint, advanceToLeg2, finishTransition])

  // Safety net: if a leg's video never fires onCanPlay or onEnded, force-advance.
  useEffect(() => {
    if (phase === 'idle') return
    const timer = window.setTimeout(() => {
      setVideoLoading(false)
      if (phase === 'leg1') advanceToLeg2()
      else finishTransition()
    }, VIDEO_SAFETY_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [phase, advanceToLeg2, finishTransition])

  const isTransitioning = phase !== 'idle'
  const legVideo =
    phase === 'leg1'
      ? currentPoint.exitVideo
      : phase === 'leg2'
        ? pendingPoint?.enterVideo
        : undefined
  const legFadeFrom =
    phase === 'leg1' ? currentPoint.image : corridorImage
  const legFadeTo =
    phase === 'leg1' ? corridorImage : pendingPoint?.image ?? currentPoint.image

  return (
    <div className="overflow-hidden rounded-3xl bg-trust-900 ring-1 ring-trust-800 shadow-2xl">
      {/* Stage area: mobile docks UI at the bottom over a viewport-tall scene; desktop uses a framed aspect ratio with overlay UI. */}
      <div className="relative flex w-full flex-col justify-end overflow-hidden min-h-[clamp(460px,72dvh,720px)] md:block md:min-h-0 md:aspect-video">
        <AnimatePresence mode="popLayout">
          {!isTransitioning ? (
            <motion.img
              key={`scene-${current}`}
              src={currentPoint.image}
              alt=""
              aria-hidden
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : legVideo ? (
            <motion.video
              key={`video-${phase}-${pending}`}
              src={legVideo}
              autoPlay
              muted
              playsInline
              preload="auto"
              onCanPlay={() => setVideoLoading(false)}
              onPlaying={() => setVideoLoading(false)}
              onEnded={phase === 'leg1' ? advanceToLeg2 : finishTransition}
              onError={() =>
                phase === 'leg1' ? advanceToLeg2() : finishTransition()
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 h-full w-full bg-black object-cover"
              aria-hidden
            />
          ) : (
            <motion.div
              key={`fade-${phase}-${pending}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
              aria-hidden
            >
              <img
                src={legFadeFrom}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ animation: 'tourFadeOut 700ms ease forwards' }}
              />
              <img
                src={legFadeTo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ animation: 'tourFadeIn 700ms ease forwards' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-trust-950/30 via-transparent to-trust-950/85 md:to-trust-950/70"
        />

        {/* REC label during transition */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              key="rec"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-paper/85 md:left-6 md:top-6"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
              {t('ui.transitionTag')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Walking-to caption: centered on mobile (above the docked card), bottom-anchored on desktop. */}
        <AnimatePresence>
          {isTransitioning && pendingPoint && (
            <motion.div
              key="caption"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 top-[38%] z-20 inline-flex max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-white/15 bg-black/55 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-paper md:top-auto md:bottom-10 md:translate-y-0 md:text-[11px]"
            >
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent-500" />
              <span className="truncate">
                {t('ui.travelingTo')} · {t(`points.${pendingPoint.slug}.title`)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {videoLoading && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-30 flex items-center justify-center bg-trust-950/40 backdrop-blur-sm"
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

        {/* Desktop: floating overlay info card, top-left of the framed stage. */}
        <AnimatePresence>
          {!isTransitioning && (
            <motion.div
              key={`info-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute left-8 top-8 z-10 hidden max-w-md md:block"
            >
              <TourInfoCard
                point={currentPoint}
                index={currentIndex}
                total={points.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: docked info card at the bottom of the stage, dims during transition without unmounting (prevents layout collapse). */}
        <div
          aria-hidden={isTransitioning}
          className={cn(
            'relative z-10 m-3 transition-all duration-300 ease-out sm:m-4 md:hidden',
            isTransitioning
              ? 'pointer-events-none translate-y-1 opacity-0'
              : 'translate-y-0 opacity-100',
          )}
        >
          <TourInfoCard
            key={currentPoint.slug}
            point={currentPoint}
            index={currentIndex}
            total={points.length}
            variant="collapsible"
          />
        </div>
      </div>

      <div className="bg-trust-700 p-4 sm:p-5 md:p-7">
        <TourNavButtons
          points={points}
          currentSlug={current}
          visited={visited}
          onNavigate={navigateTo}
          disabled={isTransitioning}
        />
      </div>
    </div>
  )
}
