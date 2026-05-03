import { useTranslation } from 'react-i18next'
import { TourStage } from '@/components/tour/TourStage'
import { useDocumentMeta } from '@/lib/hooks/useDocumentMeta'

export default function ClinicTour() {
  const { t } = useTranslation('tour')

  useDocumentMeta({
    title: t('ui.title'),
    description: t('ui.lede'),
  })

  return (
    <section className="container-page py-12 md:py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-trust-700 md:text-5xl">
          {t('ui.title')}
        </h1>
        <p className="mt-4 text-trust-700/70">{t('ui.lede')}</p>
      </div>
      <div className="mt-10">
        <TourStage />
      </div>
    </section>
  )
}
