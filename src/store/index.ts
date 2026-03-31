import { create } from 'zustand'
import { PixelBuffer } from '../engine/PixelBuffer'
import { PICO8 } from '../data/palettes'
import type { ToolName } from '../tools/types'

export type ModalName = 'new-project' | 'export' | 'palette-manager' | null

const MAX_HISTORY = 50

function makeBlankFrame(w: number, h: number): PixelBuffer {
  return new PixelBuffer(w, h, [255, 255, 255, 255])
}

interface EditorStore {
  // Canvas
  canvasWidth: number
  canvasHeight: number
  frames: PixelBuffer[]
  activeFrame: number

  // Tools
  activeTool: ToolName
  primaryColor: string
  secondaryColor: string

  // UI
  zoom: number
  cursorX: number
  cursorY: number
  openModal: ModalName

  // Animation
  fps: number
  isPlaying: boolean
  isLooping: boolean

  // View
  showGrid: boolean

  // Palette
  activePalette: string[]

  // History (snapshots of all frames)
  past: PixelBuffer[][]
  future: PixelBuffer[][]

  // Actions
  setActiveTool: (tool: ToolName) => void
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  swapColors: () => void
  setZoom: (zoom: number) => void
  setCursor: (x: number, y: number) => void
  setOpenModal: (modal: ModalName) => void
  commitFrame: (index: number, buffer: PixelBuffer) => void
  undo: () => void
  redo: () => void
  setActiveFrame: (index: number) => void
  addFrame: () => void
  duplicateFrame: (index: number) => void
  removeFrame: (index: number) => void
  setFps: (fps: number) => void
  setIsPlaying: (playing: boolean) => void
  setIsLooping: (looping: boolean) => void
  toggleGrid: () => void
  newProject: (width: number, height: number, bgColor?: [number, number, number, number]) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  canvasWidth: 32,
  canvasHeight: 32,
  frames: [makeBlankFrame(32, 32)],
  activeFrame: 0,

  activeTool: 'pencil',
  primaryColor: '#FF004D',
  secondaryColor: '#000000',

  zoom: 10,
  cursorX: -1,
  cursorY: -1,
  openModal: null,

  fps: 8,
  isPlaying: false,
  isLooping: true,

  showGrid: true,

  activePalette: PICO8,

  past: [],
  future: [],

  setActiveTool: (tool) => set({ activeTool: tool }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  swapColors: () => set((s) => ({ primaryColor: s.secondaryColor, secondaryColor: s.primaryColor })),
  setZoom: (zoom) => set({ zoom: Math.max(1, Math.min(32, zoom)) }),
  setCursor: (x, y) => set({ cursorX: x, cursorY: y }),
  setOpenModal: (modal) => set({ openModal: modal }),

  commitFrame: (index, buffer) => set((s) => {
    const past = [...s.past, s.frames.map(f => f.clone())]
    if (past.length > MAX_HISTORY) past.shift()
    const frames = [...s.frames]
    frames[index] = buffer
    return { frames, past, future: [] }
  }),

  undo: () => set((s) => {
    if (s.past.length === 0) return {}
    const past = [...s.past]
    const snapshot = past.pop()!
    const future = [s.frames.map(f => f.clone()), ...s.future]
    return { frames: snapshot, past, future }
  }),

  redo: () => set((s) => {
    if (s.future.length === 0) return {}
    const future = [...s.future]
    const snapshot = future.shift()!
    const past = [...s.past, s.frames.map(f => f.clone())]
    return { frames: snapshot, past, future }
  }),

  setActiveFrame: (index) => set({ activeFrame: index }),

  addFrame: () => set((s) => {
    const f = makeBlankFrame(s.canvasWidth, s.canvasHeight)
    return { frames: [...s.frames, f], activeFrame: s.frames.length }
  }),

  duplicateFrame: (index) => set((s) => {
    const f = s.frames[index].clone()
    const frames = [...s.frames]
    frames.splice(index + 1, 0, f)
    return { frames, activeFrame: index + 1 }
  }),

  removeFrame: (index) => set((s) => {
    if (s.frames.length <= 1) return {}
    const frames = s.frames.filter((_, i) => i !== index)
    const activeFrame = Math.min(s.activeFrame, frames.length - 1)
    return { frames, activeFrame }
  }),

  setFps: (fps) => set({ fps: Math.max(1, Math.min(60, fps)) }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLooping: (isLooping) => set({ isLooping }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),

  newProject: (width, height, bgColor = [255, 255, 255, 255]) => set({
    canvasWidth: width,
    canvasHeight: height,
    frames: [new PixelBuffer(width, height, bgColor)],
    activeFrame: 0,
    past: [],
    future: [],
    zoom: Math.max(1, Math.floor(480 / Math.max(width, height))),
    openModal: null,
  }),
}))

// Keyboard shortcut bindings
export const TOOL_SHORTCUTS: Partial<Record<string, ToolName>> = {
  b: 'pencil', e: 'eraser', g: 'fill',
  i: 'eyedropper', l: 'line', u: 'rect', o: 'ellipse',
}
