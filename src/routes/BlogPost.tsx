import { Suspense, useMemo, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react'
import { findPostByLocaleSlug, getAllPosts } from '@/lib/blog'
import { getMdxComponent } from '@/lib/blogContent'
import { useLocale, localePath } from '@/lib/hooks/useLocale'
import { useDocumentMeta } from '@/lib/hooks/useDocumentMeta'
import { formatDate } from '@/lib/utils'
import { LikeButton } from '@/components/blog/LikeButton'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

const allPosts = getAllPosts()

export default function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { t } = useTranslation('blog')
  const { t: tc } = useTranslation('common')
  const { t: ts } = useTranslation('services')
  const locale = useLocale()
  const articleRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start start', 'end end'],
  })
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  const post = findPostByLocaleSlug(slug, locale)
  const MdxBody = useMemo(
    () => (post ? getMdxComponent(post.slug, locale) : null),
    [post, locale],
  )

  const title = post ? t(`posts.${post.slug}.title`) : tc('notFound.title')
  const excerpt = post
    ? (t(`posts.${post.slug}.excerpt`) as string)
    : tc('notFound.description')

  useDocumentMeta({
    title,
    description: excerpt,
    ogImage: post?.image,
  })

  if (!post) {
    return <Navigate to={localePath(locale, '/blog')} replace />
  }

  const blogIndex = localePath(locale, '/blog')
  const imageAlt = t(`posts.${post.slug}.imageAlt`, { defaultValue: '' })
  const readingTime = t(`posts.${post.slug}.readingTime`, { defaultValue: 5 })

  return (
    <article ref={articleRef}>
      <motion.div
        aria-hidden
        style={{ scaleX: progressScaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent-500"
      />
      <header className="relative isolate overflow-hidden bg-trust-900">
        <img
          src={post.image}
          alt={imageAlt}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-trust-950/70 via-trust-900/70 to-trust-900"
        />
        <div className="container-prose py-12 text-paper sm:py-16 md:py-24">
          <Link
            to={blogIndex}
            className="inline-flex items-center gap-2 text-sm text-paper/80 transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {tc('actions.back')}
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-paper/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur"
              >
                {ts(`${cat}.title`, { defaultValue: cat })}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
            {title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/75">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden />
              {t('ui.publishedOn', {
                date: formatDate(post.publishedAt, locale),
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {t('ui.readingTime', { minutes: readingTime })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden />
              {(post.viewCount + 1).toLocaleString(locale)}{' '}
              {t('ui.viewsLabel')}
            </span>
          </div>
        </div>
      </header>

      <div className="container-prose py-12 md:py-16">
        <div className="prose prose-trust max-w-none prose-headings:font-display prose-headings:text-trust-700 prose-a:text-trust-600 prose-strong:text-trust-800">
          {MdxBody ? (
            <Suspense
              fallback={
                <div className="text-sm text-trust-700/60">
                  {tc('loading')}
                </div>
              }
            >
              {/* eslint-disable-next-line react-hooks/static-components */}
              <MdxBody />
            </Suspense>
          ) : (
            <p className="text-sm text-trust-700/70">{tc('loading')}</p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-trust-100 pt-6">
          <Link
            to={blogIndex}
            className="inline-flex items-center gap-2 text-sm font-medium text-trust-700 hover:text-trust-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {tc('actions.back')}
          </Link>
          <LikeButton slug={post.slug} baseCount={post.likeCount} />
        </div>
      </div>

      <RelatedPosts current={post} all={allPosts} />
    </article>
  )
}
