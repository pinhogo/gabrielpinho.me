import type { ReactNode } from 'react'

export type AquaPillVariant = 'aqua' | 'compact' | 'emerald' | 'badge'

export interface AquaPillProps {
  children: ReactNode
  variant?: AquaPillVariant
  className?: string
  onClick?: () => void
  active?: boolean
}

const VARIANT_CLASSES: Record<AquaPillVariant, string> = {
  aqua: 'aqua-pill text-[11px] font-semibold px-3 py-1 rounded-full text-white',
  compact:
    'aqua-pill text-[10px] font-medium px-2.5 py-0.5 rounded-full text-cyan-100',
  emerald:
    'font-mono-code text-[9px] uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full font-semibold tracking-wider',
  badge:
    'font-mono-code text-[9px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/35 text-cyan-200',
}

/**
 * Pill/tag reutilizável para stacks, metadados e selos de status.
 */
export function AquaPill({
  children,
  variant = 'aqua',
  className = '',
  onClick,
  active = false,
}: AquaPillProps) {
  const baseClass = `inline-flex items-center gap-1 transition-colors ${VARIANT_CLASSES[variant]} ${
    active ? 'ring-1 ring-cyan-200 brightness-110' : ''
  } ${className}`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${baseClass} cursor-pointer`}>
        {children}
      </button>
    )
  }

  return <span className={`${baseClass} cursor-default`}>{children}</span>
}
