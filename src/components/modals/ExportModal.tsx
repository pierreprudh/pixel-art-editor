import { useState } from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '../../store'
import { drawCheckerboard, drawFrame } from '../../engine/renderer'

type Format = 'PNG' | 'SVG'
const SCALES = [1, 2, 4, 8]

function exportPng(frames: ReturnType<typeof useEditorStore.getState>['frames'], width: number, height: number, scale: number) {
  const frame = frames[useEditorStore.getState().activeFrame]
  if (!frame) return
  const c = document.createElement('canvas')
  c.width = width * scale
  c.height = height * scale
  const ctx = c.getContext('2d')
  if (!ctx) return
  drawCheckerboard(ctx, width, height, scale)
  drawFrame(ctx, frame, scale)
  c.toBlob(blob => {
    if (!blob) { alert('Export failed.'); return }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pixel-art@${scale}x.png`
    a.click()
  })
}

function exportSvg(frames: ReturnType<typeof useEditorStore.getState>['frames'], width: number, height: number, scale: number) {
  const frame = frames[useEditorStore.getState().activeFrame]
  if (!frame) return
  let rects = ''
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = frame.getPixel(x, y)
      if (a === 0) continue
      const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
      const opacity = a / 255
      rects += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${hex}"${opacity < 1 ? ` opacity="${opacity.toFixed(2)}"` : ''}/>`
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}">${rects}</svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `pixel-art@${scale}x.svg`
  a.click()
}

export function ExportModal() {
  const { setOpenModal, frames, canvasWidth, canvasHeight, activeFrame } = useEditorStore()
  const [format, setFormat] = useState<Format>('PNG')
  const [scale, setScale] = useState(4)

  const handleExport = () => {
    if (format === 'SVG') {
      exportSvg(frames, canvasWidth, canvasHeight, scale)
    } else {
      exportPng(frames, canvasWidth, canvasHeight, scale)
    }
    setOpenModal(null)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpenModal(null)} />
      <div className="relative flex flex-col w-[480px] rounded-lg bg-bg-surface shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center h-13 px-5 border-b border-border-subtle">
          <span className="flex-1 text-text-primary text-[14px] font-semibold">Export</span>
          <button onClick={() => setOpenModal(null)} className="flex items-center justify-center w-7 h-7 rounded-md bg-bg-elevated text-text-secondary hover:text-text-primary">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* Format */}
          <div>
            <label className="text-[11px] font-semibold text-text-secondary block mb-2">Format</label>
            <div className="flex rounded-md overflow-hidden bg-bg-elevated">
              {(['PNG', 'SVG'] as Format[]).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`flex-1 h-9 text-[12px] font-semibold transition-colors ${
                    format === f ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div>
            <label className="text-[11px] font-semibold text-text-secondary block mb-2">Scale</label>
            <div className="flex gap-2">
              {SCALES.map(s => (
                <button key={s} onClick={() => setScale(s)}
                  className={`h-9 px-4 rounded-md border text-[12px] font-mono transition-colors ${
                    scale === s ? 'bg-accent text-white border-accent' : 'bg-bg-elevated text-text-muted border-border-subtle hover:border-border'
                  }`}>
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-[11px] font-semibold text-text-secondary block mb-2">Preview</label>
            <div className="flex items-center justify-center h-40 rounded-md bg-bg-elevated border border-border-subtle checkerboard">
              <canvas
                width={canvasWidth}
                height={canvasHeight}
                style={{ imageRendering: 'pixelated', maxWidth: 128, maxHeight: 128 }}
                ref={el => {
                  if (!el) return
                  const ctx = el.getContext('2d')
                  if (!ctx) return
                  ctx.clearRect(0, 0, el.width, el.height)
                  drawFrame(ctx, frames[activeFrame], 1)
                }}
              />
            </div>
          </div>

          {/* Filename */}
          <div>
            <label className="text-[11px] font-semibold text-text-secondary block mb-2">Filename</label>
            <div className="h-9 px-3 rounded-md bg-bg-elevated border border-border-subtle flex items-center">
              <span className="text-text-primary text-[12px] font-mono">
                pixel-art@{scale}x.{format.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={() => setOpenModal(null)}
            className="h-9 px-4 rounded-md bg-bg-elevated border border-border-subtle text-text-secondary text-[13px] font-medium hover:text-text-primary">
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="h-9 px-5 rounded-md bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover">
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
