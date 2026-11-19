import { useMemo, useState } from 'react'
import { REPO_SUMMARY_LABEL } from '../../data/projects'
import type { ProjectCodeLine, ProjectItem } from '../../types/portfolio'
import { AquaPill, CartridgeButton, OsWindow, StatusOrb, TerminalSurface } from '../ui'
import type { WindowControlProps } from './IdentityWindow'

export interface ProjectsWindowProps extends WindowControlProps {
  projects: ProjectItem[]
  githubUrl: string
  globalSearchQuery?: string
}

const TOKEN_COLOR_CLASSES: Record<
  NonNullable<ProjectCodeLine['tokens'][number]['tone']>,
  string
> = {
  comment: 'text-cyan-500/80',
  keyword: 'text-cyan-300 font-semibold',
  type: 'text-emerald-300',
  field: 'text-cyan-100',
  tag: 'text-amber-200/90',
  plain: 'text-cyan-200/90',
}

/**
 * Janela 03 / PROJETOS & EXPERIMENTOS // PORTFÓLIO — abas, busca, Code Preview e Inspector.
 */
export function ProjectsWindow({
  projects,
  githubUrl,
  globalSearchQuery = '',
  className = '',
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: ProjectsWindowProps) {
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id ?? '')
  const [localQuery, setLocalQuery] = useState('')

  const activeQuery = (localQuery || globalSearchQuery).trim().toLowerCase()

  const filteredProjects = useMemo(() => {
    if (!activeQuery) return projects
    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.subtitle,
        project.description,
        ...project.stack,
        ...project.highlights,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(activeQuery)
    })
  }, [projects, activeQuery])

  const selectedProject =
    filteredProjects.find((p) => p.id === selectedId) ??
    filteredProjects[0] ??
    projects[0]

  return (
    <OsWindow
      id="projetos"
      title="03 / PROJETOS & EXPERIMENTOS // PORTFÓLIO"
      purpose="window-projects"
      className={className}
      bodyClassName="p-3.5 flex-1 flex flex-col justify-between"
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col">
        {/* Heading + Project Tabs */}
        <div className="pb-2 border-b border-cyan-500/20 space-y-2">
          <h2 className="text-base font-bold text-white tracking-tight drop-shadow">
            Projetos em Destaque <span className="text-cyan-400">//</span> Sistemas &amp; Arquitetura
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-mono-code text-cyan-300">
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedProject?.id
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className={`cursor-pointer transition ${
                    isSelected
                      ? 'text-white bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-400/40'
                      : 'hover:text-white px-1 py-0.5'
                  }`}
                >
                  {isSelected ? `[ ${project.tabLabel} ]` : project.tabLabel}
                </button>
              )
            })}

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white text-cyan-300/90 transition ml-auto"
            >
              Ver Todos (GitHub) ↗
            </a>
          </div>
        </div>

        {/* Search Input + Public Repo Counter */}
        <div className="py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-cyan-300">
          <label className="flex items-center space-x-2 flex-1 min-w-[200px]">
            <span className="text-cyan-400" aria-hidden="true">
              ⌕
            </span>
            <input
              type="text"
              value={localQuery}
              onChange={(event) => setLocalQuery(event.target.value)}
              placeholder="Buscar projeto por tecnologia ou palavra-chave..."
              className="w-full bg-transparent text-cyan-100 placeholder-cyan-200/70 text-[11px] focus:outline-none"
            />
          </label>

          <div className="text-[11px] text-cyan-300/80 shrink-0">
            {activeQuery
              ? `${filteredProjects.length} / ${projects.length} projetos filtrados`
              : REPO_SUMMARY_LABEL}
          </div>
        </div>

        {/* Split Viewport: Code Preview (Left) + Inspector (Right) */}
        {selectedProject ? (
          <div className="relative flex-1 min-h-[250px] rounded-lg bg-[#021822]/85 border border-cyan-600/30 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Code Preview Pane */}
            <div className="md:col-span-7 flex flex-col justify-between p-2.5 bg-[#01131d]/90">
              <TerminalSurface
                className="flex-1 flex flex-col border-cyan-700/40 bg-[#011018]/90"
                bodyClassName="p-3 flex-1 flex flex-col justify-between"
                leftLabel={
                  <span className="inline-flex items-center gap-1.5 text-cyan-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shrink-0" />
                    <span className="truncate">{selectedProject.previewFile}</span>
                  </span>
                }
                rightLabel={
                  <span className="text-cyan-400/80 text-[9px]">{selectedProject.previewMeta}</span>
                }
              >
                <pre className="text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap my-1">
                  <code>
                    {selectedProject.codeLines.map((line, lineIdx) => (
                      <div key={lineIdx}>
                        {line.tokens.map((token, tokenIdx) => (
                          <span
                            key={tokenIdx}
                            className={TOKEN_COLOR_CLASSES[token.tone ?? 'plain']}
                          >
                            {token.text}
                          </span>
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>

                {/* Bottom Architecture Tags */}
                <div className="mt-3 pt-2 border-t border-cyan-900/50 flex flex-wrap items-center gap-1.5">
                  {selectedProject.highlights.map((highlight, idx) => (
                    <AquaPill key={highlight} variant="badge" className="text-[9px]">
                      {idx === 0 ? (
                        <StatusOrb variant={selectedProject.stage} size="xs" />
                      ) : (
                        <span className="text-cyan-400">●</span>
                      )}
                      <span>{highlight}</span>
                    </AquaPill>
                  ))}
                </div>
              </TerminalSurface>
            </div>

            {/* Project Inspector Pane */}
            <div
              className="md:col-span-5 bg-[#031d2a]/90 border-t md:border-t-0 md:border-l border-cyan-500/30 p-3 flex flex-col justify-between text-xs"
              data-purpose="project-inspector"
            >
              <div>
                <div className="flex items-start justify-between gap-2 text-[9px] font-mono-code uppercase tracking-wider text-cyan-400/90 pb-1.5 border-b border-cyan-500/20">
                  <span>Inspector / Projeto Selecionado</span>
                  <span className="text-emerald-300 font-semibold shrink-0">
                    {selectedProject.onlineStatus}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedProject.name}
                  </h3>
                  <p className="text-[11px] font-mono-code text-cyan-300/90 mt-0.5 leading-snug">
                    {selectedProject.subtitle}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-cyan-100/80">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Stack Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedProject.stack.map((tech) => (
                    <AquaPill key={tech} variant="compact">
                      {tech}
                    </AquaPill>
                  ))}
                </div>

                {/* Inspector CTAs */}
                <div className="mt-3.5 grid grid-cols-2 gap-1.5">
                  <CartridgeButton
                    variant="cartridge"
                    size="sm"
                    href={selectedProject.liveUrl}
                    target="_blank"
                    className="text-[10px] py-1.5 text-center leading-tight"
                  >
                    Acessar Projeto ↗
                  </CartridgeButton>
                  <CartridgeButton
                    variant="secondary"
                    size="sm"
                    href={selectedProject.repoUrl}
                    target="_blank"
                    className="text-[10px] py-1.5 text-center leading-tight"
                  >
                    Ver no GitHub
                  </CartridgeButton>
                </div>
              </div>

              {/* Inspector Footer Status */}
              <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[9px] font-mono-code text-cyan-300/90">
                <StatusOrb
                  variant={selectedProject.stage}
                  label={selectedProject.versionLabel}
                  size="xs"
                />
                <span className="text-cyan-400/90">{selectedProject.uptimeLabel}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-[200px] rounded-lg bg-[#021822]/80 border border-cyan-600/30 flex items-center justify-center font-mono-code text-xs text-cyan-300/80 p-4">
            Nenhum projeto encontrado para &quot;{activeQuery}&quot;.
          </div>
        )}
      </div>

      {/* Bottom Legend Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-cyan-300/90 pt-1">
        <div className="flex items-center space-x-4">
          <StatusOrb variant="concept" label="Conceito" size="sm" />
          <StatusOrb variant="dev" label="Em Dev" size="sm" />
          <StatusOrb variant="prod" label="Produção" size="sm" />
        </div>
        <div className="text-[10px] uppercase tracking-wider text-cyan-400/70">
          PORTFOLIO HIGHLIGHTS // CI/CD VERIFIED
        </div>
      </div>
    </OsWindow>
  )
}
