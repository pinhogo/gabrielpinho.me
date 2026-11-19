export type WindowId = 'identity' | 'projects' | 'assistant' | 'changelog' | 'resources'

export type NavSectionId = 'projetos' | 'jardim' | 'docs'

export type OrbVariant = 'seed' | 'sprout' | 'evergreen' | 'concept' | 'dev' | 'prod'

export interface IdentityProfile {
  brand: string
  statusText: string
  institution: string
  name: string
  role: string
  bio: string
  stack: string[]
  cvUrl: string
  cvLabel: string
  githubHandle: string
  githubUrl: string
  email: string
  timezone: string
}

export type ProjectStage = 'concept' | 'dev' | 'prod'

export interface ProjectCodeLine {
  tokens: Array<{
    text: string
    tone?: 'comment' | 'keyword' | 'type' | 'field' | 'tag' | 'plain'
  }>
}

export interface ProjectItem {
  id: string
  tabLabel: string
  name: string
  subtitle: string
  description: string
  stage: ProjectStage
  stageLabel: string
  onlineStatus: string
  versionLabel: string
  uptimeLabel: string
  previewFile: string
  previewMeta: string
  codeLines: ProjectCodeLine[]
  highlights: string[]
  stack: string[]
  liveUrl: string
  repoUrl: string
}

export type NoteCategory = 'Todos' | 'PUCRS' | 'Tech' | 'Hardware/Eng' | 'Ensaios'

export type NoteMaturity = 'seed' | 'sprout' | 'evergreen'

export interface LearningNote {
  id: string
  maturity: NoteMaturity
  maturityLabel: 'Semente' | 'Broto' | 'Perene'
  title: string
  related: string
  category: Exclude<NoteCategory, 'Todos'>
  updatedAt: string
  summary: string
}

export interface ResourceItem {
  id: string
  filename: string
  description: string
  extension: string
  actionType: 'copy' | 'download'
  size: string
  copyPayload?: string
  downloadUrl?: string
}

export interface ChatMessage {
  id: string
  sender: 'system' | 'user' | 'assistant'
  content: string
  latencyMs?: number
}

export interface ChatQuickCommand {
  id: string
  command: string
  label: string
  prompt: string
}
