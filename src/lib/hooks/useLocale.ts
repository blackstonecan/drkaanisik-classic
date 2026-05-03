import { useTranslation } from 'react-i18next'
import { isLocale, type Locale, DEFAULT_LOCALE } from '@/lib/i18n'

export function useLocale(): Locale {
  const { i18n } = useTranslation()
  return isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE
}

/** Build a locale-prefixed path. tr → no prefix, en/de → `/en/...` `/de/...` */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return clean === '/' ? '/' : clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}
