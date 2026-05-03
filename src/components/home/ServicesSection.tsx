import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import services from '@/data/services.json'
import type { ServiceCategory } from '@/lib/types'
import { CategoryIcon } from '@/components/ui/iconRegistry'

const categories = services.categories as ServiceCategory[]

export function ServicesSection() {
  const { t } = useTranslation('home')

  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-trust-700 md:text-4xl">
            {t('services.heading')}
          </h2>
          <p className="mt-4 text-trust-700/70">{t('services.lede')}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <ServiceCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  category,
  index,
}: {
  category: ServiceCategory
  index: number
}) {
  const { t } = useTranslation('services')
  const { t: th } = useTranslation('home')

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex h-full flex-col rounded-3xl bg-paper p-6 ring-1 ring-trust-100 transition-colors hover:ring-trust-200"
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-trust-50 text-trust-600">
        <CategoryIcon iconKey={category.icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-trust-700">
        {t(`${category.slug}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-trust-700/70">
        {t(`${category.slug}.shortDescription`)}
      </p>
      <div className="mt-5 border-t border-trust-100 pt-4">
        <h4 className="text-xs uppercase tracking-widest text-trust-700/60">
          {th('services.viewProcedures')}
        </h4>
        <ul className="mt-3 space-y-2">
          {category.procedures.map((proc) => (
            <li
              key={proc.slug}
              className="flex items-start gap-2 text-sm text-trust-800/85"
            >
              {proc.featured ? (
                <Star
                  className="mt-1 h-3.5 w-3.5 shrink-0 fill-accent-400 text-accent-400"
                  aria-hidden
                />
              ) : (
                <span className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
              <span>{t(`${category.slug}.procedures.${proc.slug}.title`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}
