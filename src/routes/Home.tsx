import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PortfolioPopup } from '@/components/home/PortfolioPopup'
import { shouldShowPortfolioPopup } from '@/components/home/portfolioPopupStorage'
import { HeroVideo } from '@/components/home/HeroVideo'
import { DoctorSection } from '@/components/home/DoctorSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { FAQSection } from '@/components/home/FAQSection'
import { ContactSection } from '@/components/home/ContactSection'
import { useDocumentMeta } from '@/lib/hooks/useDocumentMeta'
import { buildPhysicianSchema } from '@/lib/seo'
import doctor from '@/data/doctor.json'

export default function Home() {
  const { t: tc } = useTranslation('common')
  const { t: th } = useTranslation('home')
  const [popupOpen, setPopupOpen] = useState(() => shouldShowPortfolioPopup())

  useDocumentMeta({
    title: `${tc('brand.name')} — ${tc('brand.role')}`,
    description: th('hero.subtitle'),
    ogImage: doctor.images.heroVideoPoster,
    rawTitle: true,
    structuredData: buildPhysicianSchema(th('hero.subtitle')),
  })

  return (
    <>
      <PortfolioPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
      <HeroVideo paused={popupOpen} />
      <DoctorSection />
      <ServicesSection />
      <FAQSection />
      <ContactSection />
    </>
  )
}
