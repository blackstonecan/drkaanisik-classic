import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

type BlogFiltersProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
  categories: string[]
}

export function BlogFilters({
  searchValue,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
}: BlogFiltersProps) {
  const { t } = useTranslation('blog')
  const { t: ts } = useTranslation('services')

  return (
    <section
      aria-label={t('ui.filtersTitle')}
      className="rounded-3xl bg-white p-5 ring-1 ring-trust-100 md:p-6"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-trust-700/40"
            aria-hidden
          />
          <label className="sr-only" htmlFor="blog-search">
            {t('ui.searchPlaceholder')}
          </label>
          <input
            id="blog-search"
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('ui.searchPlaceholder')}
            className="w-full rounded-2xl border border-trust-200 bg-paper py-2.5 pl-11 pr-4 text-sm text-trust-900 placeholder:text-trust-700/40 focus-visible:border-trust-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500/20"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip
          label={t('ui.filtersAllCategories')}
          selected={selectedCategory === null}
          onClick={() => onSelectCategory(null)}
        />
        {categories.map((slug) => (
          <FilterChip
            key={slug}
            label={ts(`${slug}.title`, { defaultValue: slug })}
            selected={selectedCategory === slug}
            onClick={() => onSelectCategory(slug)}
          />
        ))}
      </div>
    </section>
  )
}

type FilterChipProps = {
  label: string
  selected: boolean
  onClick: () => void
}

function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500',
        selected
          ? 'border-trust-700 bg-trust-700 text-paper'
          : 'border-trust-200 bg-paper text-trust-700 hover:border-trust-400',
      )}
    >
      {label}
    </button>
  )
}
