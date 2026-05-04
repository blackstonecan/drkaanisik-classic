import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { TourPoint } from '@/lib/types'
import { CategoryIcon } from '@/components/ui/iconRegistry'

type TourNavButtonsProps = {
  points: TourPoint[]
  currentSlug: string
  visited: Set<string>
  onNavigate: (slug: string) => void
  disabled?: boolean
}

export function TourNavButtons({
  points,
  currentSlug,
  visited,
  onNavigate,
  disabled = false,
}: TourNavButtonsProps) {
  const { t } = useTranslation('tour')

  const others = points.filter((p) => p.slug !== currentSlug)

  return (
    <nav aria-label={t('ui.navTitle')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 text-[9px] font-medium uppercase tracking-[0.16em] text-paper/60 sm:gap-3 sm:text-[11px] sm:tracking-[0.18em]">
          <span aria-hidden className="h-px w-4 bg-accent-400 sm:w-6" />
          <span className="truncate">{t('ui.progressLabel')}</span>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden>
          {points.map((p) => {
            const isCurrent = p.slug === currentSlug
            const isVisited = visited.has(p.slug)
            return (
              <span
                key={p.slug}
                className={
                  'h-1.5 rounded-full transition-all ' +
                  (isCurrent
                    ? 'w-4 bg-accent-400'
                    : isVisited
                      ? 'w-1.5 bg-paper/55'
                      : 'w-1.5 bg-paper/20')
                }
              />
            )
          })}
        </div>
      </div>

      <ul
        className="mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-4 sm:gap-3 md:snap-none md:gap-4 md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {others.map((point) => {
          const idx = points.findIndex((x) => x.slug === point.slug)
          return (
            <li key={point.slug} className="flex-none snap-start md:flex-1">
              <motion.button
                type="button"
                onClick={() => onNavigate(point.slug)}
                disabled={disabled}
                aria-label={`${t('ui.travelingTo')} ${t(`points.${point.slug}.title`)}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group flex h-full w-full min-w-[150px] items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3 text-left text-paper transition-all hover:-translate-y-0.5 hover:border-accent-400/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[180px] sm:gap-3 sm:p-4 md:min-w-[200px]"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-paper/85 transition-colors group-hover:border-accent-400 group-hover:bg-accent-500 group-hover:text-paper sm:h-10 sm:w-10">
                  <CategoryIcon iconKey={point.icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-medium uppercase tracking-[0.16em] text-paper/45 sm:text-[10px]">
                    {t('ui.stepLabel')} {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-0.5 block truncate font-display text-sm font-medium leading-tight sm:text-base md:text-lg">
                    {t(`points.${point.slug}.title`)}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-paper/40 transition-all group-hover:translate-x-0.5 group-hover:text-accent-400"
                />
              </motion.button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
