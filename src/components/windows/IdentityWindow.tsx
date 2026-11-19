import type { IdentityProfile } from '../../types/portfolio'
import { AquaPill, CartridgeButton, OsWindow } from '../ui'

export interface WindowControlProps {
  className?: string
  isMinimized?: boolean
  isMaximized?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

export interface IdentityWindowProps extends WindowControlProps {
  profile: IdentityProfile
  onSelectTag?: (tag: string) => void
  onDownloadCv?: () => void
}

/**
 * Janela 01 / IDENTITY — apresentação principal, stack pills e CTA 3D Baixar CV.
 */
export function IdentityWindow({
  profile,
  onSelectTag,
  onDownloadCv,
  className = '',
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: IdentityWindowProps) {
  return (
    <OsWindow
      title="01 / IDENTITY"
      purpose="window-identity"
      className={className}
      bodyClassName="p-5 flex-1 flex flex-col justify-between"
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {profile.name}
        </h1>
        <p className="text-cyan-300 font-mono-code text-sm mt-0.5 tracking-normal">
          {profile.role}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-cyan-100/90 font-light drop-shadow">
          {profile.bio}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {profile.stack.map((tech) => (
            <AquaPill
              key={tech}
              variant="aqua"
              onClick={onSelectTag ? () => onSelectTag(tech) : undefined}
              className={tech === 'Linux/Arch' ? 'text-cyan-100' : ''}
            >
              {tech}
            </AquaPill>
          ))}
        </div>
      </div>

      {/* Hero Action Button: 3D Gel Pill 'Baixar CV' */}
      <div className="mt-8 pt-2">
        <CartridgeButton
          variant="gel"
          size="lg"
          href={onDownloadCv ? undefined : profile.cvUrl}
          onClick={onDownloadCv}
          className="w-full text-center"
        >
          {profile.cvLabel}
        </CartridgeButton>
      </div>
    </OsWindow>
  )
}
