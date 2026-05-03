import blogsData from '@/data/blogs.json'
import type { BlogPostMeta } from '@/lib/types'
import type { Locale } from '@/lib/i18n'

const posts = blogsData.posts as BlogPostMeta[]

export function getAllPosts(): BlogPostMeta[] {
  return posts
}

export function findPostByCanonicalSlug(slug: string): BlogPostMeta | undefined {
  return posts.find((p) => p.slug === slug)
}

export function findPostByLocaleSlug(slug: string, locale: Locale): BlogPostMeta | undefined {
  return posts.find((p) => p.slugByLocale[locale] === slug)
}

export function translateBlogSlug(
  slug: string,
  fromLocale: Locale,
  toLocale: Locale,
): string | null {
  const post = findPostByLocaleSlug(slug, fromLocale)
  return post ? post.slugByLocale[toLocale] : null
}
