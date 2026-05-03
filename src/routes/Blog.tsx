import { useTranslation } from 'react-i18next'

export default function Blog() {
  const { t } = useTranslation('common')
  return (
    <section className="container-page py-24">
      <h1 className="font-display text-3xl font-semibold text-trust-700">
        {t('nav.blog')}
      </h1>
      <p className="mt-4 text-sm text-trust-700/60">Phase 0 blog placeholder.</p>
    </section>
  )
}
