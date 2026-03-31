import { PixelBuffer } from '../engine/PixelBuffer'
import type { DrawContext, ToolHandler, ToolResult } from './types'

function floodFill(buffer: PixelBuffer, x: number, y: number, ctx: DrawContext): PixelBuffer {
  if (!buffer.inBounds(x, y)) return buffer
  const [tr, tg, tb, ta] = buffer.getPixel(x, y)
  const { r, g, b, a } = ctx.primary

  // already the same color
  if (tr === r && tg === g && tb === b && ta === a) return buffer

  const out = buffer.clone()
  const stack: [number, number][] = [[x, y]]
  const visited = new Uint8Array(buffer.width * buffer.height)

  while (stack.length > 0) {
    const [cx, cy] = stack.pop()!
    const idx = cy * buffer.width + cx
    if (visited[idx]) continue
    visited[idx] = 1

    const [pr, pg, pb, pa] = out.getPixel(cx, cy)
    if (pr !== tr || pg !== tg || pb !== tb || pa !== ta) continue

    out.setPixel(cx, cy, r, g, b, a)

    if (cx + 1 < buffer.width)  stack.push([cx + 1, cy])
    if (cx - 1 >= 0)            stack.push([cx - 1, cy])
    if (cy + 1 < buffer.height) stack.push([cx, cy + 1])
    if (cy - 1 >= 0)            stack.push([cx, cy - 1])
  }

  return out
}

export const fill: ToolHandler = {
  cursor: 'crosshair',
  onPointerDown(x, y, buffer, ctx): ToolResult {
    return { commit: floodFill(buffer, x, y, ctx) }
  },
  onPointerMove(): ToolResult { return {} },
  onPointerUp(): ToolResult { return {} },
}
