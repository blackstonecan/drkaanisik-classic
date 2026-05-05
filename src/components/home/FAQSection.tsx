import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import faqData from '@/data/faq.json'
import type { FAQItem as FAQType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/Reveal'

const items = faqData.items as FAQType[]

export function FAQSection() {
  const { t } = useTranslation('home')
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  return (
    <section id="faq" className="container-page py-20 md:py-28">
      <Reveal className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold text-trust-700 md:text-4xl">
          {t('faq.heading')}
        </h2>
        <p className="mt-4 text-trust-700/70">{t('faq.lede')}</p>
      </Reveal>
      <Reveal
        delay={0.08}
        className="mx-auto mt-12 max-w-3xl divide-y divide-trust-100 overflow-hidden rounded-3xl bg-white ring-1 ring-trust-100"
      >
        {items.map((item) => (
          <FAQAccordionItem
            key={item.slug}
            slug={item.slug}
            isOpen={openSlug === item.slug}
            onToggle={() =>
              setOpenSlug((cur) => (cur === item.slug ? null : item.slug))
            }
          />
        ))}
      </Reveal>
    </section>
  )
}

function FAQAccordionItem({
  slug,
  isOpen,
  onToggle,
}: {
  slug: string
  isOpen: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation('faq')
  const panelId = useId()

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-trust-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-trust-500',
          isOpen && 'bg-trust-50/40',
        )}
      >
        <span className="font-medium text-trust-800">
          {t(`items.${slug}.question`)}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-hidden
          className="text-trust-700/60"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm leading-relaxed text-trust-800/80">
              {t(`items.${slug}.answer`)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
