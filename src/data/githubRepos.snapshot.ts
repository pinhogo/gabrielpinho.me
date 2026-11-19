/**
 * Snapshot dos repositórios públicos do GitHub (@pinhogo).
 * Atualize automaticamente rodando: `npm run sync:github`
 */
export interface GitHubRepoSnapshot {
  name: string
  url: string
  language: string | null
  description: string
  updatedAt: string
}

export const GITHUB_SNAPSHOT_UPDATED_AT = '2026-11-19'

export const GITHUB_REPOS_SNAPSHOT: GitHubRepoSnapshot[] = [
  {
    name: 'gabrielpinho.me',
    url: 'https://github.com/pinhogo/gabrielpinho.me',
    language: 'TypeScript',
    description:
      'Portfólio pessoal e jardim digital estilo Frutiger Aero / Aqua OS em React + TypeScript com assistente CLI via Gemini.',
    updatedAt: '2026-11-19',
  },
  {
    name: 'KiroCrewApps',
    url: 'https://github.com/pinhogo/KiroCrewApps',
    language: 'Python',
    description: 'Ecossistema de apps e extensões para fluxos com agentes no Kiro Crew.',
    updatedAt: '2026-11-18',
  },
  {
    name: 'assinart_v1-back',
    url: 'https://github.com/pinhogo/assinart_v1-back',
    language: 'PHP',
    description:
      'API RESTful em PHP 8.2 / Laravel 11 / Sanctum com reserva de username, perfis públicos com eager loading, rastreamento atômico de cliques HTTP 302, documentação e testes PHPUnit.',
    updatedAt: '2026-11-15',
  },
  {
    name: 'kirocrew-github-projects',
    url: 'https://github.com/pinhogo/kirocrew-github-projects',
    language: 'TypeScript',
    description:
      'App nativo de Kanban e tabela de issues para GitHub Projects v2 no Kiro Crew, integrado à gh CLI, backend Python sem dependências com HMAC, além de agente de IA e skill inclusos (MIT).',
    updatedAt: '2026-11-12',
  },
  {
    name: 'KiroCrew',
    url: 'https://github.com/pinhogo/KiroCrew',
    language: 'Python',
    description:
      'Workspace persistente para trabalho de desenvolvimento que evolui continuamente entre sessões multiagente.',
    updatedAt: '2026-11-12',
  },
  {
    name: 'php_basic',
    url: 'https://github.com/pinhogo/php_basic',
    language: 'PHP',
    description: 'Estudos de PHP puro para a Web sem framework.',
    updatedAt: '2026-09-30',
  },
  {
    name: 'graficosUX',
    url: 'https://github.com/pinhogo/graficosUX',
    language: 'Jupyter Notebook',
    description:
      'Análise exploratória e visualização de dados de questionário UX com visualizador interativo de histórico de prompts de IA.',
    updatedAt: '2026-09-15',
  },
  {
    name: 'pinhogo',
    url: 'https://github.com/pinhogo/pinhogo',
    language: 'Markdown',
    description: 'README principal e apresentação do perfil GitHub @pinhogo.',
    updatedAt: '2026-11-19',
  },
  {
    name: 'TrabalhoFinal',
    url: 'https://github.com/pinhogo/TrabalhoFinal',
    language: 'Java',
    description: 'Projeto final da disciplina de Projeto e Arquitetura de Software na PUCRS.',
    updatedAt: '2026-09-03',
  },
  {
    name: 'SoftwareBasico',
    url: 'https://github.com/pinhogo/SoftwareBasico',
    language: 'C',
    description: 'Trabalhos de programação de sistemas e baixo nível na disciplina de Software Básico (PUCRS).',
    updatedAt: '2025-06-13',
  },
  {
    name: 'TF-ALEST-II',
    url: 'https://github.com/pinhogo/TF-ALEST-II',
    language: 'Python',
    description: 'Trabalho final de Algoritmos e Estruturas de Dados II (PUCRS).',
    updatedAt: '2025-06-13',
  },
  {
    name: 'elei-oesRS',
    url: 'https://github.com/pinhogo/elei-oesRS',
    language: 'Python',
    description: 'Tratamento e análise de dados das eleições do Rio Grande do Sul (2016–2024).',
    updatedAt: '2024-11-29',
  },
  {
    name: 'desafiocreatus',
    url: 'https://github.com/pinhogo/desafiocreatus',
    language: 'TypeScript',
    description: 'Desafio técnico de estágio em desenvolvimento web com TypeScript.',
    updatedAt: '2024-07-16',
  },
  {
    name: 'MasterMind',
    url: 'https://github.com/pinhogo/MasterMind',
    language: 'Java',
    description: 'Trabalho final de Programação Orientada a Objetos na PUCRS.',
    updatedAt: '2024-06-29',
  },
  {
    name: 'Sprint3',
    url: 'https://github.com/pinhogo/Sprint3',
    language: 'TypeScript',
    description:
      'Sprint 3 do grupo de estudos AGES (PUCRS): API REST backend para plataforma de filmes com Node.js, TypeScript, Express, Prisma e MongoDB.',
    updatedAt: '2024-06-29',
  },
  {
    name: 'Weather',
    url: 'https://github.com/pinhogo/Weather',
    language: 'JavaScript',
    description: 'Sprint 2 do grupo de estudos AGES (PUCRS) integrando API externa de previsão do tempo.',
    updatedAt: '2024-06-29',
  },
]
