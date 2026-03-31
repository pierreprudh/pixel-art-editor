import { Pencil, Eraser, PaintBucket, Pipette, Minus, Square, Circle } from 'lucide-react'
import { useEditorStore } from '../../store'
import type { ToolName } from '../../tools/types'

interface ToolBtn { tool: ToolName; icon: React.ReactNode; title: string }

const TOOL_GROUPS: ToolBtn[][] = [
  [
    { tool: 'pencil',     icon: <Pencil size={16} />,      title: 'Pencil (B)' },
    { tool: 'eraser',     icon: <Eraser size={16} />,      title: 'Eraser (E)' },
    { tool: 'fill',       icon: <PaintBucket size={16} />, title: 'Fill (G)' },
    { tool: 'eyedropper', icon: <Pipette size={16} />,     title: 'Eyedropper (I)' },
  ],
  [
    { tool: 'line',    icon: <Minus size={16} />,  title: 'Line (L)' },
    { tool: 'rect',    icon: <Square size={16} />, title: 'Rectangle (U)' },
    { tool: 'ellipse', icon: <Circle size={16} />, title: 'Ellipse (O)' },
  ],
]

export function ToolBar() {
  const { activeTool, setActiveTool } = useEditorStore()

  return (
    <div className="flex flex-col items-center gap-0.5 py-2 w-12 bg-bg-surface border-r border-border-subtle shrink-0 overflow-y-auto">
      {TOOL_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col items-center gap-0.5 w-full">
          {gi > 0 && <div className="w-7 h-px bg-border-subtle my-1" />}
          {group.map(({ tool, icon, title }) => (
            <button
              key={tool}
              title={title}
              onClick={() => setActiveTool(tool)}
              className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                activeTool === tool
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
