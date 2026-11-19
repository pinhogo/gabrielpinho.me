export const MAX_CHAT_MESSAGE_LENGTH = 500

export const OUT_OF_SCOPE_REPLY =
  'Escopo restrito: sou o assistente do portfólio do Gabriel Pinho (@pinhogo) e respondo apenas perguntas sobre o currículo, formação, stack técnica e repositórios GitHub dele. Experimente --cv, --projetos, --stack ou --contato.'

export const INJECTION_BLOCKED_REPLY =
  'Comando bloqueado pelos guardrails de segurança. Mantenho minhas respostas restritas ao currículo e GitHub do Gabriel Pinho (@pinhogo). Experimente --cv, --projetos, --stack ou --contato.'

export interface InputValidationResult {
  valid: boolean
  sanitized: string
  error?: string
}

export interface GuardrailDecision {
  allowed: boolean
  reason?: 'invalid_input' | 'prompt_injection' | 'out_of_scope'
  reply?: string
}

/**
 * Remove acentos e normaliza espaços/caixa para que `\b` funcione de forma
 * previsível em Português do Brasil (ex.: "você", "currículo", "formação").
 */
export function normalizeForMatching(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /\bignore\s+(all\s+|previous\s+|prior\s+|above\s+|todas\s+as\s+|as\s+)?(instructions|instrucoes|rules|regras)\b/i,
  /\bdesconsidere\s+(todas\s+as\s+|as\s+)?(instrucoes|regras)\b/i,
  /\besqueca\s+(tudo|todas\s+as\s+instrucoes|suas\s+regras)\b/i,
  /\bforget\s+(all\s+)?(previous|your)\s+(instructions|rules)\b/i,
  /\b(reveal|show|print|mostre|exiba|vaze)\b.{0,30}\b(system\s*prompt|prompt\s+do\s+sistema|api[_\s-]*key|gemini[_\s-]*api[_\s-]*key)\b/i,
  /\b(jailbreak|dan\s+mode|developer\s+mode)\b/i,
  /\b(act\s+as|finja\s+que\s+(voce\s+)?e|assuma\s+o\s+papel\s+de)\s+(um|uma|a|an)\s+(?!recrutador|recruiter|assistente\s+do\s+gabriel)/i,
]

const ALLOWED_CLI_COMMANDS = new Set([
  '--cv',
  '--projetos',
  '--stack',
  '--contato',
  '--help',
  'help',
])

const PORTFOLIO_SCOPE_PATTERNS: RegExp[] = [
  /\b(gabriel|pinho|pinhogo|rodrigues|ele|dele|voce|perfil|portfolio|site)\b/i,
  /\b(cv|curriculo|resume|formacao|faculdade|universidade|pucrs|ages|curso|graduacao|estagio|vaga|contratar|hire|trabalho|experiencia|carreira)\b/i,
  /\b(git|github|repo|repositorio|repositorios|projeto|projetos|codigo|arquitetura|assin\.?art|assinart|kirocrew|kiro|garden|dotfiles|sprint3|graficosux|softwarebasico|trabalhofinal|mastermind|ipe)\b/i,
  /\b(stack|tecnologia|tecnologias|linguagem|linguagens|framework|ferramenta|ferramentas|typescript|javascript|react|vite|tailwind|php|laravel|python|java|go|golang|node|express|prisma|postgres|mysql|sqlite|mongo|docker|linux|arch|figma|mcp|orca|multiagente|multi-?agent|agente|agentes|bdd|sdd|kanban|issues|documentacao|cli)\b/i,
  /\b(contato|email|e-mail|linkedin|redes|falar|mensagem|localizacao|cidade|porto\s+alegre|fuso|timezone)\b/i,
  /^(oi|ola|hey|hello|hi|bom\s+dia|boa\s+tarde|boa\s+noite|tudo\s+bem|quem\s+e\s+voce|o\s+que\s+voce\s+faz)[!?. ]*$/i,
]

const CLEARLY_OFF_TOPIC_PATTERNS: RegExp[] = [
  /\b(receita\s+de|como\s+fazer\s+bolo|ingrediente|cozinhar)\b/i,
  /\b(previsao\s+do\s+tempo|vai\s+chover|clima\s+hoje)\b/i,
  /\b(cotacao\s+do\s+dolar|preco\s+do\s+bitcoin|aposta|loteria|mega-?sena)\b/i,
  /\b(piada|me\s+conte\s+uma\s+historia|escreva\s+um\s+poema|poesia|horoscopo|signo)\b/i,
  /\b(politica|presidente|futebol|placar\s+do\s+jogo|campeonato)\b/i,
]

export function validateChatInput(rawMessage: unknown): InputValidationResult {
  if (typeof rawMessage !== 'string') {
    return { valid: false, sanitized: '', error: 'A mensagem precisa ser uma string.' }
  }

  const sanitized = rawMessage.replace(/\s+/g, ' ').trim()

  if (!sanitized) {
    return { valid: false, sanitized: '', error: 'Digite uma pergunta ou comando antes de enviar.' }
  }

  if (sanitized.length > MAX_CHAT_MESSAGE_LENGTH) {
    return {
      valid: false,
      sanitized: sanitized.slice(0, MAX_CHAT_MESSAGE_LENGTH),
      error: `Mensagem excede o limite de ${MAX_CHAT_MESSAGE_LENGTH} caracteres.`,
    }
  }

  return { valid: true, sanitized }
}

export function detectPromptInjection(message: string): boolean {
  const normalized = normalizeForMatching(message)
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(normalized))
}

export function isMessageWithinPortfolioScope(message: string): boolean {
  const normalized = normalizeForMatching(message)
  if (ALLOWED_CLI_COMMANDS.has(normalized)) {
    return true
  }

  if (CLEARLY_OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false
  }

  return PORTFOLIO_SCOPE_PATTERNS.some((pattern) => pattern.test(normalized))
}

/**
 * Executa os guardrails em cascata (validação -> anti-injection -> escopo estrito).
 */
export function evaluateGuardrails(rawMessage: unknown): GuardrailDecision {
  const validation = validateChatInput(rawMessage)
  if (!validation.valid) {
    return {
      allowed: false,
      reason: 'invalid_input',
      reply: validation.error,
    }
  }

  if (detectPromptInjection(validation.sanitized)) {
    return {
      allowed: false,
      reason: 'prompt_injection',
      reply: INJECTION_BLOCKED_REPLY,
    }
  }

  if (!isMessageWithinPortfolioScope(validation.sanitized)) {
    return {
      allowed: false,
      reason: 'out_of_scope',
      reply: OUT_OF_SCOPE_REPLY,
    }
  }

  return { allowed: true }
}
