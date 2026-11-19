import {
  GITHUB_REPOS_SNAPSHOT,
  GITHUB_SNAPSHOT_UPDATED_AT,
  type GitHubRepoSnapshot,
} from './githubRepos.snapshot.ts'

export interface PortfolioKnowledgeBase {
  owner: {
    name: string
    githubUsername: string
    githubUrl: string
    website: string
    email: string
    location: string
    role: string
    summary: string
  }
  education: Array<{
    institution: string
    program: string
    highlights: string[]
  }>
  specialties: string[]
  techStack: {
    languages: string[]
    frameworksAndLibs: string[]
    databasesAndInfra: string[]
    aiAndWorkflow: string[]
    designAndAutomation: string[]
  }
  featuredHighlights: Array<{
    name: string
    roleOrContext: string
    summary: string
    url?: string
  }>
  repositoriesUpdatedAt: string
  repositories: GitHubRepoSnapshot[]
}

export const PORTFOLIO_KNOWLEDGE_BASE: PortfolioKnowledgeBase = {
  owner: {
    name: 'Gabriel Pinho',
    githubUsername: '@pinhogo',
    githubUrl: 'https://github.com/pinhogo',
    website: 'https://gabrielpinho.me',
    email: 'contato@gabrielpinho.me',
    location: 'Porto Alegre, RS — Brasil (UTC-03:00)',
    role: 'Engenheiro de Software em formação (PUCRS) | Full Stack & Orquestração Multiagente',
    summary:
      'Estudante de Bacharelado em Engenharia de Software na PUCRS com foco em desenvolvimento web Full Stack, APIs Backend, orquestração multiagente entre diferentes modelos e CLIs, código rastreável e de fácil manutenção para humanos e agentes, documentação, BDD, SDD e automação/design com Figma.',
  },
  education: [
    {
      institution: 'PUCRS — Pontifícia Universidade Católica do Rio Grande do Sul',
      program: 'Bacharelado em Engenharia de Software',
      highlights: [
        'Programação Orientada a Objetos (Java)',
        'Algoritmos e Estruturas de Dados I & II',
        'Projeto e Arquitetura de Software',
        'Programação de Sistemas em C (Software Básico)',
        'Programação Paralela e Distribuída',
        'Engenharia / Coleta de Dados e Inteligência Artificial',
      ],
    },
    {
      institution: 'AGES (PUCRS) — Agência Experimental de Engenharia de Software',
      program: 'Grupo de Estudos & Sprints Colaborativas',
      highlights: [
        'Desenvolvimento de sprints em equipe abrangendo frontend e backend web',
        'APIs REST com TypeScript, Node.js, Express, Prisma e MongoDB (Sprint 3)',
      ],
    },
  ],
  specialties: [
    'Orquestração multiagente integrando diferentes modelos e CLIs',
    'Familiaridade com Orca IDE e MCP (Model Context Protocol)',
    'Escrita de código rastreável, modular e legível tanto para humanos quanto para agentes de IA',
    'Metodologias SDD (Spec-Driven Development), BDD (Behavior-Driven Development) e documentação estruturada',
    'Gestão ágil e rastreabilidade ponta a ponta com GitHub Issues e quadros Kanban (GitHub Projects v2)',
    'Design de interfaces no Figma e desenvolvimento de scripts/automações para Figma',
  ],
  techStack: {
    languages: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Java', 'Go', 'C'],
    frameworksAndLibs: ['React', 'Vite', 'Tailwind CSS', 'Laravel 11', 'Node.js', 'Express.js', 'Prisma'],
    databasesAndInfra: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Docker', 'GitHub Actions', 'Linux/Arch'],
    aiAndWorkflow: ['Orquestração Multiagente', 'MCP (Model Context Protocol)', 'Orca IDE', 'CLIs de IA', 'BDD', 'SDD', 'GitHub Issues & Kanban'],
    designAndAutomation: ['Figma (UI/Design Systems)', 'Scripts e automações para Figma'],
  },
  featuredHighlights: [
    {
      name: 'kirocrew-github-projects',
      roleOrContext: 'Ferramenta Open Source (MIT)',
      summary:
        'App nativo de Kanban e tabela de issues para GitHub Projects v2 integrado à gh CLI, backend Python sem dependências externas com verificação HMAC, além de agente de IA e skill inclusos.',
      url: 'https://github.com/pinhogo/kirocrew-github-projects',
    },
    {
      name: 'assinart_v1-back / assin.art',
      roleOrContext: 'Backend API & Plataforma de Assinaturas/Links',
      summary:
        'API RESTful em PHP 8.2, Laravel 11 e Sanctum com reserva de username, perfis públicos com eager loading, rastreamento atômico HTTP 302, documentação e testes PHPUnit.',
      url: 'https://github.com/pinhogo/assinart_v1-back',
    },
    {
      name: 'gabrielpinho.me',
      roleOrContext: 'Portfólio OS & Jardim Digital',
      summary:
        'Portfólio interativo em React 19, TypeScript e Tailwind CSS v4 com estética Frutiger Aero / Aqua OS, componentes reutilizáveis (OsWindow/WindowHeader) e assistente CLI alimentado por Gemini API.',
      url: 'https://github.com/pinhogo/gabrielpinho.me',
    },
    {
      name: 'Sprint3 (AGES PUCRS)',
      roleOrContext: 'Backend REST API',
      summary:
        'API REST para plataforma de filmes desenvolvida em TypeScript, Node.js, Express, Prisma e MongoDB no grupo de estudos AGES.',
      url: 'https://github.com/pinhogo/Sprint3',
    },
  ],
  repositoriesUpdatedAt: GITHUB_SNAPSHOT_UPDATED_AT,
  repositories: GITHUB_REPOS_SNAPSHOT,
}

/**
 * Serializa a base de conhecimento em um contexto compacto e estruturado para o System Prompt.
 */
export function formatKnowledgeContext(kb: PortfolioKnowledgeBase = PORTFOLIO_KNOWLEDGE_BASE): string {
  const repoLines = kb.repositories
    .map(
      (repo) =>
        `- ${repo.name} (${repo.language ?? 'N/A'}): ${repo.description || 'Repositório público no GitHub.'} [${repo.url}]`,
    )
    .join('\n')

  const eduLines = kb.education
    .map((edu) => `- ${edu.program} — ${edu.institution}: ${edu.highlights.join('; ')}`)
    .join('\n')

  const specLines = kb.specialties.map((item) => `- ${item}`).join('\n')

  return [
    `PERFIL: ${kb.owner.name} (${kb.owner.githubUsername})`,
    `CARGO/FOCO: ${kb.owner.role}`,
    `LOCALIZAÇÃO: ${kb.owner.location}`,
    `CONTATO: Site ${kb.owner.website} | E-mail ${kb.owner.email} | GitHub ${kb.owner.githubUrl}`,
    `RESUMO: ${kb.owner.summary}`,
    '',
    'FORMAÇÃO & EXPERIÊNCIA ACADÊMICA:',
    eduLines,
    '',
    'ESPECIALIDADES & FORMA DE TRABALHO:',
    specLines,
    '',
    'STACK TÉCNICA:',
    `- Linguagens: ${kb.techStack.languages.join(', ')}`,
    `- Frameworks & Bibliotecas: ${kb.techStack.frameworksAndLibs.join(', ')}`,
    `- Bancos de Dados & Infra: ${kb.techStack.databasesAndInfra.join(', ')}`,
    `- IA, Processos & Engenharia: ${kb.techStack.aiAndWorkflow.join(', ')}`,
    `- Design & Automação: ${kb.techStack.designAndAutomation.join(', ')}`,
    '',
    `REPOSITÓRIOS PÚBLICOS NO GITHUB (snapshot de ${kb.repositoriesUpdatedAt}):`,
    repoLines,
  ].join('\n')
}
