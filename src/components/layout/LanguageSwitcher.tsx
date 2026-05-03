import { useMemo, useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/lib/hooks/useLocale'
import { translateBlogSlug } from '@/lib/blog'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LOCALE_LABEL: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
  de: 'DE',
}

type Variant = 'light' | 'dark'

type LanguageSwitcherProps = {
  variant?: Variant
  className?: string
}

function localePathFor(toLocale: Locale, currentPathname: string, currentLocale: Locale): string {
  // strip the leading locale prefix, if any
  let rest = currentPathname
  if (currentLocale !== DEFAULT_LOCALE) {
    const prefix = `/${currentLocale}`
    rest = rest.startsWith(prefix) ? rest.slice(prefix.length) : rest
  }
  if (rest === '') rest = '/'

  // translate /blog/:slug
  const blogMatch = rest.match(/^\/blog\/([^/]+)\/?$/)
  if (blogMatch) {
    const oldSlug = blogMatch[1]!
    const newSlug = translateBlogSlug(oldSlug, currentLocale, toLocale) ?? oldSlug
    rest = `/blog/${newSlug}`
  }

  if (toLocale === DEFAULT_LOCALE) {
    return rest === '/' ? '/' : rest
  }
  return rest === '/' ? `/${toLocale}` : `/${toLocale}${rest}`
}

export function LanguageSwitcher({ variant = 'dark', className }: LanguageSwitcherProps) {
  const { t } = useTranslation('common')
  const locale = useLocale()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () =>
      SUPPORTED_LOCALES.map((l) => ({
        locale: l,
        label: LOCALE_LABEL[l],
        href: localePathFor(l, location.pathname, locale),
      })),
    [location.pathname, locale],
  )

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', handler)
    window.addEventListener('keydown', escHandler)
    return () => {
      window.removeEventListener('mousedown', handler)
      window.removeEventListener('keydown', escHandler)
    }
  }, [open])

  const triggerClasses =
    variant === 'light'
      ? 'border-white/40 text-white hover:bg-white/10'
      : 'border-trust-200 text-trust-700 hover:border-trust-400 hover:bg-white'

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.label')}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border bg-transparent px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
          triggerClasses,
        )}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span>{LOCALE_LABEL[locale]}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-trust-100 bg-white py-2 shadow-lg ring-1 ring-trust-100/50"
          >
            {items.map((item) => {
              const isActive = item.locale === locale
              return (
                <li key={item.locale}>
                  <Link
                    to={item.href}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-trust-50',
                      isActive ? 'font-semibold text-trust-700' : 'text-trust-700/80',
                    )}
                  >
                    <span>{t(`language.${item.locale}`)}</span>
                    <span className="text-xs uppercase tracking-wider text-trust-700/60">
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
