import type { OrbVariant } from '../../types/portfolio'

export interface StatusOrbProps {
  variant: OrbVariant
  label?: string
  size?: 'xs' | 'sm' | 'md'
  pulse?: boolean
  className?: string
}

const ORB_CLASSES: Record<OrbVariant, string> = {
  seed: 'orb-seed',
  concept: 'orb-seed',
  sprout: 'orb-sprout',
  dev: 'orb-sprout',
  evergreen: 'orb-evergreen',
  prod: 'orb-evergreen',
}

const LABEL_CLASSES: Record<OrbVariant, string> = {
  seed: 'text-cyan-300',
  concept: 'text-cyan-300',
  sprout: 'text-emerald-300',
  dev: 'text-emerald-300',
  evergreen: 'text-emerald-400',
  prod: 'text-emerald-400',
}

const SIZE_CLASSES = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
}

/**
 * Indicador luminoso reutilizável para maturidade do jardim digital e status de projetos.
 */
export function StatusOrb({
  variant,
  label,
  size = 'sm',
  pulse = false,
  className = '',
}: StatusOrbProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`rounded-full inline-block shrink-0 ${SIZE_CLASSES[size]} ${ORB_CLASSES[variant]} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      {label && <span className={LABEL_CLASSES[variant]}>{label}</span>}
    </span>
  )
}
