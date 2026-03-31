import { useEffect } from 'react'
import { useEditorStore, TOOL_SHORTCUTS } from './store'
import { TopBar } from './components/layout/TopBar'
import { ToolBar } from './components/layout/ToolBar'
import { RightPanel } from './components/layout/RightPanel'
import { StatusBar } from './components/layout/StatusBar'
import { Timeline } from './components/layout/Timeline'
import { CanvasArea } from './components/canvas/CanvasArea'
import { NewProjectModal } from './components/modals/NewProjectModal'
import { ExportModal } from './components/modals/ExportModal'
import { PaletteManagerModal } from './components/modals/PaletteManagerModal'

function App() {
  const { openModal } = useEditorStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      // Always read fresh state to avoid stale closures
      const store = useEditorStore.getState()

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); store.undo() }
        if (e.key === 'y') { e.preventDefault(); store.redo() }
        return
      }

      const tool = TOOL_SHORTCUTS[e.key.toLowerCase()]
      if (tool) store.setActiveTool(tool)
      if (e.key === 'x') store.swapColors()
      if (e.key === '[') store.setZoom(store.zoom - 1)
      if (e.key === ']') store.setZoom(store.zoom + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-bg-base">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ToolBar />
        <CanvasArea />
        <RightPanel />
      </div>
      <Timeline />
      <StatusBar />

      {openModal === 'new-project'     && <NewProjectModal />}
      {openModal === 'export'          && <ExportModal />}
      {openModal === 'palette-manager' && <PaletteManagerModal />}
    </div>
  )
}

export default App
