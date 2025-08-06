export interface ColorData {
  hex: string,
  name: string
  optimalTextColor: 'white' | 'black'
  blocked: boolean
  shades?: ColorData[]
}

export interface PalletteData {
  colors: [],
  isDark: boolean,
}
