import { ChevronDown } from 'lucide-react'
import { useEditorStore } from '../../store'
import { ColorPicker } from '../color/ColorPicker'
import { PaletteGrid } from '../color/PaletteGrid'
export function RightPanel() {
  const { setOpenModal } = useEditorStore()

  return (
    <div className="flex flex-col w-[220px] bg-bg-surface border-l border-border-subtle shrink-0 overflow-y-auto">
      {/* Color section */}
      <div className="border-b border-border-subtle">
        <div className="flex items-center h-8 px-3 border-b border-border-subtle">
          <span className="text-[10px] font-semibold text-text-muted tracking-wider">COLOR</span>
        </div>
        <ColorPicker />
      </div>

      {/* Palette section */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center h-8 px-3 border-b border-border-subtle border-t border-border-subtle">
          <span className="text-[10px] font-semibold text-text-muted tracking-wider flex-1">PALETTE</span>
          <button
            onClick={() => setOpenModal('palette-manager')}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <PaletteGrid />
      </div>
    </div>
  )
}
