export interface PaletteColor {
  name: string;
  shades: { key: string; value: string }[];
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface Palette {
  name: string;
  colors: PaletteColor[];
}
