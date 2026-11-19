import { useEffect, useRef, useState } from 'react'
import {
  BackgroundAtmosphere,
  SystemStatusBar,
  TopNavBar,
} from './components/layout'
import {
  AiAssistantWindow,
  ChangelogWindow,
  IdentityWindow,
  ProjectsWindow,
  ResourcesWindow,
} from './components/windows'
import { LEARNING_NOTES } from './data/changelog'
import { IDENTITY_PROFILE } from './data/profile'
import { PORTFOLIO_PROJECTS } from './data/projects'
import { RESOURCE_ITEMS } from './data/resources'
import type { NavSectionId, WindowId } from './types/portfolio'

const DEFAULT_MINIMIZED: Record<WindowId, boolean> = {
  identity: false,
  projects: false,
  assistant: false,
  changelog: false,
  resources: false,
}

const DEFAULT_HIDDEN: Record<WindowId, boolean> = {
  identity: false,
  projects: false,
  assistant: false,
  changelog: false,
  resources: false,
}

export function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('jardim')
  const [searchQuery, setSearchQuery] = useState('')
  const [minimized, setMinimized] = useState<Record<WindowId, boolean>>(DEFAULT_MINIMIZED)
  const [hidden, setHidden] = useState<Record<WindowId, boolean>>(DEFAULT_HIDDEN)
  const [maximizedWindow, setMaximizedWindow] = useState<WindowId | null>(null)

  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Atalhos globais: ⌘K / Ctrl+K foca busca; Esc limpa busca e restaura janela maximizada
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (event.key === 'Escape') {
        setSearchQuery('')
        setMaximizedWindow(null)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleMinimize = (id: WindowId) => {
    setMinimized((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleMaximize = (id: WindowId) => {
    setMinimized((prev) => ({ ...prev, [id]: false }))
    setMaximizedWindow((prev) => (prev === id ? null : id))
  }

  const closeWindow = (id: WindowId) => {
    setHidden((prev) => ({ ...prev, [id]: true }))
    if (maximizedWindow === id) {
      setMaximizedWindow(null)
    }
  }

  const restoreAllWindows = () => {
    setHidden(DEFAULT_HIDDEN)
    setMinimized(DEFAULT_MINIMIZED)
    setMaximizedWindow(null)
  }

  const hiddenCount = Object.values(hidden).filter(Boolean).length

  const isVisible = (id: WindowId) =>
    !hidden[id] && (maximizedWindow === null || maximizedWindow === id)

  const spanClass = (id: WindowId, defaultSpan: string) =>
    maximizedWindow === id ? 'lg:col-span-12' : defaultSpan

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-cyan-400 selection:text-black pb-1">
      <BackgroundAtmosphere />

      <TopNavBar
        profile={IDENTITY_PROFILE}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
      />

      {/* Main Bento Desktop Canvas */}
      <main
        className="relative z-10 flex-1 max-w-[1720px] w-full mx-auto p-3.5 md:p-5 flex flex-col gap-4 justify-between"
        data-purpose="os-canvas"
      >
        {/* Top Row: 01 Identity (3) | 03 Projetos (6) | 02 AI Terminal Assistant (3) */}
        {(isVisible('identity') || isVisible('projects') || isVisible('assistant')) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {isVisible('identity') && (
              <IdentityWindow
                profile={IDENTITY_PROFILE}
                onSelectTag={(tag) => setSearchQuery(tag)}
                className={spanClass('identity', 'lg:col-span-3')}
                isMinimized={minimized.identity}
                isMaximized={maximizedWindow === 'identity'}
                onMinimize={() => toggleMinimize('identity')}
                onMaximize={() => toggleMaximize('identity')}
                onClose={() => closeWindow('identity')}
              />
            )}

            {isVisible('projects') && (
              <ProjectsWindow
                projects={PORTFOLIO_PROJECTS}
                githubUrl={IDENTITY_PROFILE.githubUrl}
                globalSearchQuery={searchQuery}
                className={spanClass('projects', 'lg:col-span-6')}
                isMinimized={minimized.projects}
                isMaximized={maximizedWindow === 'projects'}
                onMinimize={() => toggleMinimize('projects')}
                onMaximize={() => toggleMaximize('projects')}
                onClose={() => closeWindow('projects')}
              />
            )}

            {isVisible('assistant') && (
              <AiAssistantWindow
                className={spanClass('assistant', 'lg:col-span-3')}
                isMinimized={minimized.assistant}
                isMaximized={maximizedWindow === 'assistant'}
                onMinimize={() => toggleMinimize('assistant')}
                onMaximize={() => toggleMaximize('assistant')}
                onClose={() => closeWindow('assistant')}
              />
            )}
          </div>
        )}

        {/* Bottom Row: 05 Changelog of Learning (8) | 04 Resources (4) */}
        {(isVisible('changelog') || isVisible('resources')) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {isVisible('changelog') && (
              <ChangelogWindow
                notes={LEARNING_NOTES}
                globalSearchQuery={searchQuery}
                className={spanClass('changelog', 'lg:col-span-8')}
                isMinimized={minimized.changelog}
                isMaximized={maximizedWindow === 'changelog'}
                onMinimize={() => toggleMinimize('changelog')}
                onMaximize={() => toggleMaximize('changelog')}
                onClose={() => closeWindow('changelog')}
              />
            )}

            {isVisible('resources') && (
              <ResourcesWindow
                resources={RESOURCE_ITEMS}
                className={spanClass('resources', 'lg:col-span-4')}
                isMinimized={minimized.resources}
                isMaximized={maximizedWindow === 'resources'}
                onMinimize={() => toggleMinimize('resources')}
                onMaximize={() => toggleMaximize('resources')}
                onClose={() => closeWindow('resources')}
              />
            )}
          </div>
        )}

        {hiddenCount === 5 && (
          <div className="flex-1 flex items-center justify-center">
            <button
              type="button"
              onClick={restoreAllWindows}
              className="cartridge-btn px-4 py-2 rounded-full text-xs font-mono-code text-white cursor-pointer"
            >
              Restaurar desktop (5 janelas ocultas)
            </button>
          </div>
        )}
      </main>

      <SystemStatusBar
        profile={IDENTITY_PROFILE}
        hiddenCount={hiddenCount}
        onRestoreWindows={restoreAllWindows}
      />
    </div>
  )
}

export default App
