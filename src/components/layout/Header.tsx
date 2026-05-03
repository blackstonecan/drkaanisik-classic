import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, HeartPulse } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useScrollPastHero } from '@/lib/hooks/useScrollPastHero'
import { useLocale, localePath } from '@/lib/hooks/useLocale'
import { cn } from '@/lib/utils'

type NavLink = {
  key: 'home' | 'clinicTour' | 'services' | 'blog' | 'contact'
  to: string
  type: 'route' | 'anchor'
}

function buildLinks(locale: ReturnType<typeof useLocale>, isHomePage: boolean): NavLink[] {
  const homePath = localePath(locale, '/')
  return [
    { key: 'home', to: homePath, type: 'route' },
    { key: 'clinicTour', to: localePath(locale, '/clinic-tour'), type: 'route' },
    {
      key: 'services',
      to: isHomePage ? '#services' : `${homePath === '/' ? '' : homePath}/#services`,
      type: 'anchor',
    },
    { key: 'blog', to: localePath(locale, '/blog'), type: 'route' },
    {
      key: 'contact',
      to: isHomePage ? '#contact' : `${homePath === '/' ? '' : homePath}/#contact`,
      type: 'anchor',
    },
  ]
}

export function Header() {
  const { t } = useTranslation('common')
  const location = useLocation()
  const locale = useLocale()
  const homePath = localePath(locale, '/')
  const isHomePage = location.pathname === homePath
  const pastHero = useScrollPastHero('hero', isHomePage)
  const isSolid = !isHomePage || pastHero

  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [drawerOpen])

  const links = buildLinks(locale, isHomePage)

  const headerClasses = cn(
    'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
    isSolid
      ? 'border-b border-trust-100/60 bg-white/85 backdrop-blur-md'
      : 'bg-transparent',
  )

  const textClasses = isSolid ? 'text-trust-700' : 'text-white'

  return (
    <header className={headerClasses}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to={homePath}
          className={cn(
            'flex items-center gap-2 font-display text-base font-semibold tracking-tight transition-colors',
            textClasses,
          )}
        >
          <HeartPulse
            className={cn('h-5 w-5', isSolid ? 'text-trust-600' : 'text-white')}
            aria-hidden
          />
          <span>{t('brand.name')}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => {
            const label = t(`nav.${link.key}`)
            return link.type === 'route' ? (
              <Link
                key={link.key}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:opacity-70',
                  textClasses,
                )}
              >
                {label}
              </Link>
            ) : (
              <a
                key={link.key}
                href={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:opacity-70',
                  textClasses,
                )}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher variant={isSolid ? 'dark' : 'light'} />
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-controls="mobile-drawer"
          aria-expanded={drawerOpen}
          className={cn(
            'inline-flex items-center justify-center rounded-full p-2 transition-colors md:hidden',
            isSolid ? 'text-trust-700 hover:bg-trust-50' : 'text-white hover:bg-white/10',
          )}
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper md:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-trust-100/60 px-6">
              <span className="font-display text-base font-semibold text-trust-700">
                {t('brand.name')}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t('actions.close')}
                className="rounded-full p-2 text-trust-700 hover:bg-trust-50"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col gap-1 px-6 py-8"
              aria-label="Primary mobile"
            >
              {links.map((link) => {
                const label = t(`nav.${link.key}`)
                const className =
                  'block rounded-2xl px-4 py-3 text-lg font-medium text-trust-700 hover:bg-trust-50'
                return link.type === 'route' ? (
                  <Link
                    key={link.key}
                    to={link.to}
                    onClick={closeDrawer}
                    className={className}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={link.key}
                    href={link.to}
                    onClick={closeDrawer}
                    className={className}
                  >
                    {label}
                  </a>
                )
              })}
            </nav>
            <div className="border-t border-trust-100/60 px-6 py-6">
              <LanguageSwitcher variant="dark" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
