import type { IdentityProfile } from '../../types/portfolio'

export interface SystemStatusBarProps {
  profile: IdentityProfile
  hiddenCount?: number
  onRestoreWindows?: () => void
}

/**
 * Barra de status inferior estilo Desktop OS com contatos, fuso e atalhos.
 */
export function SystemStatusBar({
  profile,
  hiddenCount = 0,
  onRestoreWindows,
}: SystemStatusBarProps) {
  return (
    <footer
      className="relative z-10 w-full px-4 py-1.5 border-t border-cyan-500/20 bg-[#041620]/90 backdrop-blur-md text-[11px] font-mono-code text-cyan-300 flex flex-wrap items-center justify-between gap-2 shadow-2xl"
      data-purpose="os-statusbar"
    >
      {/* Left: Systems status quote */}
      <div className="flex items-center space-x-2">
        <span className="text-cyan-200">[ {profile.brand} ]</span>
        <span className="text-emerald-400">all systems growing...</span>
        <span className="hidden sm:inline text-cyan-500/60">|</span>
        <span className="hidden sm:inline text-cyan-400/80">
          Built with curiosity, Cultivated in public.
        </span>
        {hiddenCount > 0 && onRestoreWindows && (
          <button
            type="button"
            onClick={onRestoreWindows}
            className="ml-2 px-2 py-0.5 rounded bg-cyan-900/70 hover:bg-cyan-800/80 border border-cyan-400/40 text-cyan-100 text-[10px] cursor-pointer transition"
          >
            Restaurar janelas ({hiddenCount})
          </button>
        )}
      </div>

      {/* Center: Email contact */}
      <div className="hidden md:flex items-center space-x-1">
        <a
          className="hover:text-cyan-100 underline decoration-cyan-500/50 transition-colors"
          href={`mailto:${profile.email}`}
        >
          {profile.email} →
        </a>
      </div>

      {/* Right: GitHub, PGP, Timezone, Keyboard controls */}
      <div className="flex items-center space-x-4">
        <a
          className="hover:text-white transition"
          href={profile.githubUrl}
          rel="noreferrer"
          target="_blank"
        >
          GitHub / {profile.githubHandle} →
        </a>
        <span className="text-cyan-400/90">PGP →</span>
        <span className="text-cyan-200/90">{profile.timezone}</span>
        <span className="hidden sm:inline text-[10px] bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-600/40 text-cyan-200">
          [JK] to navigate / [esc] to wander
        </span>
      </div>
    </footer>
  )
}
