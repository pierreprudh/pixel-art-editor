import { PixelBuffer } from '../engine/PixelBuffer'
import type { ToolHandler, ToolResult } from './types'

function bresenham(buf: PixelBuffer, x0: number, y0: number, x1: number, y1: number): void {
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  while (true) {
    buf.setPixel(x0, y0, 0, 0, 0, 0)
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) { err -= dy; x0 += sx }
    if (e2 < dx)  { err += dx; y0 += sy }
  }
}

let prevX = -1
let prevY = -1

export const eraser: ToolHandler = {
  cursor: 'crosshair',
  onPointerDown(x, y, buffer): ToolResult {
    prevX = x
    prevY = y
    const b = buffer.clone()
    b.setPixel(x, y, 0, 0, 0, 0)
    return { commit: b }
  },
  onPointerMove(x, y, buffer): ToolResult {
    const b = buffer.clone()
    bresenham(b, prevX, prevY, x, y)
    prevX = x
    prevY = y
    return { commit: b }
  },
  onPointerUp(): ToolResult { return {} },
}
