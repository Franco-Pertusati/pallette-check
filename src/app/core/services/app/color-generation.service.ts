import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class colorGenerationService {
  private readonly scaleConfig = {
    50: { lightness: 0.95, chromaFactor: 0.05 },
    100: { lightness: 0.92, chromaFactor: 0.10 },
    200: { lightness: 0.87, chromaFactor: 0.25 },
    300: { lightness: 0.76, chromaFactor: 0.45 },
    400: { lightness: 0.64, chromaFactor: 0.70 },
    500: { lightness: 0.52, chromaFactor: 1.0 },
    600: { lightness: 0.45, chromaFactor: 0.90 },
    700: { lightness: 0.37, chromaFactor: 0.75 },
    800: { lightness: 0.29, chromaFactor: 0.60 },
    900: { lightness: 0.24, chromaFactor: 0.45 },
    950: { lightness: 0.15, chromaFactor: 0.25 }
  };

  private readonly defautColors = {
    red: "#ef4444",
    orange: "#f97316",
    amber: "#f59e0b",
    yellow: "#eab308",
    lime: "#84cc16",
    green: "#22c55e",
    emerald: "#10b981",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    sky: "#0ea5e9",
    blue: "#3b82f6",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    purple: "#a855f7",
    fuchsia: "#d946ef",
    pink: "#ec4899",
    rose: "#f43f5e"
  };

  private readonly scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  /**
   * Obtiene los factores de ajuste de chroma basados en el hue
   */
  private getHueAdjustments(hue: number): { chromaMultiplier: number; maxChroma: number } {
    // Normalizar hue a 0-360
    hue = ((hue % 360) + 360) % 360;

    // Calibración basada en los valores reales de Tailwind CSS
    if (hue >= 45 && hue <= 75) {
      // Amarillos - muy problemáticos, necesitan chroma mucho más bajo
      return { chromaMultiplier: 0.3, maxChroma: 0.12 };
    } else if (hue >= 15 && hue <= 45) {
      // Naranjas - también problemáticos pero menos
      return { chromaMultiplier: 0.5, maxChroma: 0.16 };
    } else if (hue >= 345 || hue <= 15) {
      // Rojos - necesitan ajuste moderado
      return { chromaMultiplier: 0.7, maxChroma: 0.18 };
    } else if (hue >= 75 && hue <= 165) {
      // Verdes - generalmente funcionan bien
      return { chromaMultiplier: 0.85, maxChroma: 0.22 };
    } else if (hue >= 165 && hue <= 285) {
      // Azules y cyans - los que mejor funcionan
      return { chromaMultiplier: 1.0, maxChroma: 0.25 };
    } else if (hue >= 285 && hue <= 345) {
      // Purples y magentas - ajuste ligero
      return { chromaMultiplier: 0.8, maxChroma: 0.20 };
    }

    // Fallback
    return { chromaMultiplier: 0.8, maxChroma: 0.18 };
  }

  /**
   * Genera shades basado en un color hex (método mejorado)
   */
  generateShades(colorName: string, hexColor: string): { key: string; value: string }[] {
    // Convertir hex a OKLCH
    const baseOklch = this.hexToOklch(hexColor);

    // Obtener ajustes específicos para este hue
    const hueAdjustments = this.getHueAdjustments(baseOklch.h);

    // Determinar posición del color en la escala
    const basePosition = this.findColorPosition(baseOklch.l);

    // Calcular chroma de referencia para posición 500
    const baseConfig = this.scaleConfig[basePosition as keyof typeof this.scaleConfig];
    let referenceChroma = (baseOklch.c / baseConfig.chromaFactor) * this.scaleConfig[500].chromaFactor;

    // Aplicar multiplicador específico del hue
    referenceChroma *= hueAdjustments.chromaMultiplier;

    // Limitar el chroma máximo según el hue
    referenceChroma = Math.min(referenceChroma, hueAdjustments.maxChroma);

    // Generar todas las variantes
    const paletteArray: { key: string; value: string }[] = [];

    for (const step of this.scaleSteps) {
      const config = this.scaleConfig[step as keyof typeof this.scaleConfig];

      // Calcular chroma ajustado
      let adjustedChroma = referenceChroma * config.chromaFactor;

      // Aplicar límites de chroma más específicos por shade
      if (step <= 100) {
        adjustedChroma = Math.min(adjustedChroma, 0.02);
      } else if (step <= 200) {
        adjustedChroma = Math.min(adjustedChroma, 0.05);
      } else if (step >= 900) {
        // Los tonos oscuros necesitan menos chroma para amarillos/naranjas
        const darkLimit = baseOklch.h >= 45 && baseOklch.h <= 75 ? 0.04 : 0.08;
        adjustedChroma = Math.min(adjustedChroma, darkLimit);
      }

      const variantOklch = {
        l: config.lightness,
        c: adjustedChroma,
        h: baseOklch.h
      };

      // Convertir de vuelta a hex
      const hexValue = this.oklchToHex(variantOklch.l, variantOklch.c, variantOklch.h);

      // Agregar al array
      paletteArray.push({
        key: `--color-${colorName}-${step}`,
        value: hexValue
      });
    }

    return paletteArray;
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
   * Genera un color armonioso basado en un color hex usando diferentes esquemas
   * @param hexColor Color hex base
   * @param type Tipo de armonía ('complementary' | 'triadic' | 'analogous' | 'split-complementary')
   * @returns Color resultante en formato hex
   */
  getHarmoniousColor(hexColor: string, type: 'complementary' | 'triadic' | 'analogous' | 'split-complementary' = 'complementary'): string {
    // Convertir hex a HSL para manipular el hue más fácilmente
    const hsl = this.hexToHsl(hexColor);

    let hueOffset: number;

    switch (type) {
      case 'complementary':
        hueOffset = 180;
        break;
      case 'triadic':
        hueOffset = 120; // Podríamos devolver 240 también, pero uno es suficiente
        break;
      case 'analogous':
        hueOffset = 30; // Color cercano, podríamos usar -30 también
        break;
      case 'split-complementary':
        hueOffset = 150; // Podríamos usar 210 también
        break;
      default:
        hueOffset = 180;
    }

    // Calcular nuevo hue
    let newHue = hsl.h + hueOffset;
    if (newHue >= 360) newHue -= 360;
    if (newHue < 0) newHue += 360;

    // Crear nuevo color con el mismo saturation y lightness
    const newHsl = {
      h: newHue,
      s: hsl.s,
      l: hsl.l
    };

    // Convertir de vuelta a hex
    return this.hslToHex(newHsl.h, newHsl.s, newHsl.l);
  }

  // ... (resto de métodos privados sin cambios)
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

  private hexToOklch(hex: string): { l: number; c: number; h: number } {
    const rgb = this.hexToRgb(hex);
    return this.rgbToOklch(rgb.r, rgb.g, rgb.b);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;
    return { r, g, b };
  }

  private rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
    const rLin = this.sRgbToLinear(r);
    const gLin = this.sRgbToLinear(g);
    const bLin = this.sRgbToLinear(b);

    const x = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
    const y = 0.2126729 * rLin + 0.7151522 * gLin + 0.0721750 * bLin;
    const z = 0.0193339 * rLin + 0.1191920 * gLin + 0.9503041 * bLin;

    const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
    const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);

    const l = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    const c = Math.sqrt(a * a + bLab * bLab);
    let h = Math.atan2(bLab, a) * 180 / Math.PI;
    if (h < 0) h += 360;

    return { l, c, h };
  }

  private sRgbToLinear(val: number): number {
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
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

  private oklchToHex(l: number, c: number, h: number): string {
    l = Math.max(0, Math.min(1, l));
    c = Math.max(0, c);

    let mappedC = c;
    let isInGamut = false;
    let iterations = 0;
    const maxIterations = 50;

    while (!isInGamut && iterations < maxIterations) {
      const testColor = this.oklchToRgbRaw(l, mappedC, h);

      if (testColor.r >= 0 && testColor.r <= 1 &&
        testColor.g >= 0 && testColor.g <= 1 &&
        testColor.b >= 0 && testColor.b <= 1) {
        isInGamut = true;
      } else {
        mappedC *= 0.95;
      }
      iterations++;
    }

    if (!isInGamut) {
      mappedC = 0.001;
    }

    const rgb = this.oklchToRgbRaw(l, mappedC, h);

    const r = Math.max(0, Math.min(1, rgb.r));
    const g = Math.max(0, Math.min(1, rgb.g));
    const b = Math.max(0, Math.min(1, rgb.b));

    const rSrgb = this.linearToSRgb(r);
    const gSrgb = this.linearToSRgb(g);
    const bSrgb = this.linearToSRgb(b);

    const rHex = Math.round(rSrgb * 255).toString(16).padStart(2, '0');
    const gHex = Math.round(gSrgb * 255).toString(16).padStart(2, '0');
    const bHex = Math.round(bSrgb * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }

  private oklchToRgbRaw(l: number, c: number, h: number): { r: number; g: number; b: number } {
    const hRad = h * Math.PI / 180;
    const a = c * Math.cos(hRad);
    const bLab = c * Math.sin(hRad);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * bLab;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * bLab;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * bLab;

    const l3 = Math.sign(l_) * Math.pow(Math.abs(l_), 3);
    const m3 = Math.sign(m_) * Math.pow(Math.abs(m_), 3);
    const s3 = Math.sign(s_) * Math.pow(Math.abs(s_), 3);

    const x = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const y = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const z = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    const r = +3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
    const b = +0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    return { r, g, b };
  }

  private linearToSRgb(val: number): number {
    return val <= 0.0031308 ? val * 12.92 : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  }
}
