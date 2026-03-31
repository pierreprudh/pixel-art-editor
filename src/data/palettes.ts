export const PICO8: string[] = [
  '#000000', '#1D2B53', '#7E2553', '#008751',
  '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
  '#FF004D', '#FFA300', '#FFEC27', '#00E436',
  '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA',
]

export const NES: string[] = [
  '#000000', '#FCFCFC', '#F8F8F8', '#BCBCBC',
  '#7C7C7C', '#A4E4FC', '#3CBCFC', '#0078F8',
  '#0000FC', '#B8B8F8', '#6888FC', '#0058F8',
  '#0000BC', '#D8B8F8', '#9878F8', '#6844FC',
  '#4428BC', '#F8B8F8', '#F878F8', '#D800CC',
  '#940084', '#F8A4C0', '#F85898', '#E40058',
  '#A80020', '#F0D0B0', '#F87858', '#F83800',
  '#A81000', '#FCE0A8', '#FCB800', '#AC7C00',
  '#503000', '#D8F878', '#B8F818', '#00B800',
  '#007800', '#B8F8B8', '#58D854', '#00A800',
  '#006800', '#B8F8D8', '#58F898', '#00A844',
  '#005800', '#00FCFC', '#00E8D8', '#008888',
  '#004058', '#F8D8F8', '#787878',
]

export const GAMEBOY: string[] = [
  '#0F380F', '#306230', '#8BAC0F', '#9BBC0F',
]

export const C64: string[] = [
  '#000000', '#FFFFFF', '#880000', '#AAFFEE',
  '#CC44CC', '#00CC55', '#0000AA', '#EEEE77',
  '#DD8855', '#664400', '#FF7777', '#333333',
  '#777777', '#AAFF66', '#0088FF', '#BBBBBB',
]

export const PALETTES: Record<string, { name: string; colors: string[] }> = {
  pico8:   { name: 'PICO-8',   colors: PICO8 },
  nes:     { name: 'NES',      colors: NES },
  gameboy: { name: 'Game Boy', colors: GAMEBOY },
  c64:     { name: 'C64',      colors: C64 },
}
