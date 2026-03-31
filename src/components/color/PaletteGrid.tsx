import { useEditorStore } from '../../store'

export function PaletteGrid() {
  const { activePalette, setPrimaryColor } = useEditorStore()

  return (
    <div className="grid gap-1 p-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {activePalette.map((color) => (
        <button
          key={color}
          title={color}
          onClick={() => setPrimaryColor(color)}
          className="w-full aspect-square rounded-sm hover:scale-110 transition-transform border border-transparent hover:border-white/30"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}
