import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useLikeStorage } from '@/lib/hooks/useLikeStorage'
import { cn } from '@/lib/utils'

type LikeButtonProps = {
  /** Canonical (locale-independent) post slug. */
  slug: string
  /** Server-seed like count to add user's like to. */
  baseCount: number
  className?: string
}

export function LikeButton({ slug, baseCount, className }: LikeButtonProps) {
  const { t } = useTranslation('blog')
  const { liked, toggle } = useLikeStorage(slug)
  const total = baseCount + (liked ? 1 : 0)

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? t('ui.unlikeAria') : t('ui.likeAria')}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500',
        liked
          ? 'border-accent-300 bg-accent-50 text-accent-700'
          : 'border-trust-200 bg-white text-trust-700 hover:border-trust-400',
        className,
      )}
    >
      <motion.span
        key={liked ? 'on' : 'off'}
        initial={{ scale: 0.6 }}
        animate={{ scale: liked ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        aria-hidden
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            liked ? 'fill-accent-500 text-accent-500' : 'text-trust-700',
          )}
        />
      </motion.span>
      <span>
        {total.toLocaleString()}{' '}
        <span className="text-xs text-current/60">{t('ui.likesLabel')}</span>
      </span>
    </button>
  )
}
