import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class colorGenerationService {
  private readonly scaleConfig = {
    50: { lightness: 0.97, chromaFactor: 0.05 },
    100: { lightness: 0.94, chromaFactor: 0.10 },
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

  private readonly scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  /**
   * Genera una paleta completa basada en un color hex
   */
generatePalette(hexColor: string, colorName: string): { key: string; value: string }[] {
  // Convertir hex a OKLCH
  const baseOklch = this.hexToOklch(hexColor);

  // Determinar posición del color en la escala
  const basePosition = this.findColorPosition(baseOklch.l);

  // Calcular chroma de referencia para posición 500
  const baseConfig = this.scaleConfig[basePosition as keyof typeof this.scaleConfig];
  const referenceChroma = (baseOklch.c / baseConfig.chromaFactor) * this.scaleConfig[500].chromaFactor;

  // Generar todas las variantes
  const paletteArray: { key: string; value: string }[] = [];

  for (const step of this.scaleSteps) {
    const config = this.scaleConfig[step as keyof typeof this.scaleConfig];

    // Calcular chroma ajustado
    let adjustedChroma = referenceChroma * config.chromaFactor;

    // Aplicar límites de chroma más restrictivos
    if (step <= 100) {
      adjustedChroma = Math.min(adjustedChroma, 0.02);
    } else if (step <= 200) {
      adjustedChroma = Math.min(adjustedChroma, 0.06);
    } else if (step >= 900) {
      adjustedChroma = Math.min(adjustedChroma, 0.08);
    }

    const variantOklch = {
      l: config.lightness,
      c: adjustedChroma,
      h: baseOklch.h
    };

    // Convertir de vuelta a hex
    const hexValue = this.oklchToHex(variantOklch.l, variantOklch.c, variantOklch.h);

    // Agregar al array en lugar del objeto
    paletteArray.push({
      key: `--color-${colorName}-${step}`,
      value: hexValue
    });
  }

  return paletteArray;
}

  /**
   * Convierte un color HEX a OKLCH
   */
  private hexToOklch(hex: string): { l: number; c: number; h: number } {
    // Convertir hex a RGB
    const rgb = this.hexToRgb(hex);

    // Convertir RGB a OKLCH
    return this.rgbToOklch(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Convierte HEX a RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;
    return { r, g, b };
  }

  /**
   * Convierte RGB a OKLCH
   */
  private rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
    // Convertir a RGB lineal
    const rLin = this.sRgbToLinear(r);
    const gLin = this.sRgbToLinear(g);
    const bLin = this.sRgbToLinear(b);

    // Convertir a XYZ (D65)
    const x = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
    const y = 0.2126729 * rLin + 0.7151522 * gLin + 0.0721750 * bLin;
    const z = 0.0193339 * rLin + 0.1191920 * gLin + 0.9503041 * bLin;

    // Convertir a OKLAB
    const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
    const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);

    const l = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    // Convertir a OKLCH
    const c = Math.sqrt(a * a + bLab * bLab);
    let h = Math.atan2(bLab, a) * 180 / Math.PI;
    if (h < 0) h += 360;

    return { l, c, h };
  }

  /**
   * Convierte sRGB a RGB lineal
   */
  private sRgbToLinear(val: number): number {
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  }

  /**
   * Determina la posición del color en la escala basado en su luminosidad
   */
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

  /**
   * Convierte OKLCH de vuelta a HEX con gamut mapping
   */
  private oklchToHex(l: number, c: number, h: number): string {
    // Clamp de lightness
    l = Math.max(0, Math.min(1, l));
    c = Math.max(0, c);

    // Gamut mapping: reducir chroma hasta que el color esté en gamut sRGB
    let mappedC = c;
    let isInGamut = false;
    let iterations = 0;
    const maxIterations = 50;

    while (!isInGamut && iterations < maxIterations) {
      const testColor = this.oklchToRgbRaw(l, mappedC, h);

      // Verificar si está en gamut sRGB (todos los valores entre 0 y 1)
      if (testColor.r >= 0 && testColor.r <= 1 &&
        testColor.g >= 0 && testColor.g <= 1 &&
        testColor.b >= 0 && testColor.b <= 1) {
        isInGamut = true;
      } else {
        // Reducir chroma en un 5% y volver a probar
        mappedC *= 0.95;
      }
      iterations++;
    }

    // Si no se pudo mapear, usar chroma mínimo
    if (!isInGamut) {
      mappedC = 0.001;
    }

    // Convertir con el chroma mapeado
    const rgb = this.oklchToRgbRaw(l, mappedC, h);

    // Clamp final por seguridad
    const r = Math.max(0, Math.min(1, rgb.r));
    const g = Math.max(0, Math.min(1, rgb.g));
    const b = Math.max(0, Math.min(1, rgb.b));

    // Convertir a sRGB
    const rSrgb = this.linearToSRgb(r);
    const gSrgb = this.linearToSRgb(g);
    const bSrgb = this.linearToSRgb(b);

    // Convertir a HEX
    const rHex = Math.round(rSrgb * 255).toString(16).padStart(2, '0');
    const gHex = Math.round(gSrgb * 255).toString(16).padStart(2, '0');
    const bHex = Math.round(bSrgb * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }

  /**
   * Convierte OKLCH a RGB lineal sin clamp (para gamut testing)
   */
  private oklchToRgbRaw(l: number, c: number, h: number): { r: number; g: number; b: number } {
    // Convertir OKLCH a OKLAB
    const hRad = h * Math.PI / 180;
    const a = c * Math.cos(hRad);
    const bLab = c * Math.sin(hRad);

    // Convertir OKLAB a RGB lineal
    const l_ = l + 0.3963377774 * a + 0.2158037573 * bLab;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * bLab;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * bLab;

    const l3 = Math.sign(l_) * Math.pow(Math.abs(l_), 3);
    const m3 = Math.sign(m_) * Math.pow(Math.abs(m_), 3);
    const s3 = Math.sign(s_) * Math.pow(Math.abs(s_), 3);

    const x = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const y = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const z = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    // Convertir XYZ a RGB lineal
    const r = +3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
    const b = +0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    return { r, g, b };
  }

  /**
   * Convierte RGB lineal a sRGB
   */
  private linearToSRgb(val: number): number {
    return val <= 0.0031308 ? val * 12.92 : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  }
}
