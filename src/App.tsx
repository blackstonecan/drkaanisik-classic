import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LocaleRoute } from '@/components/layout/LocaleRoute'
import { SiteLayout } from '@/components/layout/SiteLayout'
import type { Locale } from '@/lib/i18n'

const Home = lazy(() => import('@/routes/Home'))
const Blog = lazy(() => import('@/routes/Blog'))
const BlogPost = lazy(() => import('@/routes/BlogPost'))
const ClinicTour = lazy(() => import('@/routes/ClinicTour'))
const NotFound = lazy(() => import('@/routes/NotFound'))

function PageFallback() {
  const { t } = useTranslation('common')
  return (
    <div className="container-page py-24 text-center text-trust-700/60">
      {t('loading')}
    </div>
  )
}

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>
}

function localeChildren() {
  return [
    { index: true, element: withSuspense(<Home />) },
    { path: 'blog', element: withSuspense(<Blog />) },
    { path: 'blog/:slug', element: withSuspense(<BlogPost />) },
    { path: 'clinic-tour', element: withSuspense(<ClinicTour />) },
  ]
}

function localeBranch(locale: Locale, path: string) {
  return {
    path,
    element: (
      <LocaleRoute locale={locale}>
        <SiteLayout />
      </LocaleRoute>
    ),
    children: localeChildren(),
  }
}

const router = createBrowserRouter([
  localeBranch('tr', '/'),
  localeBranch('en', '/en'),
  localeBranch('de', '/de'),
  { path: '*', element: withSuspense(<NotFound />) },
])

export default function App() {
  return <RouterProvider router={router} />
}
