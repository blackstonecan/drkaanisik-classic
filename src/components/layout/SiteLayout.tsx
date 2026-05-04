import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFloat } from './WhatsAppFloat'
import { ToastProvider } from '@/components/ui/Toast'
import { useHashScroll } from '@/lib/hooks/useHashScroll'

export function SiteLayout() {
  const { t } = useTranslation('common')
  useHashScroll()
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-paper text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-trust-700 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-paper focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-paper"
        >
          {t('skipToContent')}
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </ToastProvider>
  )
}
