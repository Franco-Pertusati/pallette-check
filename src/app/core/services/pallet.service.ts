import { Injectable, signal } from '@angular/core';
import { PalleteData } from '../interfaces/palleteData';
import { ColorData } from '../interfaces/colorData';

@Injectable({
  providedIn: 'root'
})
export class PalletService {
  pallette = signal<PalleteData>({
    colors: [
      { name: 'Text', hex: '050706', optimalTextColor: 'white' },
      { name: 'Background', hex: 'fcf5ff', optimalTextColor: 'black' },
      { name: 'Primary', hex: 'c36bef', optimalTextColor: 'white' },
      { name: 'secondary', hex: 'ef6cc3', optimalTextColor: 'white' },
    ],
    isDark: false
  })

  constructor() { }

  updatePallete(isDarkTheme: boolean, blockedColors: number[], colorMethod: number) {
    // Copia la paleta actual
    const currentColors = [...this.pallette().colors];

    // Genera nuevos colores solo para los que no están bloqueados
    const newColors = currentColors.map((color, idx) => {
      if (blockedColors.includes(idx)) {
        return color; // No modificar si está bloqueado
      }
      // Puedes expandir la lógica según el método de color
      if (color.name === 'Text') {
        return {
          ...color,
          hex: '050706',
          optimalTextColor: 'white' as 'white'
        };
      }
      if (color.name === 'Background') {
        const hex = this.generateBackgroundColor(currentColors[2].hex);
        return {
          ...color,
          hex,
          optimalTextColor: this.getOptimalTextColor(hex)
        };
      }
      if (color.name === 'Primary') {
        const hex = this.generateVibrantColorForLightBackground();
        return {
          ...color,
          hex,
          optimalTextColor: this.getOptimalTextColor(hex)
        };
      }
      if (color.name === 'secondary') {
        const hex = this.generateMonochromaticColor(currentColors[2].hex); // Basado en Primary
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


  generateMonochromaticColor(baseColor: string, saturationOffset: number = -30, lightnessOffset: number = 10): string {
    // Convertir el color base a HSL
    const hsl = this.hexToHsl(baseColor);

    // Aplicar los offsets, asegurándose de que estén dentro de los límites válidos (0-100)
    let newSaturation = Math.min(100, Math.max(0, hsl.s + saturationOffset));
    let newLightness = Math.min(100, Math.max(0, hsl.l + lightnessOffset));

    // Convertir de vuelta a HEX
    return this.hslToHex(hsl.h, newSaturation, newLightness);
  }

  generateAnalogColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);
    return this.hslToHex(hsl.h + 40, hsl.s, hsl.l);
  }

  private generateBackgroundColor(baseColor: string): string {
    // Convertir el color base a HSL
    const hsl = this.hexToHsl(baseColor);

    // Reducir la luminosidad para obtener un color más oscuro
    let newLightness = 98;

    // Mantener la saturación igual o aumentarla ligeramente para evitar colores apagados
    let newSaturation = 100;

    // Convertir de vuelta a HEX
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
