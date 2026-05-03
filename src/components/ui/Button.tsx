import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-trust-600 text-white hover:bg-trust-700 active:bg-trust-800',
  secondary: 'bg-accent-400 text-trust-900 hover:bg-accent-500 active:bg-accent-600',
  ghost: 'text-trust-700 hover:bg-trust-50 active:bg-trust-100',
  outline:
    'border border-trust-200 bg-transparent text-trust-700 hover:border-trust-400 hover:bg-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children?: ReactNode
}

type ButtonAsButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { as?: 'button' }

type ButtonAsAnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { as: 'a' }

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = 'primary', size = 'md', className, children, ...rest } = props
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

    if ('as' in rest && rest.as === 'a') {
      const { as: _as, ...anchorProps } = rest
      void _as
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...anchorProps}>
          {children}
        </a>
      )
    }

    const { as: _as, ...buttonProps } = rest as ButtonAsButtonProps
    void _as
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    )
  },
)
