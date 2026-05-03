import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { ToastContext, type ToastVariant } from './toast-context'
import { cn } from '@/lib/utils'

type ToastItem = {
  id: number
  message: string
  variant: ToastVariant
}

let toastIdCounter = 0

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-trust-700 text-white',
  info: 'bg-trust-600 text-white',
  error: 'bg-red-600 text-white',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = ++toastIdCounter
      setToasts((prev) => [...prev, { id, message, variant }])
      window.setTimeout(() => remove(id), 5000)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-3 px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-5 py-4 shadow-lg',
                variantClasses[t.variant],
              )}
              role={t.variant === 'error' ? 'alert' : 'status'}
            >
              {t.variant === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              ) : null}
              <p className="flex-1 text-sm leading-relaxed">{t.message}</p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="rounded-full p-1 text-white/80 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
