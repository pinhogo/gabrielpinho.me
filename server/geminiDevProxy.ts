import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import {
  handlePortfolioChatRequest,
  type ChatProxyPayload,
} from './geminiClient.ts'

/**
 * Middleware local para o Vite Dev Server servir `POST /api/chat` usando
 * `GEMINI_API_KEY` do `.env` sem jamais expor a chave ao bundle do navegador.
 */
export function geminiDevProxyPlugin(): Plugin {
  return {
    name: 'gabrielpinho-gemini-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        // Recarrega .env sob demanda em dev para não precisar reiniciar o Vite ao trocar modelo/chave
        const env = loadEnv(server.config.mode, server.config.root, '')

        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        }

        let payload: ChatProxyPayload
        try {
          const raw = Buffer.concat(chunks).toString('utf8')
          payload = raw ? (JSON.parse(raw) as ChatProxyPayload) : {}
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'JSON inválido.' }))
          return
        }

        const result = await handlePortfolioChatRequest(payload, {
          apiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
          model: env.GEMINI_MODEL || process.env.GEMINI_MODEL,
          clientIp: req.socket.remoteAddress || 'local-dev',
        })

        if (result.status >= 500 && result.body.error) {
          server.config.logger.warn(`[api/chat] ${result.body.error}`)
        }

        res.statusCode = result.status
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(result.body))
      })
    },
  }
}
