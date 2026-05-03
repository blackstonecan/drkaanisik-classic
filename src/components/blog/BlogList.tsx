import { useTranslation } from 'react-i18next'
import type { BlogPostMeta } from '@/lib/types'
import { BlogCard } from './BlogCard'

type BlogListProps = {
  posts: BlogPostMeta[]
}

export function BlogList({ posts }: BlogListProps) {
  const { t } = useTranslation('blog')

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-trust-200 bg-white px-8 py-16 text-center text-sm text-trust-700/60">
        {t('ui.noResults')}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <BlogCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  )
}
