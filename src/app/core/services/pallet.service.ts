import { Injectable, signal } from '@angular/core';
import { PalleteData } from '../interfaces/palleteData';
import { ColorData } from '../interfaces/colorData';

@Injectable({
  providedIn: 'root'
})
export class PalletService {
  pallette = signal<PalleteData>({
    colors: [
      { name: 'text', hex: '050706', optimalTextColor: 'white' },
      { name: 'background', hex: 'fcf5ff', optimalTextColor: 'black' },
      { name: 'primary', hex: 'c36bef', optimalTextColor: 'white' },
      { name: 'secondary', hex: 'ef6cc3', optimalTextColor: 'white' },
    ],
    isDark: false
  })

  constructor() { }

  updatePallete(isDarkTheme: boolean, blockedColors: number[], colorMethod: number) {
    const currentColors = [...this.pallette().colors];

    let primaryHex = currentColors[2].hex;
    if (!blockedColors.includes(2)) {
      primaryHex = this.generateVibrantColorForLightBackground();
    }

    // Métodos posibles para el color secundario
    const secondaryGenerators = [
      this.generateAnalogColor.bind(this),
      this.generateMonochromaticColor.bind(this)
      // Puedes agregar más métodos aquí si tienes otros
    ];
    // Elegir uno al azar
    const randomSecondaryGenerator = secondaryGenerators[
      Math.floor(Math.random() * secondaryGenerators.length)
    ];

    const newColors = currentColors.map((color, idx) => {
      if (blockedColors.includes(idx)) {
        return color;
      }
      if (color.name === 'text') {
        return {
          ...color,
          hex: '050706',
          optimalTextColor: 'white' as 'white'
        };
      }
      if (color.name === 'background') {
        const hex = this.generateBackgroundColor(primaryHex);
        return {
          ...color,
          hex,
          optimalTextColor: this.getOptimalTextColor(hex)
        };
      }
      if (color.name === 'primary') {
        return {
          ...color,
          hex: primaryHex,
          optimalTextColor: this.getOptimalTextColor(primaryHex)
        };
      }
      if (color.name === 'secondary') {
        const hex = randomSecondaryGenerator(primaryHex);
        return {
          ...color,
          hex,
          optimalTextColor: this.getOptimalTextColor(hex)
        };
      }
      return color;
    });

    this.pallette.set({
      colors: newColors,
      isDark: false
    });

    this.updateCssVariables();
  }

  updateCssVariables() {
    const palette = this.pallette();
    const root = document.documentElement;

    palette.colors.forEach(color => {
      root.style.setProperty(`--color-${color.name}`, `#${color.hex}`);
    });
  }

  private generateVibrantColorForLightBackground(): string {
    const hueOptions = [
      0,    // Rojo
      30,   // Naranja
      45,   // Amarillo dorado
      60,   // Amarillo
      90,   // Lima
      120,  // Verde
      150,  // Verde azulado
      180,  // Cian
      200,  // Azul cielo
      220,  // Azul claro
      240,  // Azul
      260,  // Índigo
      280,  // Púrpura
      300,  // Magenta
      330   // Rosa
    ];

    const hue = hueOptions[Math.floor(Math.random() * hueOptions.length)];
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 50 + Math.floor(Math.random() * 30);

    return this.hslToHex(hue, saturation, lightness);
  }


  generateMonochromaticColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);
    const sVar = Math.floor(Math.random() * (12 - (-12) + 1)) + (-12);

    return this.hslToHex(hsl.h, hsl.s + sVar, hsl.l + sVar);
  }

  generateAnalogColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);
    // Aleatoriza el ángulo entre +20 y +60 grados respecto al color base
    const angle = 20 + Math.floor(Math.random() * 41); // 20 a 60
    const newHue = (hsl.h + angle) % 360;
    // Opcional: variar un poco la saturación y luminosidad
    const satVariation = Math.floor(Math.random() * 11) - 5; // -5 a +5
    const lightVariation = Math.floor(Math.random() * 11) - 5; // -5 a +5
    const newS = Math.max(0, Math.min(100, hsl.s + satVariation));
    const newL = Math.max(0, Math.min(100, hsl.l + lightVariation));
    return this.hslToHex(newHue, newS, newL);
  }

  private generateBackgroundColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);

    let newLightness = Math.floor(Math.random() * 5) + 96;
    let newSaturation = 100;

    return this.hslToHex(hsl.h, newSaturation, newLightness);
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
