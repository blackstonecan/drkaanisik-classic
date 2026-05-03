import { Outlet } from 'react-router-dom'

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="container-page py-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-trust-700">
            Op. Dr. Kaan Işık
          </span>
          <span className="text-xs text-trust-700/60">[Phase 0 placeholder header]</span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="container-page py-8 text-center text-xs text-trust-700/60">
        Phase 0 placeholder footer
      </footer>
    </div>
  )
}
