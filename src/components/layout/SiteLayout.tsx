import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFloat } from './WhatsAppFloat'
import { ToastProvider } from '@/components/ui/Toast'

export function SiteLayout() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-paper text-ink">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </ToastProvider>
  )
}
