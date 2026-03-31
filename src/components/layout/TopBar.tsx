import { useEditorStore } from '../../store'
import { LayoutGrid } from 'lucide-react'

export function TopBar() {
  const { zoom, canvasWidth, canvasHeight, setOpenModal, showGrid, toggleGrid } = useEditorStore()

  return (
    <div className="flex items-stretch h-10 bg-bg-surface border-b border-border-subtle shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 border-r border-border-subtle">
        <div className="w-5 h-5 rounded bg-accent" />
        <span className="text-text-primary text-[13px] font-semibold font-[var(--font-ui)]">PixelArt</span>
      </div>

      {/* Menus */}
      <div className="flex items-stretch">
        <button
          onClick={() => setOpenModal('new-project')}
          className="px-3 text-text-secondary text-[12px] hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          File
        </button>
        <button
          onClick={() => setOpenModal('export')}
          className="px-3 text-text-secondary text-[12px] hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          Export
        </button>
        <button
          onClick={() => setOpenModal('palette-manager')}
          className="px-3 text-text-secondary text-[12px] hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          Palette
        </button>
      </div>

      <div className="flex-1" />

      {/* View controls */}
      <div className="flex items-center gap-2 px-3 border-l border-border-subtle">
        <span className="text-text-secondary text-[11px] font-mono">{zoom * 100}%</span>
        <button
          onClick={toggleGrid}
          title="Toggle grid"
          className={`flex items-center justify-center w-7 h-6 rounded transition-colors ${
            showGrid ? 'bg-accent text-white' : 'bg-bg-elevated hover:bg-border text-text-secondary'
          }`}
        >
          <LayoutGrid size={14} />
        </button>
      </div>

      {/* Canvas info */}
      <div className="flex items-center gap-2 px-3 border-l border-border-subtle">
        <span className="text-text-muted text-[11px] font-mono">{canvasWidth} × {canvasHeight}</span>
      </div>
    </div>
  )
}
