import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import doctor from '@/data/doctor.json'
import { Button } from '@/components/ui/Button'
import { useLocale, localePath } from '@/lib/hooks/useLocale'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

type HeroVideoProps = {
  paused?: boolean
}

export function HeroVideo({ paused = false }: HeroVideoProps) {
  const { t } = useTranslation('home')
  const locale = useLocale()
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (paused || reducedMotion) {
      v.pause()
    } else {
      v.play().catch(() => {
        /* autoplay can be blocked; poster will show */
      })
    }
  }, [paused, reducedMotion])

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden"
    >
      {!reducedMotion ? (
        <video
          ref={videoRef}
          src={doctor.images.heroVideo}
          poster={doctor.images.heroVideoPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <img
          src={doctor.images.heroVideoPoster}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-trust-950/85 via-trust-900/65 to-trust-700/30"
      />
      <div className="container-page py-24 text-paper md:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] md:text-6xl"
        >
          {t('hero.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-6 max-w-xl text-base text-paper/85 md:text-lg"
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Button as="a" href="#contact" size="lg">
            {t('hero.cta')}
          </Button>
          <Link
            to={localePath(locale, '/clinic-tour')}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-paper/40 bg-transparent px-7 text-base font-medium text-paper transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-trust-900"
          >
            {t('hero.secondaryCta')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
