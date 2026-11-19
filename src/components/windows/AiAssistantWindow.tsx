import { useEffect, useRef, useState } from 'react'
import {
  CHAT_QUICK_COMMANDS,
  INITIAL_CHAT_MESSAGES,
  sendPortfolioChatMessage,
} from '../../services/chatService'
import type { ChatMessage } from '../../types/portfolio'
import { AquaPill, CartridgeButton, OsWindow, TerminalSurface } from '../ui'
import type { WindowControlProps } from './IdentityWindow'

export type AiAssistantWindowProps = WindowControlProps

/**
 * Janela 02 / AI TERMINAL ASSISTANT — Garden CLI Chat interativo (pronto para proxy Gemini API).
 */
export function AiAssistantWindow({
  className = '',
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: AiAssistantWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modelLabel, setModelLabel] = useState('Llama-3-Garden // Local')
  const [lastLatencyMs, setLastLatencyMs] = useState(14)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const msgCounterRef = useRef(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  async function handleSubmitPrompt(rawPrompt: string) {
    const trimmed = rawPrompt.trim()
    if (!trimmed || isLoading) return

    msgCounterRef.current += 1
    const userMsg: ChatMessage = {
      id: `usr-${msgCounterRef.current}`,
      sender: 'user',
      content: trimmed,
    }

    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await sendPortfolioChatMessage(trimmed, nextHistory)
      setModelLabel(response.modelLabel)
      setLastLatencyMs(response.latencyMs)
      msgCounterRef.current += 1
      const assistantMsgId = `ast-${msgCounterRef.current}`
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: 'assistant',
          content: response.reply,
          latencyMs: response.latencyMs,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <OsWindow
      title="02 / AI TERMINAL ASSISTANT"
      purpose="window-ai-assistant"
      className={className}
      bodyClassName="p-4 flex-1 flex flex-col justify-between gap-2.5"
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Title & Badge */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white tracking-tight drop-shadow">
            Garden CLI Chat
          </h2>
          <AquaPill variant="emerald">AI AGENT // LLM CLI</AquaPill>
        </div>

        <p className="mt-1 text-[11px] text-cyan-100/85 leading-snug">
          Chatbot de IA interativo sobre currículo, repositórios e notas.
        </p>

        {/* Terminal Transcript Surface */}
        <TerminalSurface
          className="mt-2.5 flex-1 flex flex-col min-h-[215px] max-h-[290px]"
          bodyClassName="p-2.5 flex-1 flex flex-col min-h-0"
        >
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-2 pr-1 text-[10px] leading-relaxed"
          >
            <div className="text-emerald-400 font-semibold">
              $ garden-ai --interactive --context @gabrielpinho
            </div>

            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-cyan-300/80">
                    {msg.content}
                  </div>
                )
              }

              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="text-cyan-100 font-medium pt-0.5">
                    <span className="text-emerald-400">&gt;</span> {msg.content}
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className="rounded bg-[#062433]/90 border border-cyan-600/35 p-2 text-cyan-100/95"
                >
                  <span className="text-cyan-300 font-semibold">[AI Assistant]:</span>{' '}
                  {msg.content}
                </div>
              )
            })}

            {isLoading && (
              <div className="text-cyan-400 animate-pulse">
                [AI Assistant]: consultando contexto @gabrielpinho...
              </div>
            )}

            {/* Quick CLI Commands */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              {CHAT_QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void handleSubmitPrompt(cmd.prompt)}
                  className="text-[9.5px] font-mono-code px-2 py-0.5 rounded bg-[#041d2b] hover:bg-cyan-900/60 border border-cyan-500/35 text-cyan-200 transition cursor-pointer disabled:opacity-50"
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </TerminalSurface>
      </div>

      {/* Prompt Input & Model Telemetry */}
      <div className="space-y-1.5">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmitPrompt(inputValue)
          }}
          className="flex items-center gap-1.5"
        >
          <div className="relative flex-1 flex items-center">
            <span
              aria-hidden="true"
              className="absolute left-2 text-[11px] font-mono-code text-emerald-400 font-bold pointer-events-none"
            >
              &gt;
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              disabled={isLoading}
              aria-label="Digite seu comando ou pergunta para o assistente"
              placeholder="Digite seu comando ou pergunta..."
              className="w-full bg-[#01141e]/95 border border-cyan-600/45 rounded pl-5 pr-2 py-1.5 text-[10.5px] font-mono-code text-cyan-100 placeholder-cyan-400/60 focus:outline-none focus:border-cyan-300"
            />
          </div>

          <CartridgeButton
            type="submit"
            variant="cartridge"
            size="sm"
            disabled={isLoading || !inputValue.trim()}
            className="text-[10px] py-1.5 px-2.5 shrink-0 font-mono-code"
          >
            ↵ Enviar
          </CartridgeButton>
        </form>

        <div className="flex items-center justify-between text-[9.5px] font-mono-code text-cyan-400/75">
          <span className="truncate">Model: {modelLabel}</span>
          <span className="shrink-0">latency: {lastLatencyMs}ms</span>
        </div>
      </div>
    </OsWindow>
  )
}
