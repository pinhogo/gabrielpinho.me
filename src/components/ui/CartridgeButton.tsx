import type { ReactNode } from 'react'

export type CartridgeButtonVariant = 'cartridge' | 'secondary' | 'gel'
export type CartridgeButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface CartridgeButtonProps {
  children: ReactNode
  variant?: CartridgeButtonVariant
  size?: CartridgeButtonSize
  className?: string
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  title?: string
  ariaLabel?: string
}

const VARIANT_CLASSES: Record<CartridgeButtonVariant, string> = {
  cartridge: 'cartridge-btn text-white font-semibold',
  secondary:
    'bg-cyan-950/70 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 font-mono-code',
  gel: 'gel-button-large text-emerald-950 font-bold tracking-wide shadow-xl',
}

const SIZE_CLASSES: Record<CartridgeButtonSize, string> = {
  xs: 'text-[9px] px-2 py-0.5 rounded',
  sm: 'text-[11px] px-2.5 py-1 rounded',
  md: 'text-xs px-3 py-1.5 rounded-md',
  lg: 'text-base py-2.5 px-5 rounded-full',
}

/**
 * Botão/link reutilizável nos estilos Cartridge Aqua, Secondary Outline e Gel 3D.
 */
export function CartridgeButton({
  children,
  variant = 'cartridge',
  size = 'sm',
  className = '',
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  onClick,
  title,
  ariaLabel,
}: CartridgeButtonProps) {
  const classes = `inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  )
}
