import type { ReactNode } from 'react'

export interface TerminalSurfaceProps {
  /** Rótulo esquerdo no cabeçalho interno (ex.: "preview :: assin.art / architecture.go") */
  leftLabel?: ReactNode
  /** Rótulo direito no cabeçalho interno (ex.: "~/public/resources" ou "UTF-8 // Go 1.22") */
  rightLabel?: ReactNode
  /** Exibe os 3 círculos minimalistas de terminal no canto esquerdo */
  showDots?: boolean
  className?: string
  bodyClassName?: string
  children: ReactNode
}

/**
 * Superfície escura reutilizável para terminais, logs de IA e previews de código.
 */
export function TerminalSurface({
  leftLabel,
  rightLabel,
  showDots = false,
  className = '',
  bodyClassName = 'p-3',
  children,
}: TerminalSurfaceProps) {
  const hasHeader = showDots || leftLabel || rightLabel

  return (
    <div
      className={`rounded-lg bg-[#01141e]/95 border border-cyan-600/40 shadow-inner font-mono-code overflow-hidden ${className}`}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-2 border-b border-cyan-800/50 px-3 py-1.5 text-[10px] text-cyan-400">
          <div className="flex items-center space-x-1.5 min-w-0">
            {showDots && (
              <div className="flex items-center space-x-1 shrink-0" aria-hidden="true">
                <span className="w-2 h-2 rounded-full border border-cyan-400/60" />
                <span className="w-2 h-2 rounded-full border border-cyan-400/60" />
                <span className="w-2 h-2 rounded-full border border-cyan-400/60" />
              </div>
            )}
            {leftLabel && <div className="truncate">{leftLabel}</div>}
          </div>
          {rightLabel && <div className="shrink-0 text-right">{rightLabel}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
