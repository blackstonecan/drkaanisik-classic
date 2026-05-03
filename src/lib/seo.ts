import doctor from '@/data/doctor.json'

const SITE_URL = 'https://drkaanisik.com'

/**
 * JSON-LD MedicalBusiness / Physician schema for the practice.
 * Locale-agnostic — only the description should be localized at the
 * call site if it is included.
 */
export function buildPhysicianSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: 'Op. Dr. Kaan Işık',
    medicalSpecialty: 'CardiovascularSurgery',
    image: doctor.images.portrait,
    description,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: doctor.address.street,
      addressLocality: doctor.address.city,
      addressCountry: doctor.address.country,
      postalCode: doctor.address.postalCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: doctor.coordinates.lat,
      longitude: doctor.coordinates.lng,
    },
    telephone: doctor.phone,
    email: doctor.email,
    sameAs: [doctor.social.instagram],
    availableLanguage: ['tr', 'en', 'de'],
  }
}
