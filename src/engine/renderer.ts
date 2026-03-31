import { PixelBuffer } from './PixelBuffer'

let checkerboardCache: HTMLCanvasElement | null = null
let offscreenCanvas: HTMLCanvasElement | null = null

export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoom: number
): void {
  const size = Math.max(4, zoom)
  if (!checkerboardCache || checkerboardCache.width !== size * 2) {
    const c = document.createElement('canvas')
    c.width = size * 2
    c.height = size * 2
    const cx = c.getContext('2d')!
    cx.fillStyle = '#888'
    cx.fillRect(0, 0, size * 2, size * 2)
    cx.fillStyle = '#666'
    cx.fillRect(0, 0, size, size)
    cx.fillRect(size, size, size, size)
    checkerboardCache = c
  }
  const pattern = ctx.createPattern(checkerboardCache, 'repeat')!
  ctx.fillStyle = pattern
  ctx.fillRect(0, 0, width * zoom, height * zoom)
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  buffer: PixelBuffer,
  zoom: number,
  opacity = 1
): void {
  if (!offscreenCanvas || offscreenCanvas.width !== buffer.width || offscreenCanvas.height !== buffer.height) {
    offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = buffer.width
    offscreenCanvas.height = buffer.height
  }
  const offCtx = offscreenCanvas.getContext('2d')!
  offCtx.putImageData(buffer.toImageData(), 0, 0)
  const offscreen = offscreenCanvas

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(offscreen, 0, 0, buffer.width * zoom, buffer.height * zoom)
  ctx.restore()
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoom: number
): void {
  if (zoom < 4) return
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x++) {
    ctx.beginPath()
    ctx.moveTo(x * zoom + 0.5, 0)
    ctx.lineTo(x * zoom + 0.5, height * zoom)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * zoom + 0.5)
    ctx.lineTo(width * zoom, y * zoom + 0.5)
    ctx.stroke()
  }
  ctx.restore()
}

export function renderToThumbnail(
  buffer: PixelBuffer,
  size: number
): string {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  const zoom = size / Math.max(buffer.width, buffer.height)
  drawCheckerboard(ctx, buffer.width, buffer.height, zoom)
  drawFrame(ctx, buffer, zoom)
  return c.toDataURL()
}
