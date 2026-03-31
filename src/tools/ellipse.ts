import { PixelBuffer } from '../engine/PixelBuffer'
import type { ToolHandler, ToolResult } from './types'

function drawEllipse(buf: PixelBuffer, x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a: number): void {
  const cx = Math.round((x0 + x1) / 2)
  const cy = Math.round((y0 + y1) / 2)
  const rx = Math.abs(Math.round((x1 - x0) / 2))
  const ry = Math.abs(Math.round((y1 - y0) / 2))

  if (rx === 0 && ry === 0) {
    buf.setPixel(cx, cy, r, g, b, a)
    return
  }

  const plot = (px: number, py: number) => {
    buf.setPixel(cx + px, cy + py, r, g, b, a)
    buf.setPixel(cx - px, cy + py, r, g, b, a)
    buf.setPixel(cx + px, cy - py, r, g, b, a)
    buf.setPixel(cx - px, cy - py, r, g, b, a)
  }

  // Midpoint ellipse algorithm
  const rx2 = rx * rx, ry2 = ry * ry
  let px = 0, py = ry
  let dx = 0, dy = 2 * rx2 * py
  let p = Math.round(ry2 - rx2 * ry + 0.25 * rx2)

  // Region 1
  while (dx < dy) {
    plot(px, py)
    px++
    dx += 2 * ry2
    if (p < 0) {
      p += ry2 + dx
    } else {
      py--
      dy -= 2 * rx2
      p += ry2 + dx - dy
    }
  }

  // Region 2
  p = Math.round(ry2 * (px + 0.5) * (px + 0.5) + rx2 * (py - 1) * (py - 1) - rx2 * ry2)
  while (py >= 0) {
    plot(px, py)
    py--
    dy -= 2 * rx2
    if (p > 0) {
      p += rx2 - dy
    } else {
      px++
      dx += 2 * ry2
      p += rx2 - dy + dx
    }
  }
}

export const ellipse: ToolHandler = {
  cursor: 'crosshair',
  onPointerDown(): ToolResult { return {} },
  onPointerMove(x, y, buffer, ctx, startX = 0, startY = 0): ToolResult {
    const overlay = new PixelBuffer(buffer.width, buffer.height)
    const { r, g, b, a } = ctx.primary
    drawEllipse(overlay, startX, startY, x, y, r, g, b, a)
    return { overlay }
  },
  onPointerUp(x, y, buffer, ctx, startX = 0, startY = 0): ToolResult {
    const commit = buffer.clone()
    const { r, g, b, a } = ctx.primary
    drawEllipse(commit, startX, startY, x, y, r, g, b, a)
    return { commit, overlay: new PixelBuffer(buffer.width, buffer.height) }
  },
}
