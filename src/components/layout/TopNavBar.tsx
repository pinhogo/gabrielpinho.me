import type { RefObject } from 'react'
import type { IdentityProfile, NavSectionId } from '../../types/portfolio'

export interface TopNavBarProps {
  profile: IdentityProfile
  activeSection: NavSectionId
  onSelectSection: (section: NavSectionId) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  searchInputRef: RefObject<HTMLInputElement | null>
}

const NAV_LINKS: Array<{ id: NavSectionId; label: string; href: string }> = [
  { id: 'projetos', label: 'projetos', href: '#projetos' },
  { id: 'jardim', label: 'jardim', href: '#jardim' },
  { id: 'docs', label: 'docs', href: '#docs' },
]

/**
 * Barra superior estilo OS Desktop com status online, navegação, busca ⌘K e GitHub.
 */
export function TopNavBar({
  profile,
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
  searchInputRef,
}: TopNavBarProps) {
  return (
    <header
      className="relative z-20 w-full px-4 py-2 border-b border-cyan-500/25 bg-[#072433]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs tracking-wide shadow-lg"
      data-purpose="os-topbar"
    >
      {/* Brand / Identity status */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-semibold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          {profile.brand}
        </span>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
          />
          <span className="text-[11px] text-cyan-200 font-medium">{profile.statusText}</span>
        </div>
        <span className="text-cyan-500/70">/</span>
        <span className="text-cyan-300/90 font-mono-code">{profile.institution}</span>
      </div>

      {/* Center Navigation Links */}
      <nav
        aria-label="Navegação principal"
        className="hidden md:flex items-center space-x-6 text-cyan-200 font-mono-code text-xs"
      >
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id
          return (
            <a
              key={link.id}
              href={link.href}
              onClick={() => onSelectSection(link.id)}
              className={`transition-colors duration-150 flex items-center gap-1 ${
                isActive
                  ? 'text-white font-medium border-b border-cyan-400 pb-0.5'
                  : 'hover:text-white'
              }`}
            >
              <span className="text-cyan-500">/</span> {link.label}
            </a>
          )
        })}
      </nav>

      {/* Top Right: Spotlight Search & GitHub handle */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center">
          <span
            aria-hidden="true"
            className="absolute left-2.5 text-[10px] text-cyan-400/80 font-mono-code font-bold pointer-events-none"
          >
            ⌘K
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Buscar notas, docs e stack"
            placeholder="Search notes, docs, stack..."
            className="bg-[#041a25]/90 border border-cyan-600/40 rounded-full pl-8 pr-3 py-1 text-xs text-cyan-100 placeholder-cyan-500/70 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 w-44 sm:w-52 md:w-64 transition-all"
          />
        </div>

        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/30 text-cyan-200 text-xs transition"
        >
          <svg
            className="w-3.5 h-3.5 fill-current text-cyan-300 shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="font-mono-code text-[11px]">GitHub / {profile.githubHandle}</span>
        </a>
      </div>
    </header>
  )
}
