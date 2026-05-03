import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from '@/lib/i18n'
import { useLocale } from './useLocale'

const SITE_URL = 'https://drkaanisik.com'
const SITE_NAME = 'Op. Dr. Kaan Işık'

type Meta = {
  title: string
  description: string
  ogImage?: string
  /** When true, the page title will not be suffixed with the site name. */
  rawTitle?: boolean
  /** Optional JSON-LD structured data injected as <script type="application/ld+json">. */
  structuredData?: object
}

const STRUCTURED_DATA_ID = 'app-jsonld'

function setMetaTag(
  key: string,
  content: string,
  attr: 'name' | 'property' = 'name',
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function stripLocalePrefix(pathname: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return pathname || '/'
  const prefix = `/${locale}`
  if (pathname === prefix) return '/'
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length)
  return pathname || '/'
}

function buildLocalePath(target: Locale, basePath: string): string {
  const clean = basePath.startsWith('/') ? basePath : `/${basePath}`
  if (target === DEFAULT_LOCALE) return clean
  return clean === '/' ? `/${target}` : `/${target}${clean}`
}

export function useDocumentMeta({
  title,
  description,
  ogImage,
  rawTitle,
  structuredData,
}: Meta) {
  const location = useLocation()
  const currentLocale = useLocale()

  useEffect(() => {
    const fullTitle = rawTitle ? title : `${title} — ${SITE_NAME}`
    document.title = fullTitle

    setMetaTag('description', description)
    setMetaTag('og:type', 'website', 'property')
    setMetaTag('og:site_name', SITE_NAME, 'property')
    setMetaTag('og:title', fullTitle, 'property')
    setMetaTag('og:description', description, 'property')
    setMetaTag('og:locale', currentLocale, 'property')
    if (ogImage) setMetaTag('og:image', ogImage, 'property')
    setMetaTag('twitter:card', ogImage ? 'summary_large_image' : 'summary')

    // Rebuild hreflang links for every render (cheap; small DOM ops).
    document.head
      .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove())

    const basePath = stripLocalePrefix(location.pathname, currentLocale)
    SUPPORTED_LOCALES.forEach((loc) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = loc
      link.href = SITE_URL + buildLocalePath(loc, basePath)
      document.head.appendChild(link)
    })
    const xDefault = document.createElement('link')
    xDefault.rel = 'alternate'
    xDefault.hreflang = 'x-default'
    xDefault.href = SITE_URL + buildLocalePath(DEFAULT_LOCALE, basePath)
    document.head.appendChild(xDefault)

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = SITE_URL + location.pathname

    let scriptEl = document.getElementById(
      STRUCTURED_DATA_ID,
    ) as HTMLScriptElement | null
    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.id = STRUCTURED_DATA_ID
        scriptEl.type = 'application/ld+json'
        document.head.appendChild(scriptEl)
      }
      scriptEl.textContent = JSON.stringify(structuredData)
    } else if (scriptEl) {
      scriptEl.remove()
    }
  }, [
    title,
    description,
    ogImage,
    rawTitle,
    structuredData,
    location.pathname,
    currentLocale,
  ])
}
