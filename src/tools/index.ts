import type { ToolName, ToolHandler } from './types'
import { pencil } from './pencil'
import { eraser } from './eraser'
import { fill } from './fill'
import { eyedropper } from './eyedropper'
import { line } from './line'
import { rect } from './rect'
import { ellipse } from './ellipse'

export const TOOLS: Record<ToolName, ToolHandler> = {
  pencil,
  eraser,
  fill,
  eyedropper,
  line,
  rect,
  ellipse,
}

export * from './types'
