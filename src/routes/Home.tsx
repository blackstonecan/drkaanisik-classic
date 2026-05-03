import { useState } from 'react'
import { PortfolioPopup } from '@/components/home/PortfolioPopup'
import { shouldShowPortfolioPopup } from '@/components/home/portfolioPopupStorage'
import { HeroVideo } from '@/components/home/HeroVideo'
import { DoctorSection } from '@/components/home/DoctorSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { FAQSection } from '@/components/home/FAQSection'
import { ContactSection } from '@/components/home/ContactSection'

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(() => shouldShowPortfolioPopup())

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
