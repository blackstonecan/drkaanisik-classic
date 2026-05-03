import i18n, { type BackendModule, type ResourceKey } from 'i18next'
import { initReactI18next } from 'react-i18next'

export const SUPPORTED_LOCALES = ['tr', 'en', 'de'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'tr'

export const NAMESPACES = [
  'common',
  'home',
  'services',
  'blog',
  'tour',
  'contact',
  'faq',
] as const
export type Namespace = (typeof NAMESPACES)[number]

type LocaleModule = { default: ResourceKey }

// Vite turns each JSON into its own dynamically-imported chunk, so the main
// bundle ships none of the translation data; only what's needed for the
// current locale is loaded.
const localeFiles = import.meta.glob<LocaleModule>(
  '/src/locales/(tr|en|de)/*.json',
)

const viteGlobBackend: BackendModule = {
  type: 'backend',
  init: () => {
    /* no-op */
  },
  read: (locale, namespace, callback) => {
    const path = `/src/locales/${locale}/${namespace}.json`
    const loader = localeFiles[path]
    if (!loader) {
      callback(new Error(`Missing locale file: ${path}`), false as never)
      return
    }
    loader().then(
      (mod) => callback(null, mod.default),
      (err) => callback(err as Error, false as never),
    )
  },
}

export const i18nReady = i18n
  .use(viteGlobBackend)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    ns: [...NAMESPACES],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    partialBundledLanguages: true,
    react: { useSuspense: false },
  })

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/**
 * One-time first-visit detection. Returns the locale to redirect to from the
 * default `/` URL on first visit only. Subsequent visits trust the URL.
 */
export function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = window.localStorage.getItem('locale') ?? undefined
  if (isLocale(stored)) return stored
  const nav = window.navigator.language?.slice(0, 2).toLowerCase()
  if (isLocale(nav)) return nav
  return DEFAULT_LOCALE
}

export default i18n
