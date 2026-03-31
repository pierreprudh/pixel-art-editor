import { useEditorStore } from '../../store'
import { renderToThumbnail } from '../../engine/renderer'
import { Plus, Play, Square, Repeat } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function Timeline() {
  const {
    frames, activeFrame, fps, isPlaying, isLooping,
    setActiveFrame, addFrame, duplicateFrame,
    setFps, setIsPlaying, setIsLooping,
  } = useEditorStore()

  // Playback interval
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef(activeFrame)
  frameRef.current = activeFrame

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const { isLooping: looping, frames: f } = useEditorStore.getState()
        const next = frameRef.current + 1
        if (next >= f.length) {
          if (looping) {
            setActiveFrame(0)
          } else {
            setIsPlaying(false)
          }
        } else {
          setActiveFrame(next)
        }
      }, 1000 / fps)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, fps, frames.length])

  return (
    <div className="flex items-center gap-2 px-3 h-20 bg-bg-surface border-t border-border-subtle shrink-0">
      {/* Frame thumbnails */}
      <div className="flex items-center gap-2 flex-1 overflow-x-auto">
        {frames.map((frame, i) => (
          <button
            key={i}
            onClick={() => setActiveFrame(i)}
            onDoubleClick={() => duplicateFrame(i)}
            className={`flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-colors ${
              i === activeFrame ? 'border-accent' : 'border-border-subtle hover:border-border'
            }`}
          >
            <img
              src={renderToThumbnail(frame, 56)}
              className="w-full h-full"
              style={{ imageRendering: 'pixelated' }}
              alt={`Frame ${i + 1}`}
            />
          </button>
        ))}
        <button
          onClick={addFrame}
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded border border-border-subtle text-text-muted hover:text-text-primary hover:border-border transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* FPS */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
        <span>FPS</span>
        <input
          type="number"
          value={fps}
          min={1} max={60}
          onChange={(e) => setFps(Number(e.target.value))}
          className="w-9 h-6 rounded bg-bg-elevated border border-border-subtle text-text-primary text-center text-[11px] outline-none focus:border-accent"
        />
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center justify-center w-7 h-7 rounded transition-colors ${
            isPlaying ? 'bg-bg-elevated text-text-secondary' : 'bg-accent text-white'
          }`}
        >
          <Play size={13} />
        </button>
        <button
          onClick={() => { setIsPlaying(false); setActiveFrame(0) }}
          className="flex items-center justify-center w-7 h-7 rounded bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
        >
          <Square size={13} />
        </button>
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`flex items-center justify-center w-7 h-7 rounded transition-colors ${
            isLooping ? 'bg-accent text-white' : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
          }`}
          title="Loop"
        >
          <Repeat size={13} />
        </button>
      </div>
    </div>
  )
}
