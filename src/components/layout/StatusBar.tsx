import { useEditorStore } from '../../store'

export function StatusBar() {
  const { activeTool, cursorX, cursorY, canvasWidth, canvasHeight, zoom, primaryColor, setZoom } = useEditorStore()

  return (
    <div className="flex items-center gap-4 px-3 h-6 bg-bg-elevated border-t border-border-subtle text-[10px] font-mono text-text-muted shrink-0">
      <span className="text-text-secondary capitalize">{activeTool}</span>
      <div className="w-px h-3 bg-border" />
      <span>
        {cursorX >= 0 ? `X: ${cursorX}  Y: ${cursorY}` : '—'}
      </span>
      <div className="w-px h-3 bg-border" />
      <span>{canvasWidth} × {canvasHeight}</span>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button onClick={() => setZoom(zoom - 1)} className="hover:text-text-primary">−</button>
        <span className="text-text-secondary w-10 text-center">{zoom * 100}%</span>
        <button onClick={() => setZoom(zoom + 1)} className="hover:text-text-primary">+</button>
      </div>
      <div className="w-px h-3 bg-border" />
      <span style={{ color: primaryColor }}>{primaryColor}</span>
    </div>
  )
}
