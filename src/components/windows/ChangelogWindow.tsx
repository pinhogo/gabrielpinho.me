import { Fragment, useMemo, useState } from 'react'
import { NOTE_CATEGORIES } from '../../data/changelog'
import type { LearningNote, NoteCategory } from '../../types/portfolio'
import { OsWindow, StatusOrb } from '../ui'
import type { WindowControlProps } from './IdentityWindow'

export interface ChangelogWindowProps extends WindowControlProps {
  notes: LearningNote[]
  globalSearchQuery?: string
}

/**
 * Janela 05 / CHANGELOG OF LEARNING — tabela interativa com filtros e maturidade.
 */
export function ChangelogWindow({
  notes,
  globalSearchQuery = '',
  className = '',
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: ChangelogWindowProps) {
  const [activeCategory, setActiveCategory] = useState<NoteCategory>('Todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredNotes = useMemo(() => {
    const query = globalSearchQuery.trim().toLowerCase()
    return notes.filter((note) => {
      const matchesCategory =
        activeCategory === 'Todos' || note.category === activeCategory
      const matchesQuery =
        !query ||
        `${note.title} ${note.related} ${note.maturityLabel} ${note.summary}`
          .toLowerCase()
          .includes(query)
      return matchesCategory && matchesQuery
    })
  }, [notes, activeCategory, globalSearchQuery])

  return (
    <OsWindow
      id="jardim"
      title="05 / CHANGELOG OF LEARNING"
      purpose="window-changelog"
      className={className}
      bodyClassName="p-4 flex-1 flex flex-col justify-between"
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div>
        {/* Title & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight drop-shadow">
            Notas Recentes &amp; Aprendizados em Público
          </h2>

          <div
            className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code"
            role="tablist"
            aria-label="Filtrar notas por categoria"
          >
            {NOTE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-2.5 py-0.5 rounded transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-200 text-cyan-950 font-bold shadow-sm'
                      : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Learning Notes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" data-purpose="notes-data-table">
            <thead>
              <tr className="border-b border-cyan-500/30 text-[10px] font-mono-code text-cyan-300/80 uppercase tracking-wider">
                <th className="py-1.5 px-2 font-medium">Maturidade</th>
                <th className="py-1.5 px-3 font-medium">Nota / Artigo</th>
                <th className="py-1.5 px-3 font-medium">Relacionado</th>
                <th className="py-1.5 px-2 font-medium">Atualizado</th>
                <th className="py-1.5 px-1 font-medium text-right">
                  <span className="sr-only">Detalhes</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/15 font-mono-code text-[11px]">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-cyan-300/75">
                    Nenhuma nota encontrada para o filtro atual.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => {
                  const isExpanded = expandedId === note.id
                  return (
                    <Fragment key={note.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : note.id)}
                        className="hover:bg-cyan-800/20 transition-colors cursor-pointer"
                      >
                        <td className="py-2 px-2 whitespace-nowrap">
                          <StatusOrb
                            variant={note.maturity}
                            label={note.maturityLabel}
                            size="md"
                            className="font-semibold"
                          />
                        </td>
                        <td className="py-2 px-3 text-white font-sans text-xs font-medium">
                          {note.title}
                        </td>
                        <td className="py-2 px-3 text-cyan-300/80 whitespace-nowrap">
                          {note.related}
                        </td>
                        <td className="py-2 px-2 text-cyan-200/60 whitespace-nowrap">
                          {note.updatedAt}
                        </td>
                        <td className="py-2 px-1 text-right text-cyan-400">
                          {isExpanded ? '−' : '···'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-cyan-950/50">
                          <td colSpan={5} className="px-3 py-2 text-[11px] font-sans text-cyan-100/85">
                            {note.summary}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </OsWindow>
  )
}
