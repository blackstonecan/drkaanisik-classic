import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CategoryIcon } from '@/components/ui/iconRegistry'
import services from '@/data/services.json'
import type { ServiceCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const categories = services.categories as ServiceCategory[]

type PopularCategoriesProps = {
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

export function PopularCategories({
  selectedCategory,
  onSelectCategory,
}: PopularCategoriesProps) {
  const { t } = useTranslation('blog')
  const { t: ts } = useTranslation('services')

  return (
    <section aria-labelledby="popular-categories-heading">
      <h2
        id="popular-categories-heading"
        className="text-xs font-semibold uppercase tracking-widest text-trust-700/60"
      >
        {t('ui.popularCategoriesTitle')}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => {
          const selected = selectedCategory === cat.slug
          return (
            <motion.button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(selected ? null : cat.slug)}
              aria-pressed={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={cn(
                'flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500',
                selected
                  ? 'border-trust-700 bg-trust-700 text-paper'
                  : 'border-trust-100 bg-white text-trust-700 hover:border-trust-300',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-xl',
                  selected ? 'bg-white/15 text-paper' : 'bg-trust-50 text-trust-600',
                )}
              >
                <CategoryIcon iconKey={cat.icon} className="h-4 w-4" />
              </span>
              <span>{ts(`${cat.slug}.title`)}</span>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
