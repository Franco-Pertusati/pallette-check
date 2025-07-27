import { Injectable } from '@angular/core';
import { PalleteData } from '../interfaces/palleteData';

@Injectable({
  providedIn: 'root'
})
export class PalletService {
  constructor() { }

  generateRandomPalette(): PalleteData {
    const primary = this.generateRandomColor()
    const secondary = this.generateComplementaryColor(primary)

    var pallette: PalleteData = {
      colors: [
        { name: 'Text', hex: '050706' },
        { name: 'Background', hex: 'f8f3fb' },
        { name: 'Primary', hex: primary },
        { name: 'Secondary', hex: secondary},
      ],
      isDark: false
    };

    return pallette
  }

  private generateRandomColor(): string {
    // Genera un color hexadecimal aleatorio
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  generateComplementaryColor(baseColor: string): string {
    // Convertir el color base de HEX a HSL
    const hsl = this.hexToHsl(baseColor);

    // Calcular el matiz complementario (rotar 180 grados)
    const complementaryHue = (hsl.h + 180) % 360;

    // Mantener la misma saturación y luminosidad
    return this.hslToHex(complementaryHue, hsl.s, hsl.l);
  }

  private generateLightColor(): string {
    // Genera un color claro (con alto valor)
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30);
    const lightness = 85 + Math.floor(Math.random() * 15); // 85-100%

    return this.hslToHex(hue, saturation, lightness);
  }

  private generateDarkColor(): string {
    // Genera un color oscuro (con bajo valor)
    const hue = Math.floor(Math.random() * 360);
    const saturation = 30 + Math.floor(Math.random() * 70);
    const lightness = Math.floor(Math.random() * 30); // 0-30%

    return this.hslToHex(hue, saturation, lightness);
  }

  private hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `${f(0)}${f(8)}${f(4)}`;
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    // Convertir HEX a RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Encontrar mínimo y máximo
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h *= 60;
    }

    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}
