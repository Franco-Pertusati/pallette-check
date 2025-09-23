export interface PaletteColor {
  name: string;
  shades: { key: string; value: string }[];
}

export interface Palette {
  name: string;
  colors: PaletteColor[];
  id: string;
  createdAt: number;
  updatedAt: number;
}
