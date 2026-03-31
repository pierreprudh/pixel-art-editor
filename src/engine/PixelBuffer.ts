export class PixelBuffer {
  data: Uint8ClampedArray
  width: number
  height: number

  constructor(width: number, height: number, fill: [number, number, number, number] = [0, 0, 0, 0]) {
    this.width = width
    this.height = height
    this.data = new Uint8ClampedArray(width * height * 4)
    if (fill[3] > 0) this.fill(...fill)
  }

  private index(x: number, y: number): number {
    return (y * this.width + x) * 4
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  getPixel(x: number, y: number): [number, number, number, number] {
    const i = this.index(x, y)
    return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]]
  }

  setPixel(x: number, y: number, r: number, g: number, b: number, a: number): void {
    if (!this.inBounds(x, y)) return
    const i = this.index(x, y)
    this.data[i] = r
    this.data[i + 1] = g
    this.data[i + 2] = b
    this.data[i + 3] = a
  }

  fill(r: number, g: number, b: number, a: number): void {
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = r
      this.data[i + 1] = g
      this.data[i + 2] = b
      this.data[i + 3] = a
    }
  }

  clone(): PixelBuffer {
    const buf = new PixelBuffer(this.width, this.height)
    buf.data.set(this.data)
    return buf
  }

  toImageData(): ImageData {
    return new ImageData(new Uint8ClampedArray(this.data), this.width, this.height)
  }

  pixelEquals(x: number, y: number, r: number, g: number, b: number, a: number): boolean {
    const [pr, pg, pb, pa] = this.getPixel(x, y)
    return pr === r && pg === g && pb === b && pa === a
  }
}

export function hexToRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return [r, g, b, 255]
}

export function rgbaToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}
