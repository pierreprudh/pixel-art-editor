import { PixelBuffer } from '../engine/PixelBuffer'
import type { ToolHandler, ToolResult } from './types'

function drawRect(buf: PixelBuffer, x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a: number): void {
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1)
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1)
  for (let x = minX; x <= maxX; x++) {
    buf.setPixel(x, minY, r, g, b, a)
    buf.setPixel(x, maxY, r, g, b, a)
  }
  for (let y = minY; y <= maxY; y++) {
    buf.setPixel(minX, y, r, g, b, a)
    buf.setPixel(maxX, y, r, g, b, a)
  }
}

export const rect: ToolHandler = {
  cursor: 'crosshair',
  onPointerDown(): ToolResult { return {} },
  onPointerMove(x, y, buffer, ctx, startX = 0, startY = 0): ToolResult {
    const overlay = new PixelBuffer(buffer.width, buffer.height)
    const { r, g, b, a } = ctx.primary
    drawRect(overlay, startX, startY, x, y, r, g, b, a)
    return { overlay }
  },
  onPointerUp(x, y, buffer, ctx, startX = 0, startY = 0): ToolResult {
    const commit = buffer.clone()
    const { r, g, b, a } = ctx.primary
    drawRect(commit, startX, startY, x, y, r, g, b, a)
    return { commit, overlay: new PixelBuffer(buffer.width, buffer.height) }
  },
}
