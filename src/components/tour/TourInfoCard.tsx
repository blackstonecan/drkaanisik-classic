import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TourPoint } from '@/lib/types'
import { CategoryIcon } from '@/components/ui/iconRegistry'
import { cn } from '@/lib/utils'

type TourInfoCardProps = {
  point: TourPoint
  index: number
  total: number
  variant?: 'default' | 'collapsible'
}

// Caller resets the peek state on point change by passing key={point.slug}.
export function TourInfoCard({
  point,
  index,
  total,
  variant = 'default',
}: TourInfoCardProps) {
  const { t } = useTranslation('tour')
  const collapsible = variant === 'collapsible'
  const [open, setOpen] = useState(false)

  const stepLabel = `${t('ui.stepLabel')} ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  if (!collapsible) {
    return (
      <div className="rounded-2xl bg-paper/95 p-5 shadow-xl ring-1 ring-trust-100 backdrop-blur sm:p-6 md:p-7">
        <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-600">
          <span aria-hidden className="h-px w-6 bg-accent-600" />
          <span>{stepLabel}</span>
        </div>
        <div className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
          <CategoryIcon iconKey={point.icon} className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-trust-700 md:text-3xl">
          {t(`points.${point.slug}.title`)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-trust-800/85">
          {t(`points.${point.slug}.description`)}
        </p>
      </div>
    )
  }

  // Collapsible variant: a compact peek bar that expands to reveal the
  // description. Keeps the scene visible on small viewports.
  return (
    <div className="overflow-hidden rounded-2xl bg-paper/85 shadow-xl ring-1 ring-trust-100 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`tour-info-${point.slug}-details`}
        className="flex w-full items-center gap-3 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
          <CategoryIcon iconKey={point.icon} className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-accent-600">
            {stepLabel}
          </span>
          <span className="mt-0.5 block truncate font-display text-base font-semibold text-trust-700">
            {t(`points.${point.slug}.title`)}
          </span>
        </span>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-trust-50 text-trust-700/70">
          <ChevronDown
            aria-hidden
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              open && 'rotate-180',
            )}
          />
        </span>
        <span className="sr-only">
          {open ? t('ui.collapseDetails') : t('ui.expandDetails')}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            id={`tour-info-${point.slug}-details`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-trust-800/85">
              {t(`points.${point.slug}.description`)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
