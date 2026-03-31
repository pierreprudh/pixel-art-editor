import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '../../store'
import { drawCheckerboard, drawFrame, drawGrid } from '../../engine/renderer'
import { PixelBuffer } from '../../engine/PixelBuffer'
import { useCanvasEvents } from './useCanvasEvents'

export function PixelCanvas() {
  const { frames, activeFrame, zoom, canvasWidth, canvasHeight, showGrid } = useEditorStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const [overlayBuffer, setOverlayBuffer] = useState<PixelBuffer>(
    () => new PixelBuffer(canvasWidth, canvasHeight)
  )

  const getOverlayBuffer = () => overlayBuffer

  const { onPointerDown, onPointerMove, onPointerUp, onPointerLeave } = useCanvasEvents(
    canvasRef, overlayRef, getOverlayBuffer, setOverlayBuffer
  )

  const W = canvasWidth * zoom
  const H = canvasHeight * zoom

  // Render committed frame
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)
    drawCheckerboard(ctx, canvasWidth, canvasHeight, zoom)
    drawFrame(ctx, frames[activeFrame], zoom)
    if (showGrid) drawGrid(ctx, canvasWidth, canvasHeight, zoom)
  }, [frames, activeFrame, zoom, W, H, showGrid])

  // Render overlay
  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)
    drawFrame(ctx, overlayBuffer, zoom)
  }, [overlayBuffer, zoom, W, H])

  // Reset overlay when canvas size changes
  useEffect(() => {
    setOverlayBuffer(new PixelBuffer(canvasWidth, canvasHeight))
  }, [canvasWidth, canvasHeight])

  return (
    <div className="relative" style={{ width: W, height: H }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ position: 'absolute', imageRendering: 'pixelated' }}
      />
      <canvas
        ref={overlayRef}
        width={W}
        height={H}
        style={{ position: 'absolute', imageRendering: 'pixelated', cursor: 'crosshair' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
      />
    </div>
  )
}
