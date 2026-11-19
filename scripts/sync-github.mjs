#!/usr/bin/env node
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const GITHUB_USER = process.env.GITHUB_USERNAME || 'pinhogo'
const OUTPUT_PATH = resolve(process.cwd(), 'src/data/githubRepos.snapshot.ts')

async function syncGitHubRepos() {
  const url = `https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/repos?type=owner&sort=updated&per_page=30`
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'gabrielpinho-me-sync',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`GitHub API retornou HTTP ${response.status}: ${await response.text()}`)
  }

  const rawRepos = await response.json()
  const repos = rawRepos
    .filter((repo) => !repo.private && !repo.fork)
    .map((repo) => ({
      name: String(repo.name),
      url: String(repo.html_url),
      language: repo.language ? String(repo.language) : null,
      description: repo.description ? String(repo.description).trim() : '',
      updatedAt: String(repo.updated_at || '').slice(0, 10),
    }))

  const today = new Date().toISOString().slice(0, 10)
  const fileContent = `/**
 * Snapshot dos repositórios públicos do GitHub (@${GITHUB_USER}).
 * Atualize automaticamente rodando: \`npm run sync:github\`
 */
export interface GitHubRepoSnapshot {
  name: string
  url: string
  language: string | null
  description: string
  updatedAt: string
}

export const GITHUB_SNAPSHOT_UPDATED_AT = ${JSON.stringify(today)}

export const GITHUB_REPOS_SNAPSHOT: GitHubRepoSnapshot[] = ${JSON.stringify(repos, null, 2)}
`

  await writeFile(OUTPUT_PATH, fileContent, 'utf8')
  console.log(`Snapshot atualizado com ${repos.length} repositórios públicos em ${OUTPUT_PATH}`)
}

syncGitHubRepos().catch((error) => {
  console.error('Falha ao sincronizar repositórios do GitHub:', error)
  process.exitCode = 1
})
