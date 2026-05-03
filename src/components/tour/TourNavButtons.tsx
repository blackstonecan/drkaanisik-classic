import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { TourPoint } from '@/lib/types'
import { CategoryIcon } from '@/components/ui/iconRegistry'

type TourNavButtonsProps = {
  points: TourPoint[]
  onNavigate: (slug: string) => void
  disabled?: boolean
}

export function TourNavButtons({
  points,
  onNavigate,
  disabled = false,
}: TourNavButtonsProps) {
  const { t } = useTranslation('tour')

  return (
    <nav aria-label={t('ui.navTitle')}>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/60">
        {t('ui.navTitle')}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-3 overflow-x-auto md:flex-nowrap md:gap-4">
        {points.map((point, index) => (
          <li key={point.slug} className="shrink-0">
            <motion.button
              type="button"
              onClick={() => onNavigate(point.slug)}
              disabled={disabled}
              aria-label={t(`points.${point.slug}.title`)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-paper backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-paper transition-colors group-hover:bg-white/25">
                <CategoryIcon iconKey={point.icon} className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap">
                {t(`points.${point.slug}.title`)}
              </span>
            </motion.button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
