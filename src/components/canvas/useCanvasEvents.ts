import { useCallback, useRef } from 'react'
import type { RefObject } from 'react'
import { useEditorStore } from '../../store'
import { TOOLS } from '../../tools'
import { hexToRgba, PixelBuffer } from '../../engine/PixelBuffer'
import type { RGBA } from '../../tools/types'

function toRGBA(hex: string): RGBA {
  const [r, g, b, a] = hexToRgba(hex)
  return { r, g, b, a }
}

export function useCanvasEvents(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  overlayRef: RefObject<HTMLCanvasElement | null>,
  getOverlayBuffer: () => PixelBuffer,
  setOverlayBuffer: (b: PixelBuffer) => void,
) {
  const isDown = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)

  const getPixelCoords = useCallback((e: React.PointerEvent): [number, number] => {
    const canvas = canvasRef.current
    if (!canvas) return [-1, -1]
    const rect = canvas.getBoundingClientRect()
    const { zoom } = useEditorStore.getState()
    const x = Math.floor((e.clientX - rect.left) / zoom)
    const y = Math.floor((e.clientY - rect.top) / zoom)
    return [x, y]
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDown.current = true

    const [x, y] = getPixelCoords(e)
    const store = useEditorStore.getState()
    const { activeTool, frames, activeFrame, setCursor } = store
    setCursor(x, y)
    startX.current = x
    startY.current = y

    const tool = TOOLS[activeTool]
    const ctx = { primary: toRGBA(store.primaryColor), secondary: toRGBA(store.secondaryColor) }
    const result = tool.onPointerDown(x, y, frames[activeFrame], ctx, x, y)

    if (result.commit) store.commitFrame(activeFrame, result.commit)
    if (result.overlay) setOverlayBuffer(result.overlay)
    if (result.pickColor) store.setPrimaryColor(result.pickColor)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const [x, y] = getPixelCoords(e)
    const store = useEditorStore.getState()
    store.setCursor(x, y)

    if (!isDown.current) return

    const { activeTool, frames, activeFrame } = store
    const tool = TOOLS[activeTool]
    const ctx = { primary: toRGBA(store.primaryColor), secondary: toRGBA(store.secondaryColor) }
    const result = tool.onPointerMove(x, y, frames[activeFrame], ctx, startX.current, startY.current)

    if (result.commit) store.commitFrame(activeFrame, result.commit)
    if (result.overlay !== undefined) setOverlayBuffer(result.overlay)
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDown.current) return
    isDown.current = false

    const [x, y] = getPixelCoords(e)
    const store = useEditorStore.getState()
    const { activeTool, frames, activeFrame } = store
    const tool = TOOLS[activeTool]
    const ctx = { primary: toRGBA(store.primaryColor), secondary: toRGBA(store.secondaryColor) }
    const result = tool.onPointerUp(x, y, frames[activeFrame], ctx, startX.current, startY.current)

    if (result.commit) store.commitFrame(activeFrame, result.commit)
    if (result.overlay !== undefined) setOverlayBuffer(result.overlay)
  }, [])

  const onPointerLeave = useCallback(() => {
    useEditorStore.getState().setCursor(-1, -1)
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp, onPointerLeave }
}
