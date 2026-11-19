/**
 * Camada atmosférica Frutiger Aero (scanlines sutis, feixes de luz aquáticos e bolhas).
 */
export function BackgroundAtmosphere() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      data-purpose="background-fx"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-15 aero-scanlines" />
      <div className="absolute -top-32 left-1/4 w-3/5 h-80 bg-cyan-400/10 blur-[90px] rounded-full transform rotate-12" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-400/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-12 left-10 w-4 h-4 rounded-full border border-cyan-200/40 bg-white/20 blur-[0.5px]" />
      <div className="absolute bottom-36 left-48 w-6 h-6 rounded-full border border-cyan-200/50 bg-cyan-100/20 blur-[0.5px]" />
      <div className="absolute top-20 right-32 w-8 h-8 rounded-full border border-cyan-300/40 bg-white/10 blur-[1px]" />
    </div>
  )
}
