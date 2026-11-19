import { evaluateGuardrails } from '../src/config/assistantGuardrails.ts'
import { buildAssistantSystemPrompt } from '../src/config/assistantPrompt.ts'

export interface ChatHistoryTurn {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatProxyPayload {
  message?: unknown
  history?: ChatHistoryTurn[]
}

export interface ChatProxyResponse {
  status: number
  body: {
    reply?: string
    model?: string
    blocked?: boolean
    error?: string
  }
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 15
const ipRequestTimestamps = new Map<string, number[]>()

export function checkRateLimit(clientIp: string, now = Date.now()): boolean {
  const previous = ipRequestTimestamps.get(clientIp) ?? []
  const recent = previous.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequestTimestamps.set(clientIp, recent)
    return false
  }

  recent.push(now)
  ipRequestTimestamps.set(clientIp, recent)
  return true
}

export function resetRateLimitStore(): void {
  ipRequestTimestamps.clear()
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
  error?: {
    message?: string
  }
}

export async function handlePortfolioChatRequest(
  payload: ChatProxyPayload,
  options: {
    apiKey?: string
    model?: string
    clientIp?: string
  },
): Promise<ChatProxyResponse> {
  const clientIp = options.clientIp || 'unknown'

  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        error: 'Muitas requisições em pouco tempo. Aguarde alguns segundos e tente novamente.',
      },
    }
  }

  const guardrail = evaluateGuardrails(payload.message)
  if (!guardrail.allowed) {
    return {
      status: guardrail.reason === 'invalid_input' ? 400 : 200,
      body: {
        reply: guardrail.reply,
        model: 'Guardrail // Scoped Policy',
        blocked: true,
        error: guardrail.reason === 'invalid_input' ? guardrail.reply : undefined,
      },
    }
  }

  const apiKey = options.apiKey?.trim()
  if (!apiKey) {
    return {
      status: 503,
      body: {
        error: 'GEMINI_API_KEY não configurada no servidor.',
      },
    }
  }

  const model = options.model?.trim() || 'gemini-2.5-flash'
  const safeHistory = Array.isArray(payload.history)
    ? payload.history
        .filter(
          (item): item is ChatHistoryTurn =>
            Boolean(item) &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string' &&
            item.content.trim().length > 0,
        )
        .slice(-6)
    : []

  const contents = [
    ...safeHistory.map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content.slice(0, 500) }],
    })),
    {
      role: 'user',
      parts: [{ text: String(payload.message).trim() }],
    },
  ]

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildAssistantSystemPrompt() }],
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 450,
      },
    }),
  })

  if (!response.ok) {
    return {
      status: 502,
      body: {
        error: `Falha ao consultar a API do Gemini (HTTP ${response.status}).`,
      },
    }
  }

  const data = (await response.json()) as GeminiGenerateContentResponse
  const replyText = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim()

  if (!replyText) {
    return {
      status: 502,
      body: {
        error: 'A API do Gemini retornou uma resposta vazia.',
      },
    }
  }

  return {
    status: 200,
    body: {
      reply: replyText,
      model: `${model} // Scoped Proxy`,
      blocked: false,
    },
  }
}
