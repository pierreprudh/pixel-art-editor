import { useState } from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '../../store'
import { CANVAS_PRESETS } from '../../data/presets'

export function NewProjectModal() {
  const { setOpenModal, newProject } = useEditorStore()
  const [width, setWidth] = useState(32)
  const [height, setHeight] = useState(32)
  const [bg, setBg] = useState<'transparent' | 'white'>('transparent')

  const create = () => {
    const w = Math.max(1, Math.min(1024, width || 1))
    const h = Math.max(1, Math.min(1024, height || 1))
    const bgColor: [number, number, number, number] = bg === 'white' ? [255, 255, 255, 255] : [0, 0, 0, 0]
    newProject(w, h, bgColor)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpenModal(null)} />
      <div className="relative flex flex-col w-[420px] rounded-lg bg-bg-surface shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center h-13 px-5 border-b border-border-subtle">
          <span className="flex-1 text-text-primary text-[14px] font-semibold">New Project</span>
          <button onClick={() => setOpenModal(null)} className="flex items-center justify-center w-7 h-7 rounded-md bg-bg-elevated text-text-secondary hover:text-text-primary">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5">
          {/* Size */}
          <label className="text-[11px] font-semibold text-text-secondary">Canvas Size</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-md bg-bg-elevated border border-border-subtle">
              <span className="text-[10px] font-semibold text-text-muted">W</span>
              <input type="number" value={width} min={1} max={1024} onChange={e => setWidth(Math.max(1, Number(e.target.value) || 1))}
                className="flex-1 bg-transparent text-text-primary text-[13px] font-mono outline-none" />
            </div>
            <span className="text-text-muted">×</span>
            <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-md bg-bg-elevated border border-border-subtle">
              <span className="text-[10px] font-semibold text-text-muted">H</span>
              <input type="number" value={height} min={1} max={1024} onChange={e => setHeight(Math.max(1, Number(e.target.value) || 1))}
                className="flex-1 bg-transparent text-text-primary text-[13px] font-mono outline-none" />
            </div>
          </div>

          {/* Presets */}
          <label className="text-[11px] font-semibold text-text-secondary">Presets</label>
          <div className="flex gap-2 flex-wrap">
            {CANVAS_PRESETS.map(p => (
              <button key={p.label} onClick={() => { setWidth(p.width); setHeight(p.height) }}
                className={`px-3 h-8 rounded-md text-[11px] font-mono border transition-colors ${
                  width === p.width && height === p.height
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-elevated text-text-secondary border-border-subtle hover:border-border'
                }`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Background */}
          <label className="text-[11px] font-semibold text-text-secondary">Background</label>
          <div className="flex gap-2">
            {(['transparent', 'white'] as const).map(b => (
              <button key={b} onClick={() => setBg(b)}
                className={`flex items-center gap-2 h-8 px-3 rounded-md border text-[11px] transition-colors capitalize ${
                  bg === b ? 'border-accent text-text-primary' : 'border-border-subtle text-text-secondary hover:border-border'
                }`}>
                <span className={`w-3 h-3 rounded-sm border border-white/20 ${b === 'white' ? 'bg-white' : 'checkerboard'}`} />
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={() => setOpenModal(null)}
            className="h-9 px-4 rounded-md bg-bg-elevated border border-border-subtle text-text-secondary text-[13px] font-medium hover:text-text-primary">
            Cancel
          </button>
          <button onClick={create}
            className="h-9 px-5 rounded-md bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover">
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
