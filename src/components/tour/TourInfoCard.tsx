import { useTranslation } from 'react-i18next'

type TourInfoCardProps = {
  slug: string
}

export function TourInfoCard({ slug }: TourInfoCardProps) {
  const { t } = useTranslation('tour')

  return (
    <div className="rounded-2xl bg-paper/95 p-6 shadow-xl ring-1 ring-trust-100 backdrop-blur md:p-7">
      <span className="text-xs uppercase tracking-widest text-trust-700/60">
        {t('ui.currentLabel')}
      </span>
      <h2 className="mt-1 font-display text-2xl font-semibold text-trust-700 md:text-3xl">
        {t(`points.${slug}.title`)}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-trust-800/85">
        {t(`points.${slug}.description`)}
      </p>
    </div>
  )
}
