import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { markPortfolioPopupDismissed } from './portfolioPopupStorage'

type PortfolioPopupProps = {
  open: boolean
  onClose: () => void
}

export function PortfolioPopup({ open, onClose }: PortfolioPopupProps) {
  const { t } = useTranslation('home')
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const dismiss = useCallback(() => {
    markPortfolioPopupDismissed()
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'))

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dismiss()
        return
      }
      if (e.key === 'Tab') {
        const list = focusables()
        if (list.length === 0) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      focusables()[0]?.focus()
    }, 50)

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      previousFocusRef.current?.focus?.()
    }
  }, [open, dismiss])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0 bg-trust-950/60 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-paper p-6 shadow-2xl ring-1 ring-trust-100 sm:p-7 md:p-9"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label={t('popup.closeLabel')}
              className="absolute right-4 top-4 rounded-full p-2 text-trust-700/60 transition-colors hover:bg-trust-50 hover:text-trust-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500"
            >
              <X className="h-4 w-4" />
            </button>
            <h2
              id="portfolio-popup-title"
              className="pr-8 font-display text-2xl font-semibold text-trust-700"
            >
              {t('popup.title')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-trust-800/80">
              {t('popup.body')}
            </p>
            <div className="mt-7 flex justify-end">
              <Button onClick={dismiss}>{t('popup.dismiss')}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
