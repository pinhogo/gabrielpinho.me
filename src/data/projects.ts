import type { ProjectItem } from '../types/portfolio'

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'assin-art',
    tabLabel: 'assin.art',
    name: 'assin.art',
    subtitle: 'Plataforma de Gestão & Assinaturas Digitais',
    description:
      'Plataforma focada em integridade, fluxo de trabalho ágil e conformidade jurídica para autenticação e assinatura de documentos digitais.',
    stage: 'prod',
    stageLabel: 'Em Produção',
    onlineStatus: 'ONLINE',
    versionLabel: 'Ativo / v2.4',
    uptimeLabel: '99.9% Uptime',
    previewFile: 'preview :: assin.art / architecture.go',
    previewMeta: 'UTF-8 // Go 1.22',
    codeLines: [
      {
        tokens: [
          {
            text: '// Core pipeline: Digital signatures & audit verification',
            tone: 'comment',
          },
        ],
      },
      {
        tokens: [
          { text: 'type ', tone: 'keyword' },
          { text: 'DocumentAudit', tone: 'type' },
          { text: ' struct {', tone: 'plain' },
        ],
      },
      {
        tokens: [
          { text: '  DocumentID ', tone: 'field' },
          { text: 'string', tone: 'type' },
          { text: ' `json:"doc_id"`', tone: 'tag' },
        ],
      },
      {
        tokens: [
          { text: '  Signer     ', tone: 'field' },
          { text: 'string', tone: 'type' },
          { text: ' `json:"signer"`', tone: 'tag' },
        ],
      },
      {
        tokens: [
          { text: '  Fingerprint ', tone: 'field' },
          { text: '[32]byte', tone: 'type' },
          { text: ' `json:"sha256"`', tone: 'tag' },
        ],
      },
      {
        tokens: [
          { text: '  Timestamp  ', tone: 'field' },
          { text: 'time.Time', tone: 'type' },
          { text: ' `json:"verified_at"`', tone: 'tag' },
        ],
      },
      {
        tokens: [{ text: '}', tone: 'plain' }],
      },
    ],
    highlights: ['Em Produção', 'High Throughput', 'TLS 1.3 / Sec'],
    stack: ['TypeScript', 'Go', 'Next.js', 'PostgreSQL', 'Docker'],
    liveUrl: 'https://github.com/pinhogo/assinart_v1-back',
    repoUrl: 'https://github.com/pinhogo/assinart_v1-back',
  },
  {
    id: 'ipe-saude-mis',
    tabLabel: 'IPÊ Saúde MIS',
    name: 'IPÊ Saúde MIS',
    subtitle: 'Sistema de Gestão & Inteligência Hospitalar',
    description:
      'Módulo de apoio à decisão clínica e gestão de fluxos assistenciais com foco em rastreabilidade, auditoria e baixa latência.',
    stage: 'dev',
    stageLabel: 'Em Dev',
    onlineStatus: 'STAGING',
    versionLabel: 'Beta / v1.3',
    uptimeLabel: '99.5% Uptime',
    previewFile: 'preview :: ipe-mis / telemetry.ts',
    previewMeta: 'UTF-8 // TS 5.8',
    codeLines: [
      {
        tokens: [
          { text: '// Clinical queue & SLA monitoring pipeline', tone: 'comment' },
        ],
      },
      {
        tokens: [
          { text: 'export interface ', tone: 'keyword' },
          { text: 'TriageEvent', tone: 'type' },
          { text: ' {', tone: 'plain' },
        ],
      },
      {
        tokens: [
          { text: '  unitId: ', tone: 'field' },
          { text: 'string', tone: 'type' },
        ],
      },
      {
        tokens: [
          { text: '  priority: ', tone: 'field' },
          { text: "'P0' | 'P1' | 'P2'", tone: 'tag' },
        ],
      },
      {
        tokens: [
          { text: '  slaWindowMs: ', tone: 'field' },
          { text: 'number', tone: 'type' },
        ],
      },
      {
        tokens: [{ text: '}', tone: 'plain' }],
      },
    ],
    highlights: ['Em Dev', 'RBAC / Audit', 'REST + SQL'],
    stack: ['TypeScript', 'PHP', 'Laravel', 'PostgreSQL', 'Docker'],
    liveUrl: 'https://github.com/pinhogo',
    repoUrl: 'https://github.com/pinhogo',
  },
  {
    id: 'garden-cli',
    tabLabel: 'Garden CLI',
    name: 'Garden CLI',
    subtitle: 'Indexador Local-First de Notas Markdown',
    description:
      'Transforma notas dispersas em Markdown num grafo pesquisável com índice invertido ultrarrápido e integração com agentes de IA.',
    stage: 'concept',
    stageLabel: 'Conceito',
    onlineStatus: 'LOCAL',
    versionLabel: 'Alpha / v0.8',
    uptimeLabel: '18.2ms Index',
    previewFile: 'preview :: garden-cli / indexer.go',
    previewMeta: 'UTF-8 // Go 1.22',
    codeLines: [
      {
        tokens: [
          { text: '// Local-first inverted index for public notes', tone: 'comment' },
        ],
      },
      {
        tokens: [
          { text: 'func ', tone: 'keyword' },
          { text: 'BuildGraph', tone: 'type' },
          { text: '(dir string) (*Index, error) {', tone: 'plain' },
        ],
      },
      {
        tokens: [
          { text: '  docs, err := ', tone: 'field' },
          { text: 'ScanMarkdown', tone: 'type' },
          { text: '(dir)', tone: 'plain' },
        ],
      },
      {
        tokens: [
          { text: '  return ', tone: 'keyword' },
          { text: 'NewSQLiteIndex', tone: 'type' },
          { text: '(docs), err', tone: 'plain' },
        ],
      },
      {
        tokens: [{ text: '}', tone: 'plain' }],
      },
    ],
    highlights: ['Conceito', 'Local-First', 'SQLite FTS5'],
    stack: ['Go', 'SQLite', 'TypeScript', 'MCP', 'CLI'],
    liveUrl: 'https://github.com/pinhogo/kirocrew-github-projects',
    repoUrl: 'https://github.com/pinhogo/kirocrew-github-projects',
  },
  {
    id: 'arch-dotfiles',
    tabLabel: 'Arch Dotfiles',
    name: 'Arch Dotfiles',
    subtitle: 'Ambiente Reprodutível Arch Linux & Shell Tooling',
    description:
      'Configurações versionadas para workstation Arch Linux, Zsh, Neovim, automação de setup e atalhos para fluxos multiagente via CLI.',
    stage: 'prod',
    stageLabel: 'Em Produção',
    onlineStatus: 'SYNCED',
    versionLabel: 'Rolling / 2026',
    uptimeLabel: '100% Reprodutível',
    previewFile: 'preview :: dotfiles / bootstrap.sh',
    previewMeta: 'UTF-8 // POSIX sh',
    codeLines: [
      {
        tokens: [
          { text: '#!/usr/bin/env bash', tone: 'comment' },
        ],
      },
      {
        tokens: [
          { text: 'set -euo pipefail', tone: 'keyword' },
        ],
      },
      {
        tokens: [
          { text: 'pacman -Syu --needed ', tone: 'field' },
          { text: 'git neovim zsh tmux fzf ripgrep', tone: 'tag' },
        ],
      },
      {
        tokens: [
          { text: 'stow ', tone: 'keyword' },
          { text: 'zsh nvim git-config ghostty', tone: 'type' },
        ],
      },
    ],
    highlights: ['Em Produção', 'GNU Stow', 'Zero Drift'],
    stack: ['Linux/Arch', 'Bash', 'Zsh', 'Neovim', 'Git'],
    liveUrl: 'https://github.com/pinhogo',
    repoUrl: 'https://github.com/pinhogo',
  },
]

export const REPO_SUMMARY_LABEL = '5 repos públicos / Go, TS & Web'
