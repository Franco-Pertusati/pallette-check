export interface ColorData {
  hex: string,
  name: string
  optimalTextColor: 'white' | 'black'
  blocked: boolean
}

export interface PalletteData {
  colors: [],
  isDark: boolean,
}
