import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import trCommon from '@/locales/tr/common.json'
import trHome from '@/locales/tr/home.json'
import trServices from '@/locales/tr/services.json'
import trBlog from '@/locales/tr/blog.json'
import trTour from '@/locales/tr/tour.json'
import trContact from '@/locales/tr/contact.json'
import trFaq from '@/locales/tr/faq.json'

import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enServices from '@/locales/en/services.json'
import enBlog from '@/locales/en/blog.json'
import enTour from '@/locales/en/tour.json'
import enContact from '@/locales/en/contact.json'
import enFaq from '@/locales/en/faq.json'

import deCommon from '@/locales/de/common.json'
import deHome from '@/locales/de/home.json'
import deServices from '@/locales/de/services.json'
import deBlog from '@/locales/de/blog.json'
import deTour from '@/locales/de/tour.json'
import deContact from '@/locales/de/contact.json'
import deFaq from '@/locales/de/faq.json'

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

const resources = {
  tr: {
    common: trCommon,
    home: trHome,
    services: trServices,
    blog: trBlog,
    tour: trTour,
    contact: trContact,
    faq: trFaq,
  },
  en: {
    common: enCommon,
    home: enHome,
    services: enServices,
    blog: enBlog,
    tour: enTour,
    contact: enContact,
    faq: enFaq,
  },
  de: {
    common: deCommon,
    home: deHome,
    services: deServices,
    blog: deBlog,
    tour: deTour,
    contact: deContact,
    faq: deFaq,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  ns: [...NAMESPACES],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  returnNull: false,
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
