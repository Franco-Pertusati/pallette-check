import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class colorGenerationService {
  colorSchema: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' = 'complementary'

  private readonly scaleConfig = {
    50: { chromaFactor: 1, lightness: 0.95 },
    100: { chromaFactor: 0.95, lightness: 0.92 },
    200: { chromaFactor: 0.97, lightness: 0.86 },
    300: { chromaFactor: 0.96, lightness: 0.78 },
    400: { chromaFactor: 0.94, lightness: 0.68 },
    500: { chromaFactor: 0.98, lightness: 0.60 },
    600: { chromaFactor: 0.79, lightness: 0.49 },
    700: { chromaFactor: 0.75, lightness: 0.44 },
    800: { chromaFactor: 0.68, lightness: 0.38 },
    900: { chromaFactor: 0.62, lightness: 0.26 },
    950: { chromaFactor: 0.72, lightness: 0.15 }
  };

  private readonly defautColors = {
    red: "#f87171",
    orange: "#fb923c",
    amber: "#fbbf24",
    yellow: "#facc15",
    lime: "#a3e635",
    green: "#4ade80",
    emerald: "#34d399",
    teal: "#2dd4bf",
    cyan: "#22d3ee",
    sky: "#38bdf8",
    blue: "#60a5fa",
    indigo: "#818cf8",
    violet: "#a78bfa",
    purple: "#c084fc",
    fuchsia: "#e879f9",
    pink: "#f472b6",
    rose: "#fb7185"
  };

  private readonly scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  generateShades(colorName: string, hexColor: string): { key: string; value: string }[] {
    const hsl = this.hexToHsl(hexColor);
    const baseChroma = hsl.s;

    return this.scaleSteps.map(step => {
      const config = this.scaleConfig[step as keyof typeof this.scaleConfig];

      // Ajustar la saturación basada en el chromaFactor
      const adjustedSaturation = baseChroma * config.chromaFactor;

      // Generar el color con la nueva lightness y saturación ajustada
      const shadeHex = this.hslToHex(hsl.h, adjustedSaturation, config.lightness);

      return {
        key: `${colorName}-${step}`,
        value: shadeHex
      };
    });
  }

  /**
   * Genera un color aleatorio de los colores por defecto
   * @returns {string} Valor hexadecimal del color aleatorio
   */
  generateRandomColor(): string {
    const colorNames = Object.keys(this.defautColors);
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    const randomColorName = colorNames[randomIndex];
    return this.defautColors[randomColorName as keyof typeof this.defautColors];
  }

  /**
   * Genera un color armonioso basado en un color hex usando el esquema configurado
   * @param hexColor Color hex base
   * @returns Color resultante en formato hex
   */
  getHarmoniousColor(hexColor: string): string {
    // Convertir hex a HSL para manipular el hue más fácilmente
    const hsl = this.hexToHsl(hexColor);

    let hueOffset: number;
    let hueVariation: number; // Rango de variación aleatoria

    switch (this.colorSchema) {
      case 'complementary':
        hueOffset = 180;
        hueVariation = 15; // ±15 grados de variación
        break;
      case 'triadic':
        hueOffset = Math.random() < 0.5 ? 120 : 240; // Elegir aleatoriamente entre los dos triádicos
        hueVariation = 5;
        break;
      case 'analogous':
        hueOffset = Math.random() < 0.5 ? 30 : -30; // Elegir aleatoriamente la dirección
        hueVariation = 15;
        break;
      case 'split-complementary':
        hueOffset = Math.random() < 0.5 ? 150 : 210; // Elegir aleatoriamente entre los dos split
        hueVariation = 10;
        break;
      default:
        hueOffset = 180;
        hueVariation = 15;
    }

    // Aplicar variación aleatoria al hue offset
    const randomVariation = (Math.random() * 2 - 1) * hueVariation; // Número entre -hueVariation y +hueVariation
    hueOffset += randomVariation;

    // Calcular nuevo hue
    let newHue = hsl.h + hueOffset;
    if (newHue >= 360) newHue -= 360;
    if (newHue < 0) newHue += 360;

    // Agregar variación aleatoria a saturación y lightness
    const saturationVariation = (Math.random() * 0.2 - 0.1); // ±10% de variación
    const lightnessVariation = (Math.random() * 0.15 - 0.075); // ±7.5% de variación

    const newHsl = {
      h: newHue,
      s: Math.max(0, Math.min(1, hsl.s + saturationVariation)),
      l: Math.max(0, Math.min(1, hsl.l + lightnessVariation))
    };

    // Convertir de vuelta a hex
    return this.hslToHex(newHsl.h, newHsl.s, newHsl.l);
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100) / 100,
      l: Math.round(l * 100) / 100
    };
  }

  private hslToHex(h: number, s: number, l: number): string {
    h = h / 360;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number): string => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;
    return { r, g, b };
  }

  private findColorPosition(lightness: number): number {
    if (lightness > 0.85) return 100;
    if (lightness > 0.75) return 200;
    if (lightness > 0.65) return 300;
    if (lightness > 0.55) return 400;
    if (lightness > 0.45) return 500;
    if (lightness > 0.35) return 600;
    if (lightness > 0.25) return 700;
    if (lightness > 0.20) return 800;
    if (lightness > 0.15) return 900;
    return 950;
  }
}
