import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-navy-800 to-navy-900 text-white hover:from-navy-700 hover:to-navy-800 border border-navy-900 shadow-sm hover:shadow-md',
  secondary:
    'bg-white/95 text-navy-900 hover:bg-slate-soft border border-slate-300 shadow-sm hover:border-slate-400',
  danger: 'bg-alert text-white hover:bg-red-700 border border-alert shadow-sm',
  ghost:
    'bg-transparent text-navy-800 hover:bg-white/70 border border-transparent',
  success:
    'bg-teal-deep text-white hover:bg-teal-700 border border-teal-deep shadow-sm',
  soft: 'bg-teal-soft/70 text-teal-deep hover:bg-teal-soft border border-teal-200',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-8 px-2.5 py-1.5 text-xs rounded-lg',
  md: 'min-h-10 px-3.5 py-2 text-sm rounded-xl',
  lg: 'min-h-11 px-4 py-2.5 text-sm sm:text-base rounded-xl',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
