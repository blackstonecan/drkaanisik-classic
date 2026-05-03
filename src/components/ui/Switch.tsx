import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SwitchProps = {
  options: readonly [{ value: string; label: string }, { value: string; label: string }]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  className?: string
}

export function Switch({ options, value, onChange, ariaLabel, className }: SwitchProps) {
  const activeIndex = options.findIndex((o) => o.value === value)

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex rounded-full bg-trust-50 p-1 text-sm font-medium ring-1 ring-trust-100',
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm ring-1 ring-trust-200"
        initial={false}
        animate={{
          left: activeIndex === 0 ? '0.25rem' : '50%',
          right: activeIndex === 0 ? '50%' : '0.25rem',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      />
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-10 flex-1 rounded-full px-5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500',
              isActive ? 'text-trust-700' : 'text-trust-700/60 hover:text-trust-700',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
