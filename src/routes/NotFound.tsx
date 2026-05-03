import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale, localePath } from '@/lib/hooks/useLocale'
import { useDocumentMeta } from '@/lib/hooks/useDocumentMeta'

export default function NotFound() {
  const { t } = useTranslation('common')
  const locale = useLocale()

  useDocumentMeta({
    title: t('notFound.title'),
    description: t('notFound.description'),
  })

  return (
    <section className="container-page py-24 text-center">
      <h1 className="font-display text-4xl font-semibold text-trust-700">
        {t('notFound.title')}
      </h1>
      <p className="mt-3 text-trust-700/70">{t('notFound.description')}</p>
      <Link
        to={localePath(locale, '/')}
        className="mt-6 inline-block rounded-full bg-trust-600 px-5 py-2 text-sm font-medium text-white hover:bg-trust-700"
      >
        {t('notFound.cta')}
      </Link>
    </section>
  )
}
