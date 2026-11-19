import { evaluateGuardrails } from '../config/assistantGuardrails.ts'
import { PORTFOLIO_KNOWLEDGE_BASE } from '../data/knowledgeBase.ts'
import type { ChatMessage, ChatQuickCommand } from '../types/portfolio.ts'

export const CHAT_QUICK_COMMANDS: ChatQuickCommand[] = [
  {
    id: 'cmd-cv',
    command: '--cv',
    label: '--cv (Resumo CV)',
    prompt: '--cv',
  },
  {
    id: 'cmd-projetos',
    command: '--projetos',
    label: '--projetos (Listar Repos)',
    prompt: '--projetos',
  },
  {
    id: 'cmd-stack',
    command: '--stack',
    label: '--stack (Tecnologias)',
    prompt: '--stack',
  },
  {
    id: 'cmd-contato',
    command: '--contato',
    label: '--contato (Email & Redes)',
    prompt: '--contato',
  },
]

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'sys-1',
    sender: 'system',
    content: '> Conectado ao repositório & base de dados do Gabriel Rodrigues.',
  },
  {
    id: 'sys-2',
    sender: 'system',
    content: '> Faça perguntas sobre experiências, stack tecnológica, projetos ou notas.',
  },
  {
    id: 'usr-0',
    sender: 'user',
    content: 'fale sobre os projetos principais e experiência do Gabriel',
  },
  {
    id: 'ast-0',
    sender: 'assistant',
    content:
      'Gabriel cursa Engenharia de Software na PUCRS. Desenvolveu sistemas robustos como o assin.art (automação/assinaturas), IPÊ Saúde MIS (gestão hospitalar), além de ferramentas em Go/CLI e dotfiles Arch Linux.',
    latencyMs: 14,
  },
]

export interface AssistantResponse {
  reply: string
  latencyMs: number
  modelLabel: string
  blocked?: boolean
}

export function buildLocalFallbackReply(input: string): {
  reply: string
  blocked: boolean
} {
  const guardrail = evaluateGuardrails(input)
  if (!guardrail.allowed && guardrail.reply) {
    return { reply: guardrail.reply, blocked: true }
  }

  const normalized = input.trim().toLowerCase()
  const kb = PORTFOLIO_KNOWLEDGE_BASE

  if (
    normalized === '--cv' ||
    /curr[ií]culo|\bcv\b|forma[çc][aã]o|pucrs|ages|experi[eê]ncia/.test(normalized)
  ) {
    return {
      blocked: false,
      reply: `Resumo CV (${kb.owner.name}): ${kb.owner.summary}`,
    }
  }

  if (
    normalized === '--projetos' ||
    /projeto|repo|github|assin|garden|kiro|dotfiles|sprint|ip[eê]/.test(normalized)
  ) {
    const highlights = kb.featuredHighlights
      .map((item, idx) => `${idx + 1}) ${item.name} — ${item.roleOrContext}`)
      .join(' | ')
    return {
      blocked: false,
      reply: `Projetos em destaque (${kb.owner.githubUsername}, ${kb.repositories.length} repos no snapshot): ${highlights}. Veja todos em ${kb.owner.githubUrl}.`,
    }
  }

  if (
    normalized === '--stack' ||
    /stack|tecnolog|linguag|framework|ferrament|figma|mcp|orca|bdd|sdd|multiagente/.test(
      normalized,
    )
  ) {
    return {
      blocked: false,
      reply: `Linguagens: ${kb.techStack.languages.join(', ')}. Frameworks: ${kb.techStack.frameworksAndLibs.join(', ')}. IA & Fluxo: ${kb.techStack.aiAndWorkflow.join(', ')}. Design: ${kb.techStack.designAndAutomation.join(', ')}.`,
    }
  }

  if (
    normalized === '--contato' ||
    /contato|email|e-mail|rede|falar|hire|contrat|cidade|localiza/.test(normalized)
  ) {
    return {
      blocked: false,
      reply: `Contato: Site ${kb.owner.website} | E-mail ${kb.owner.email} | GitHub ${kb.owner.githubUrl} | ${kb.owner.location}.`,
    }
  }

  return {
    blocked: false,
    reply: `Sou o assistente CLI do portfólio de ${kb.owner.name} (${kb.owner.githubUsername}). Pergunte sobre currículo (--cv), repositórios GitHub (--projetos), stack & multiagente (--stack) ou contato (--contato).`,
  }
}

/**
 * Envia uma pergunta ao endpoint serverless `/api/chat` (Gemini API com guardrails).
 * Quando o servidor/chave não estiver configurado, responde via base de conhecimento local
 * aplicando exatamente os mesmos guardrails de escopo (GitHub + currículo).
 */
export async function sendPortfolioChatMessage(
  prompt: string,
  history: ChatMessage[],
): Promise<AssistantResponse> {
  const startedAt = performance.now()
  const preflight = evaluateGuardrails(prompt)

  if (!preflight.allowed && preflight.reply) {
    return {
      reply: preflight.reply,
      latencyMs: Math.max(1, Math.round(performance.now() - startedAt)),
      modelLabel: 'Guardrail // Scoped Policy',
      blocked: true,
    }
  }

  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        history: history.slice(-6).map((item) => ({
          role: item.sender,
          content: item.content,
        })),
      }),
    })

    if (response.ok) {
      const data = (await response.json()) as {
        reply?: string
        model?: string
        blocked?: boolean
      }
      if (data.reply) {
        return {
          reply: data.reply,
          latencyMs: Math.max(1, Math.round(performance.now() - startedAt)),
          modelLabel: data.model ?? 'Gemini // Scoped Proxy',
          blocked: data.blocked,
        }
      }
    } else if (response.status === 429) {
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      return {
        reply: data.error ?? 'Limite de requisições atingido. Tente novamente em instantes.',
        latencyMs: Math.max(1, Math.round(performance.now() - startedAt)),
        modelLabel: 'Rate Limit // Proxy',
        blocked: true,
      }
    }
  } catch {
    // Fallback local quando `/api/chat` não está ativo ou GEMINI_API_KEY não foi definida.
  }

  const fallback = buildLocalFallbackReply(prompt)
  const latencyMs = Math.max(12, Math.round(performance.now() - startedAt))
  return {
    reply: fallback.reply,
    latencyMs,
    modelLabel: fallback.blocked ? 'Guardrail // Scoped Policy' : 'Llama-3-Garden // Local',
    blocked: fallback.blocked,
  }
}
