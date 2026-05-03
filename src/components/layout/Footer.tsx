import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HeartPulse, MessageCircle } from 'lucide-react'
import doctor from '@/data/doctor.json'
import { InstagramIcon } from '@/components/ui/InstagramIcon'
import { useLocale, localePath } from '@/lib/hooks/useLocale'

export function Footer() {
  const { t } = useTranslation('common')
  const locale = useLocale()
  const homePath = localePath(locale, '/')
  const whatsappLink = `https://wa.me/${doctor.whatsapp.replace(/[^\d]/g, '')}`

  return (
    <footer className="mt-16 border-t border-trust-100 bg-white">
      <div className="container-page flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Link
          to={homePath}
          className="flex items-center gap-2 font-display text-sm font-semibold text-trust-700"
        >
          <HeartPulse className="h-4 w-4 text-trust-600" aria-hidden />
          <span>{t('brand.name')}</span>
        </Link>

        <div className="flex flex-col items-start gap-4 text-xs text-trust-700/60 md:flex-row md:items-center md:gap-6">
          <span>{t('footer.copyright')}</span>
          <a href="#" className="hover:text-trust-700">
            {t('footer.privacy')}
          </a>
          <a
            href="https://github.com/blackstonecan"
            target="_blank"
            rel="noreferrer"
            className="hover:text-trust-700"
          >
            {t('footer.portfolioBy')}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={doctor.social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="rounded-full bg-trust-50 p-2 text-trust-700 hover:bg-trust-100"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="rounded-full bg-trust-50 p-2 text-trust-700 hover:bg-trust-100"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
