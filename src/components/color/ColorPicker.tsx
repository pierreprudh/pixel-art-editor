import { useState, useEffect } from 'react'
import { useEditorStore } from '../../store'

export function ColorPicker() {
  const { primaryColor, secondaryColor, setPrimaryColor, swapColors } = useEditorStore()
  const [hexInput, setHexInput] = useState(primaryColor)

  // Keep hex input in sync when color changes externally (eyedropper, palette click)
  useEffect(() => {
    setHexInput(primaryColor)
  }, [primaryColor])

  const commitHex = () => {
    const v = hexInput.startsWith('#') ? hexInput : '#' + hexInput
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      setPrimaryColor(v.toUpperCase())
    } else {
      setHexInput(primaryColor)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* Swatches */}
      <div className="relative h-16">
        {/* Secondary (back) */}
        <div
          className="absolute bottom-0 right-0 w-10 h-10 rounded border-2 border-border cursor-pointer"
          style={{ backgroundColor: secondaryColor }}
          onClick={swapColors}
        />
        {/* Primary (front) */}
        <div
          className="absolute top-0 left-0 w-10 h-10 rounded border-2 border-accent"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Swap hint */}
        <button
          onClick={swapColors}
          className="absolute top-0 right-0 text-[9px] text-text-muted hover:text-text-primary leading-none"
          title="Swap colors (X)"
        >
          ⇄
        </button>
      </div>

      {/* HEX input */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-text-muted w-7">HEX</span>
        <input
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={commitHex}
          onKeyDown={(e) => e.key === 'Enter' && commitHex()}
          className="flex-1 h-7 px-2 rounded bg-bg-elevated border border-border-subtle text-text-primary text-[11px] font-mono outline-none focus:border-accent"
        />
      </div>

      {/* Color preview dot */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => { setPrimaryColor(e.target.value) }}
          className="w-full h-6 rounded cursor-pointer bg-transparent border-0 p-0"
          title="Pick color"
        />
      </div>
    </div>
  )
}
