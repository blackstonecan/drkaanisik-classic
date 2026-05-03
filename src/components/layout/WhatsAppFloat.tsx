import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import doctor from '@/data/doctor.json'
import { useLocale } from '@/lib/hooks/useLocale'
import type { Locale } from '@/lib/i18n'

export function WhatsAppFloat() {
  const { t } = useTranslation('contact')
  const locale = useLocale()
  const messages = doctor.whatsappMessage as Partial<Record<Locale, string>>
  const message = messages[locale] ?? messages.tr ?? ''
  const number = doctor.whatsapp.replace(/[^\d]/g, '')
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t('social.whatsappFloatLabel')}
      className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-white/40 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  )
}
