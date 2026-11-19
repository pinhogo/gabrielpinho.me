import type { ReactNode } from 'react'
import { WindowHeader } from './WindowHeader'

export interface OsWindowProps {
  /** ID HTML opcional para navegação por âncora (ex.: "projetos") */
  id?: string
  /** Identificador de propósito semântico */
  purpose?: string
  /** Título da barra superior (ex.: "01 / IDENTITY") */
  title: string
  /** Classes adicionais no container da janela (ex.: colunas do Bento Grid) */
  className?: string
  /** Classes adicionais na área interna de conteúdo */
  bodyClassName?: string
  /** Conteúdo opcional extra no cabeçalho */
  headerRightSlot?: ReactNode
  isMinimized?: boolean
  isMaximized?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  children: ReactNode
}

/**
 * Container padrão de janela Frutiger Aero / Aqua OS.
 * Centraliza a moldura de vidro e o cabeçalho único `WindowHeader`.
 */
export function OsWindow({
  id,
  purpose,
  title,
  className = '',
  bodyClassName = 'p-4 flex-1 flex flex-col justify-between',
  headerRightSlot,
  isMinimized = false,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  children,
}: OsWindowProps) {
  return (
    <section
      id={id}
      data-purpose={purpose}
      className={`flex flex-col aero-window transition-all duration-200 ${
        isMaximized ? 'ring-1 ring-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : ''
      } ${className}`}
    >
      <WindowHeader
        title={title}
        rightSlot={headerRightSlot}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />

      {!isMinimized && <div className={bodyClassName}>{children}</div>}
    </section>
  )
}
