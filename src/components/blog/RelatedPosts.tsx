import { useTranslation } from 'react-i18next'
import type { BlogPostMeta } from '@/lib/types'
import { BlogCard } from './BlogCard'

type RelatedPostsProps = {
  current: BlogPostMeta
  all: BlogPostMeta[]
  max?: number
}

export function RelatedPosts({ current, all, max = 3 }: RelatedPostsProps) {
  const { t } = useTranslation('blog')

  const currentCategories = new Set(current.categories)
  const related = all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const overlap = p.categories.filter((c) => currentCategories.has(c)).length
      return { post: p, overlap }
    })
    .filter((x) => x.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap
      return Date.parse(b.post.publishedAt) - Date.parse(a.post.publishedAt)
    })
    .slice(0, max)
    .map((x) => x.post)

  if (related.length === 0) return null

  return (
    <section className="container-page py-16 md:py-20" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="font-display text-2xl font-semibold text-trust-700 md:text-3xl"
      >
        {t('ui.relatedTitle')}
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {related.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  )
}
