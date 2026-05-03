import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { Locale } from './i18n'

type MdxModule = { default: ComponentType }

const modules = import.meta.glob<MdxModule>(
  '/src/content/blog/(tr|en|de)/*.mdx',
)

// Build the registry once at module init so each (locale, slug) pair maps
// to a stable lazy component reference. Calling `lazy()` per-render would
// reset Suspense state and trip react-hooks/static-components.
const REGISTRY: Record<string, LazyExoticComponent<ComponentType>> = {}
for (const [path, loader] of Object.entries(modules)) {
  const match = path.match(/\/blog\/([a-z]{2})\/([^/]+)\.mdx$/)
  if (!match) continue
  const [, locale, slug] = match
  REGISTRY[`${locale}:${slug}`] = lazy(loader)
}

/**
 * Stable lazy component for the MDX file at
 * `src/content/blog/{locale}/{canonicalSlug}.mdx`, or null if it doesn't
 * exist for that locale.
 */
export function getMdxComponent(
  slug: string,
  locale: Locale,
): LazyExoticComponent<ComponentType> | null {
  return REGISTRY[`${locale}:${slug}`] ?? null
}
