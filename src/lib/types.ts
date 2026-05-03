import type { Locale } from './i18n'

export type LucideIconKey = string

export type DoctorProfile = {
  phone: string
  phoneDisplay: string
  whatsapp: string
  whatsappMessage: Partial<Record<Locale, string>>
  email: string
  address: {
    street: string
    city: string
    country: string
    postalCode: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  social: {
    instagram: string
  }
  images: {
    portrait: string
    heroVideo: string
    heroVideoPoster: string
    contactBackground: string
  }
}

export type Stat = {
  slug: string
  value: string
  numericValue?: number
  suffix?: string
}

export type Procedure = {
  slug: string
  featured?: boolean
}

export type ServiceCategory = {
  slug: string
  icon: LucideIconKey
  procedures: Procedure[]
}

export type ServicesData = {
  categories: ServiceCategory[]
}

export type BlogCategorySlug = string

export type BlogPostMeta = {
  slug: string
  image: string
  imageAlt?: string
  categories: BlogCategorySlug[]
  viewCount: number
  likeCount: number
  publishedAt: string
  /** Per-locale slug map. The base `slug` is the canonical key; each locale entry is its URL-facing form. */
  slugByLocale: Record<Locale, string>
}

export type BlogData = {
  posts: BlogPostMeta[]
}

export type TourPoint = {
  slug: string
  image: string
  icon: LucideIconKey
}

export type TourTransition = {
  from: string
  to: string
  video: string
  videoMobile?: string
}

export type TourData = {
  points: TourPoint[]
  transitions: TourTransition[]
}

export type FAQItem = {
  slug: string
}

export type FAQData = {
  items: FAQItem[]
}

export type Hospital = {
  slug: string
  name: string
  city: string
  url?: string
}

export type HospitalsData = {
  hospitals: Hospital[]
}

export type LocaleSlugLookup = {
  /** map: any locale's url slug -> canonical slug */
  bySlug: Record<string, string>
}
