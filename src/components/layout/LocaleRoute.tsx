import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import type { Locale } from '@/lib/i18n'

type LocaleRouteProps = {
  locale: Locale
  children?: React.ReactNode
}

export function LocaleRoute({ locale, children }: LocaleRouteProps) {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem('locale', locale)
    } catch {
      // localStorage unavailable; ignore
    }
  }, [locale, i18n])

  return <>{children ?? <Outlet />}</>
}
