import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  handlePortfolioChatRequest,
  type ChatProxyPayload,
} from '../server/geminiClient.ts'

interface ServerlessRequest extends IncomingMessage {
  body?: unknown
}

interface ServerlessResponse extends ServerResponse {
  status?: (code: number) => ServerlessResponse
  json?: (payload: unknown) => void
}

async function readJsonBody(req: ServerlessRequest): Promise<ChatProxyPayload> {
  if (req.body && typeof req.body === 'object') {
    return req.body as ChatProxyPayload
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as ChatProxyPayload
  }

  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? (JSON.parse(raw) as ChatProxyPayload) : {}
}

function sendJson(res: ServerlessResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

/**
 * Endpoint serverless `POST /api/chat` (compatível com Vercel Functions / Node HTTP).
 * Lê `GEMINI_API_KEY` apenas no servidor — nunca expõe a chave no cliente.
 */
export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Método não permitido. Use POST /api/chat.' })
    return
  }

  let payload: ChatProxyPayload
  try {
    payload = await readJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'JSON inválido no corpo da requisição.' })
    return
  }

  const forwardedFor = req.headers['x-forwarded-for']
  const clientIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0].trim()
      : req.socket?.remoteAddress || 'unknown'

  try {
    const result = await handlePortfolioChatRequest(payload, {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL,
      clientIp,
    })

    sendJson(res, result.status, result.body)
  } catch {
    sendJson(res, 500, { error: 'Erro interno ao processar mensagem no assistente.' })
  }
}
