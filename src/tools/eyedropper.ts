import { PixelBuffer, rgbaToHex } from '../engine/PixelBuffer'
import type { ToolHandler, ToolResult } from './types'

export const eyedropper: ToolHandler = {
  cursor: 'crosshair',
  onPointerDown(x, y, buffer): ToolResult {
    const [r, g, b] = buffer.getPixel(x, y)
    return { pickColor: rgbaToHex(r, g, b) }
  },
  onPointerMove(): ToolResult { return {} },
  onPointerUp(): ToolResult { return {} },
}
