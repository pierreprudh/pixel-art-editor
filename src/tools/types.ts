import { PixelBuffer } from '../engine/PixelBuffer'

export type ToolName =
  | 'pencil' | 'eraser' | 'fill' | 'eyedropper'
  | 'line' | 'rect' | 'ellipse'

export interface RGBA { r: number; g: number; b: number; a: number }

export interface DrawContext {
  primary: RGBA
  secondary: RGBA
}

export interface ToolResult {
  overlay?: PixelBuffer   // preview that doesn't get committed to history
  commit?: PixelBuffer    // final result — written to store + history
  pickColor?: string      // eyedropper: hex color to set as primary
}

export interface ToolHandler {
  cursor?: string
  onPointerDown(x: number, y: number, buffer: PixelBuffer, ctx: DrawContext, startX?: number, startY?: number): ToolResult
  onPointerMove(x: number, y: number, buffer: PixelBuffer, ctx: DrawContext, startX?: number, startY?: number): ToolResult
  onPointerUp(x: number, y: number, buffer: PixelBuffer, ctx: DrawContext, startX?: number, startY?: number): ToolResult
}
