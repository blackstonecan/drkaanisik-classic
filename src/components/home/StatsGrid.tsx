import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import statsData from '@/data/stats.json'
import type { Stat } from '@/lib/types'
import { useCountUp } from '@/lib/hooks/useCountUp'

const stats = statsData.items as Stat[]

export function StatsGrid() {
  const { t } = useTranslation('home')

  return (
    <section aria-labelledby="stats-heading" className="rounded-3xl bg-trust-700 p-8 md:p-12">
      <h2
        id="stats-heading"
        className="font-display text-2xl font-semibold text-paper md:text-3xl"
      >
        {t('stats.heading')}
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCell key={stat.slug} stat={stat} index={i} />
        ))}
      </div>
    </section>
  )
}

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const { t } = useTranslation('home')
  const target = stat.numericValue ?? 0
  const { ref, value } = useCountUp<HTMLDivElement>(target)
  const suffix = stat.suffix ?? ''
  const display = stat.numericValue != null ? `${value}${suffix}` : stat.value

  const label = t(`stats.items.${stat.slug}.label`)
  const sublabel = t(`stats.items.${stat.slug}.sublabel`, { defaultValue: '' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div
        ref={ref}
        className="font-display text-4xl font-semibold text-paper md:text-5xl"
      >
        {display}
      </div>
      <div className="mt-2 text-xs uppercase tracking-widest text-paper/70">
        {label}
      </div>
      {sublabel && (
        <div className="mt-1 text-xs text-paper/50">{sublabel}</div>
      )}
    </motion.div>
  )
}
