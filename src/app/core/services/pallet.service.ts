import { Injectable } from '@angular/core';
import { PalleteData } from '../interfaces/palleteData';

@Injectable({
  providedIn: 'root'
})
export class PalletService {
  constructor() { }

  generateRandomPalette(): PalleteData {
    const primary = this.generateVibrantColorForLightBackground()
    const secondary = this.generateMonochromaticColor(primary)

    var pallette: PalleteData = {
      colors: [
        { name: 'Text', hex: '050706', optimalTextColor: 'black' },
        { name: 'Background', hex: 'f8f3fb', optimalTextColor: 'black' },
        { name: 'Primary', hex: primary, optimalTextColor: 'black' },
        { name: 'Secondary', hex: secondary, optimalTextColor: 'black' },
      ],
      isDark: false
    };

    pallette.colors.forEach(c => {
      c.optimalTextColor = this.getOptimalTextColor(c.hex);
    });

    return pallette
  }

  private generateVibrantColorForLightBackground(): string {
    const hueOptions = [
      0,    // Rojo
      120,  // Verde
      240,  // Azul
      30,   // Naranja
      280   // Púrpura
    ];

    const hue = hueOptions[Math.floor(Math.random() * hueOptions.length)];
    const saturation = 80 + Math.floor(Math.random() * 30); // 70-100%
    const lightness = 40 + Math.floor(Math.random() * 30);  // 30-60%

    return this.hslToHex(hue, saturation, lightness);
  }

  generateComplementaryColor(baseColor: string): string {
    // Validar el color de entrada
    if (!this.isValidHex(baseColor)) {
      console.warn(`Invalid base color: ${baseColor}, using default`);
      baseColor = '000000';
    }

    const hsl = this.hexToHsl(baseColor);
    const complementaryHue = (hsl.h + 180) % 360;
    return this.hslToHex(complementaryHue, hsl.s, hsl.l);
  }

  generateMonochromaticColor(baseColor: string, saturationOffset: number = -30, lightnessOffset: number = 10): string {
    // Convertir el color base a HSL
    const hsl = this.hexToHsl(baseColor);

    // Aplicar los offsets, asegurándose de que estén dentro de los límites válidos (0-100)
    let newSaturation = Math.min(100, Math.max(0, hsl.s + saturationOffset));
    let newLightness = Math.min(100, Math.max(0, hsl.l + lightnessOffset));

    // Convertir de vuelta a HEX
    return this.hslToHex(hsl.h, newSaturation, newLightness);
  }

  private generateLightColor(): string {
    // Genera un color claro (con alto valor)
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30);
    const lightness = 85 + Math.floor(Math.random() * 15); // 85-100%

    return this.hslToHex(hue, saturation, lightness);
  }

  private generateDarkColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 30 + Math.floor(Math.random() * 70);
    const lightness = Math.floor(Math.random() * 30); // 0-30%

    return this.hslToHex(hue, saturation, lightness);
  }

  getOptimalTextColor(backgroundColor: string): 'black' | 'white' {
    // Convertir el color de fondo a RGB
    const rgb = this.hexToRgb(backgroundColor);

    // Calcular el brillo relativo según la fórmula WCAG
    const brightness = this.calculateRelativeLuminance(rgb);

    // El umbral puede ajustarse, pero 0.5 es un buen punto medio
    return brightness > 0.5 ? 'black' : 'white';
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  // Método auxiliar: Calcular luminancia relativa (WCAG)
  private calculateRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    // Convertir valores RGB a espacio de color sRGB
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    // Calcular luminancia relativa
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private hslToHex(h: number, s: number, l: number): string {
    // Asegurar que los valores estén dentro de los rangos válidos
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));

    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      // Asegurar que el valor esté entre 0 y 255 y formatear correctamente
      const value = Math.max(0, Math.min(255, Math.round(255 * color)));
      return value.toString(16).padStart(2, '0');
    };
    const hex = `${f(0)}${f(8)}${f(4)}`;

    // Validación adicional del resultado
    if (!/^[0-9a-f]{6}$/i.test(hex)) {
      console.warn(`Generated invalid HEX color: ${hex}, falling back to default`);
      return '000000'; // Color negro como fallback
    }

    return hex;
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

  private isValidHex(hex: string): boolean {
    return /^[0-9a-f]{6}$/i.test(hex);
  }
}
