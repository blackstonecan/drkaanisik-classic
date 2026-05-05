import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import doctor from '@/data/doctor.json'
import { ExpandToggle } from '@/components/ui/ExpandToggle'
import { Reveal } from '@/components/ui/Reveal'
import { StatsGrid } from './StatsGrid'

type EducationItem = { period: string; institution: string; detail: string }

export function DoctorSection() {
  const { t } = useTranslation('home')
  const [expanded, setExpanded] = useState(false)
  const detailId = useId()

  const education = t('doctor.education.items', {
    returnObjects: true,
  }) as unknown as EducationItem[]
  const careerItems = t('doctor.career.items', {
    returnObjects: true,
  }) as unknown as string[]
  const memberships = t('doctor.memberships.items', {
    returnObjects: true,
  }) as unknown as string[]

  return (
    <section id="doctor" className="container-page py-20 md:py-28">
      <Reveal className="grid gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-trust-100 ring-1 ring-trust-100">
            <img
              src={doctor.images.portrait}
              alt={t('doctor.heading')}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-trust-600">
            {t('doctor.kicker')}
          </span>
          <h2 className="mt-2 font-display text-4xl font-semibold text-trust-700 md:text-5xl">
            {t('doctor.heading')}
          </h2>
          <p className="mt-2 text-trust-700/70">{t('doctor.role')}</p>
          <p className="mt-6 text-base leading-relaxed text-trust-800/85">
            {t('doctor.shortBio')}
          </p>
          <div className="mt-6">
            <ExpandToggle
              expanded={expanded}
              onToggle={() => setExpanded((v) => !v)}
              expandedLabel={t('doctor.collapseLabel')}
              collapsedLabel={t('doctor.expandLabel')}
              controlsId={detailId}
            />
          </div>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                id={detailId}
                key="bio-detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-trust-700">
                      {t('doctor.education.title')}
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm text-trust-800/85">
                      {education.map((item) => (
                        <li key={item.institution}>
                          <div className="text-xs uppercase tracking-wider text-trust-600">
                            {item.period}
                          </div>
                          <div className="font-medium">{item.institution}</div>
                          <div className="text-trust-700/70">{item.detail}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-trust-700">
                      {t('doctor.career.title')}
                    </h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-trust-800/85">
                      {careerItems.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-trust-700">
                      {t('doctor.memberships.title')}
                    </h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-trust-800/85">
                      {memberships.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-trust-700">
                      {t('doctor.specialization.title')}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-trust-800/85">
                      {t('doctor.specialization.body')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
      <div className="mt-16">
        <StatsGrid />
      </div>
    </section>
  )
}
