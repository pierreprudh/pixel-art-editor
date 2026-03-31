import { PixelBuffer } from '../engine/PixelBuffer'
import type { ToolHandler, ToolResult } from './types'

function bresenham(
  buf: PixelBuffer,
  x0: number, y0: number,
  x1: number, y1: number,
  r: number, g: number, b: number, a: number
): void {
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
  let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  while (true) {
    buf.setPixel(x0, y0, r, g, b, a)
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) { err -= dy; x0 += sx }
    if (e2 < dx)  { err += dx; y0 += sy }
  }
}

export const line: ToolHandler = {
  cursor: 'crosshair',
  onPointerDown(): ToolResult { return {} },
  onPointerMove(x, y, buffer, ctx, startX = 0, startY = 0): ToolResult {
    const overlay = new PixelBuffer(buffer.width, buffer.height)
    const { r, g, b, a } = ctx.primary
    bresenham(overlay, startX, startY, x, y, r, g, b, a)
    return { overlay }
  },
  onPointerUp(x, y, buffer, ctx, startX = 0, startY = 0): ToolResult {
    const commit = buffer.clone()
    const { r, g, b, a } = ctx.primary
    bresenham(commit, startX, startY, x, y, r, g, b, a)
    return { commit, overlay: new PixelBuffer(buffer.width, buffer.height) }
  },
}
