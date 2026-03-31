import { X } from 'lucide-react'
import { useEditorStore } from '../../store'
import { PALETTES } from '../../data/palettes'

export function PaletteManagerModal() {
  const { setOpenModal, activePalette } = useEditorStore()

  const applyPalette = (colors: string[]) => {
    useEditorStore.setState({ activePalette: colors })
    setOpenModal(null)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpenModal(null)} />
      <div className="relative flex flex-col w-[560px] max-h-[80vh] rounded-lg bg-bg-surface shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center h-13 px-5 border-b border-border-subtle shrink-0">
          <span className="flex-1 text-text-primary text-[14px] font-semibold">Palette Manager</span>
          <button onClick={() => setOpenModal(null)} className="flex items-center justify-center w-7 h-7 rounded-md bg-bg-elevated text-text-secondary hover:text-text-primary">
            <X size={14} />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col overflow-y-auto">
          <div className="flex items-center h-8 px-4 border-b border-border-subtle">
            <span className="text-[10px] font-semibold text-text-muted tracking-wider">PALETTES</span>
          </div>
          {Object.entries(PALETTES).map(([key, { name, colors }]) => {
            const isActive = colors === activePalette || JSON.stringify(colors) === JSON.stringify(activePalette)
            return (
              <div key={key} className="flex items-center gap-3 h-13 px-4 border-b border-border-subtle">
                {/* Color strip */}
                <div className="flex gap-0.5">
                  {colors.slice(0, 8).map(c => (
                    <div key={c} className="w-4 h-4 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-semibold text-text-primary">{name}</div>
                  <div className="text-[11px] text-text-muted">{colors.length} colors</div>
                </div>
                <button
                  onClick={() => applyPalette(colors)}
                  className={`h-7 px-3 rounded-md text-[10px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {isActive ? 'Active' : 'Apply'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-4 border-t border-border-subtle shrink-0">
          <button onClick={() => setOpenModal(null)}
            className="h-9 px-5 rounded-md bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
