import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t, i18n } = useTranslation('common')
  return (
    <section className="container-page py-24">
      <h1 className="font-display text-4xl font-semibold text-trust-700">
        {t('brand.name')}
      </h1>
      <p className="mt-2 text-trust-700/70">{t('brand.role')}</p>
      <p className="mt-6 text-sm text-trust-700/60">
        Locale: <code>{i18n.resolvedLanguage}</code> — Phase 0 skeleton. Homepage sections arrive in Phase 3.
      </p>
    </section>
  )
}
