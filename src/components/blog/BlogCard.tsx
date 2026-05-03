import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Eye, Heart, Clock } from 'lucide-react'
import type { BlogPostMeta } from '@/lib/types'
import { useLocale, localePath } from '@/lib/hooks/useLocale'
import { formatDate } from '@/lib/utils'
import { useLikeStorage } from '@/lib/hooks/useLikeStorage'
import { cn } from '@/lib/utils'

type BlogCardProps = {
  post: BlogPostMeta
  index?: number
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const { t } = useTranslation('blog')
  const locale = useLocale()
  const { liked } = useLikeStorage(post.slug)

  const localeSlug = post.slugByLocale[locale] ?? post.slug
  const href = localePath(locale, `/blog/${localeSlug}`)
  const title = t(`posts.${post.slug}.title`)
  const excerpt = t(`posts.${post.slug}.excerpt`)
  const imageAlt = t(`posts.${post.slug}.imageAlt`, { defaultValue: '' })
  const readingTime = t(`posts.${post.slug}.readingTime`, { defaultValue: 5 })
  const category = post.categories[0]
  const categoryLabel = useTranslation('services').t(`${category}.title`, {
    defaultValue: category,
  })

  const likeBoost = liked ? 1 : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.32) }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-trust-100 transition-all hover:-translate-y-0.5 hover:ring-trust-200"
    >
      <Link to={href} className="block focus-visible:outline-none">
        <div className="relative aspect-[16/10] overflow-hidden bg-trust-100">
          <img
            src={post.image}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-trust-700 backdrop-blur">
            {categoryLabel}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-xs text-trust-700/60">
          <span>{formatDate(post.publishedAt, locale)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {t('ui.readingTime', { minutes: readingTime })}
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-trust-700">
          <Link
            to={href}
            className="transition-colors hover:text-trust-600 focus-visible:outline-none focus-visible:underline"
          >
            {title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-trust-700/70">{excerpt}</p>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-trust-700/60">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {(post.viewCount + 1).toLocaleString(locale)}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5',
              liked && 'text-accent-600',
            )}
          >
            <Heart
              className={cn('h-3.5 w-3.5', liked && 'fill-accent-500 text-accent-500')}
              aria-hidden
            />
            {(post.likeCount + likeBoost).toLocaleString(locale)}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
