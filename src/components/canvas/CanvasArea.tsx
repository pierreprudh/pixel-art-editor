import { useEditorStore } from '../../store'
import { PixelCanvas } from './PixelCanvas'

export function CanvasArea() {
  const { setZoom, zoom } = useEditorStore()

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(zoom + (e.deltaY < 0 ? 1 : -1))
  }

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden bg-canvas-surround"
      onWheel={onWheel}
    >
      <PixelCanvas />
    </div>
  )
}
