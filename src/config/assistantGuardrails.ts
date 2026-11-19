export const MAX_CHAT_MESSAGE_LENGTH = 500

export const INJECTION_BLOCKED_REPLY =
  'Boa tentativa de hackear o terminal! Meus guardrails continuam firmes aqui — mas se quiser saber como o Gabriel Pinho (@pinhogo) protege proxies e orquestra agentes de IA, manda um --projetos ou --stack.'

export type ChatTopic = 'portfolio' | 'casual_pivot'

export interface InputValidationResult {
  valid: boolean
  sanitized: string
  error?: string
}

export interface GuardrailDecision {
  allowed: boolean
  topic?: ChatTopic
  reason?: 'invalid_input' | 'prompt_injection'
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
  /\b(gabriel|pinho|pinhogo|rodrigues|perfil|portf?o?lio|portifolio|site)\b/i,
  /\b(cv|curriculo|resume|formacao|faculdade|universidade|pucrs|ages|curso|graduacao|estagio|vaga|contratar|hire|trabalho|experiencia|carreira)\b/i,
  /\b(git|github|repo|repositorio|repositorios|projeto|projetos|codigo|arquitetura|desenvolveu|construiu|assin\.?art|assinart|kirocrew|kiro|garden|dotfiles|sprint3|graficosux|softwarebasico|trabalhofinal|mastermind|ipe)\b/i,
  /\b(stack|tecnologia|tecnologias|linguagem|linguagens|framework|ferramenta|ferramentas|typescript|javascript|react|vite|tailwind|php|laravel|python|java|go|golang|node|express|prisma|postgres|mysql|sqlite|mongo|docker|linux|arch|figma|mcp|orca|multiagente|multi-?agent|agente|agentes|bdd|sdd|kanban|issues|documentacao|cli)\b/i,
  /\b(contato|email|e-mail|linkedin|redes|falar|mensagem|localizacao|cidade|porto\s+alegre|fuso|timezone)\b/i,
  /^(oi|ola|hey|hello|hi|bom\s+dia|boa\s+tarde|boa\s+noite|tudo\s+bem)[!?. ,]*$/i,
  /\b(quem\s+e\s+voce|o\s+que\s+voce\s+faz)\b/i,
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

export function classifyChatTopic(message: string): ChatTopic {
  const normalized = normalizeForMatching(message)
  if (ALLOWED_CLI_COMMANDS.has(normalized)) {
    return 'portfolio'
  }

  if (PORTFOLIO_SCOPE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'portfolio'
  }

  return 'casual_pivot'
}

/**
 * Guardrails de segurança em cascata:
 * 1. Bloqueia entradas inválidas/excessivas (`invalid_input`)
 * 2. Bloqueia tentativas de prompt injection e vazamento de segredos (`prompt_injection`)
 * 3. Permite perguntas sobre o portfólio (`portfolio`) e perguntas casuais/aleatórias
 *    (`casual_pivot`), que serão respondidas de forma leve e redirecionadas ao Gabriel.
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

  return {
    allowed: true,
    topic: classifyChatTopic(validation.sanitized),
  }
}
