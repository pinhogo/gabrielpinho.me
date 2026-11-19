import type { ReactNode } from 'react'

export interface WindowHeaderProps {
  /** Rótulo exibido na barra superior (ex.: "01 / IDENTITY") */
  title: string
  /** Conteúdo opcional à esquerda dos controles Aqua */
  rightSlot?: ReactNode
  isMinimized?: boolean
  isMaximized?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

/**
 * Cabeçalho único e reutilizável para todas as janelas simuladas do OS Portfolio.
 */
export function WindowHeader({
  title,
  rightSlot,
  isMinimized = false,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
}: WindowHeaderProps) {
  return (
    <header className="aero-window-header px-3.5 py-1.5 flex items-center justify-between gap-2 select-none">
      <div className="flex items-center space-x-2 min-w-0">
        <span className="font-mono-code text-[11px] font-semibold text-cyan-200 tracking-wider truncate">
          {title}
        </span>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {rightSlot}
        <div className="flex items-center space-x-1.5" role="group" aria-label={`Controles da janela ${title}`}>
          <button
            type="button"
            onClick={onMinimize}
            title={isMinimized ? 'Restaurar janela' : 'Minimizar janela'}
            aria-label={isMinimized ? `Restaurar ${title}` : `Minimizar ${title}`}
            className="w-3 h-3 rounded-full aqua-btn-min cursor-pointer inline-block transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-200"
          />
          <button
            type="button"
            onClick={onMaximize}
            title={isMaximized ? 'Restaurar tamanho' : 'Expandir janela'}
            aria-label={isMaximized ? `Restaurar tamanho de ${title}` : `Expandir ${title}`}
            className="w-3 h-3 rounded-full aqua-btn-max cursor-pointer inline-block transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-200"
          />
          <button
            type="button"
            onClick={onClose}
            title="Ocultar janela"
            aria-label={`Ocultar ${title}`}
            className="w-3 h-3 rounded-full aqua-btn-close cursor-pointer inline-block transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-200"
          />
        </div>
      </div>
    </header>
  )
}
