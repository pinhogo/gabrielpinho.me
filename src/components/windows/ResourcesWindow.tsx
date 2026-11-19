import { useCallback, useEffect, useState } from 'react'
import type { ResourceItem } from '../../types/portfolio'
import { CartridgeButton, OsWindow, TerminalSurface } from '../ui'
import type { WindowControlProps } from './IdentityWindow'

export interface ResourcesWindowProps extends WindowControlProps {
  resources: ResourceItem[]
}

/**
 * Janela 04 / RESOURCES — terminal `~/public/resources` com copy/download e atalho [C].
 */
export function ResourcesWindow({
  resources,
  className = '',
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: ResourcesWindowProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = useCallback(async (item: ResourceItem) => {
    const text = item.copyPayload ?? item.filename
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback silencioso quando clipboard API está indisponível.
    }
    setCopiedId(item.id)
    window.setTimeout(() => {
      setCopiedId((current) => (current === item.id ? null : current))
    }, 1800)
  }, [])

  // Atalho de teclado [C] para copiar o script mais recente (primeiro item copiável)
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key.toLowerCase() === 'c') {
        const latestScript = resources.find((item) => item.actionType === 'copy')
        if (latestScript) {
          void handleCopy(latestScript)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [resources, handleCopy])

  return (
    <OsWindow
      id="docs"
      title="04 / RESOURCES"
      purpose="window-resources"
      className={className}
      bodyClassName="p-4 flex-1 flex flex-col justify-between"
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight drop-shadow">
          Docs, Scripts &amp; Cheatsheets
        </h2>

        <TerminalSurface
          showDots
          rightLabel="~/public/resources"
          className="mt-2.5"
          bodyClassName="p-3"
        >
          <div className="text-xs text-emerald-400 font-bold mb-3">
            $ ls -lah /downloads
          </div>

          <div className="space-y-2 text-[11px]">
            {resources.map((item) => {
              const isCopied = copiedId === item.id
              return (
                <div key={item.id} className="flex items-center justify-between gap-2 group">
                  <div className="min-w-0">
                    <span className="text-cyan-100 font-medium block truncate">
                      {item.filename}
                    </span>
                    <div className="text-[9px] text-cyan-400/60 truncate">
                      {item.description}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="cartridge-btn text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                      {item.extension}
                    </span>

                    {item.actionType === 'copy' ? (
                      <CartridgeButton
                        variant="cartridge"
                        size="xs"
                        onClick={() => void handleCopy(item)}
                        ariaLabel={`Copiar ${item.filename}`}
                        className="font-mono-code min-w-[38px]"
                      >
                        {isCopied ? 'ok!' : 'copy'}
                      </CartridgeButton>
                    ) : (
                      <CartridgeButton
                        variant="secondary"
                        size="xs"
                        href={item.downloadUrl}
                        target="_blank"
                        ariaLabel={`Baixar ${item.filename}`}
                        className="px-1.5"
                      >
                        ↓
                      </CartridgeButton>
                    )}

                    <span className="text-[9px] text-cyan-400 w-10 text-right">
                      {item.size}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </TerminalSurface>
      </div>

      <div className="mt-2 text-right text-[10px] font-mono-code text-cyan-400/70">
        {copiedId
          ? `Copied ${resources.find((r) => r.id === copiedId)?.filename ?? 'script'} to clipboard`
          : 'Press [C] to quick copy latest script'}
      </div>
    </OsWindow>
  )
}
