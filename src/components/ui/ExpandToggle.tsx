import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExpandToggleProps = {
  expanded: boolean
  onToggle: () => void
  expandedLabel: string
  collapsedLabel: string
  controlsId?: string
  className?: string
}

export function ExpandToggle({
  expanded,
  onToggle,
  expandedLabel,
  collapsedLabel,
  controlsId,
  className,
}: ExpandToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={controlsId}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-trust-200 bg-white px-4 py-2 text-sm font-medium text-trust-700 transition-colors hover:border-trust-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        className,
      )}
    >
      <span>{expanded ? expandedLabel : collapsedLabel}</span>
      <motion.span
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        aria-hidden
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </button>
  )
}
