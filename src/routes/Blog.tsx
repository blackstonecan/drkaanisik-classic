import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllPosts } from '@/lib/blog'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { useLocale } from '@/lib/hooks/useLocale'
import { useDocumentMeta } from '@/lib/hooks/useDocumentMeta'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { BlogList } from '@/components/blog/BlogList'
import { PopularCategories } from '@/components/blog/PopularCategories'

const allPosts = getAllPosts()

const allCategories = Array.from(
  new Set(allPosts.flatMap((p) => p.categories)),
)

export default function Blog() {
  const { t, i18n } = useTranslation('blog')
  const locale = useLocale()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const debouncedSearch = useDebouncedValue(search, 200)

  useDocumentMeta({
    title: t('ui.title'),
    description: t('ui.lede'),
  })

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return allPosts.filter((post) => {
      if (category && !post.categories.includes(category)) return false
      if (!q) return true
      const title = i18n.t(`posts.${post.slug}.title`, {
        ns: 'blog',
        defaultValue: '',
      }) as string
      const excerpt = i18n.t(`posts.${post.slug}.excerpt`, {
        ns: 'blog',
        defaultValue: '',
      }) as string
      return (
        title.toLowerCase().includes(q) ||
        excerpt.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q)
      )
    })
  }, [debouncedSearch, category, i18n])

  return (
    <>
      <header className="bg-trust-700 py-16 text-paper md:py-24">
        <div className="container-page">
          <h1 className="font-display text-4xl font-semibold md:text-5xl">
            {t('ui.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-paper/80">{t('ui.lede')}</p>
        </div>
      </header>

      <div className="container-page space-y-10 py-12 md:py-16">
        <PopularCategories
          selectedCategory={category}
          onSelectCategory={setCategory}
        />

        <BlogFilters
          searchValue={search}
          onSearchChange={setSearch}
          selectedCategory={category}
          onSelectCategory={setCategory}
          categories={allCategories}
        />

        <div>
          <p
            className="mb-6 text-xs uppercase tracking-widest text-trust-700/60"
            aria-live="polite"
          >
            {t('ui.showingResults', { count: filtered.length })}
          </p>
          <BlogList posts={filtered} />
        </div>
      </div>

      {/* Locale used by aria-live announcer indirectly via formatDate inside cards */}
      <span hidden aria-hidden>
        {locale}
      </span>
    </>
  )
}
