import { Injectable, signal } from '@angular/core';
import { PalleteData } from '../interfaces/palleteData';
import { ColorData } from '../interfaces/colorData';

@Injectable({
  providedIn: 'root'
})
export class PalletteService {
  /**
   * Signal holding the current palette data.
   */
  pallette = signal<PalleteData>({
    colors: [
      { name: 'text', hex: '050706', optimalTextColor: 'white', blocked: false, shades: [] },
      { name: 'background', hex: 'fcf5ff', optimalTextColor: 'black', blocked: false, shades: [] },
      { name: 'primary', hex: 'ef6cc3', optimalTextColor: 'white', blocked: false, shades: [] },
      { name: 'secondary', hex: 'ef6cc3', optimalTextColor: 'white', blocked: false, shades: [] },
    ],
    isDark: false
  })

  constructor() { }

  /**
   * Updates the palette with new colors.
   * - Generates a new primary color if not blocked.
   * - Generates a new secondary color using a random method.
   * - Updates CSS variables after setting the new palette.
   * @param isDarkTheme Whether the palette should be dark (currently ignored).
   * @param colorMethod Color generation method (currently unused).
   */
  updatePallete() {
    const currentColors = [...this.pallette().colors];

    let primaryHex = currentColors[2].hex;
    if (!currentColors[2].blocked) {
      primaryHex = this.generatePrimaryColor();
    }

    // Array of secondary color generation methods
    const secondaryGenerators = [
      this.generateAnalogColor.bind(this),
      this.generateMonochromaticColor.bind(this),
      this.generateComplementary.bind(this)
    ];
    // Randomly select one method
    const randomSecondaryGenerator = secondaryGenerators[
      Math.floor(Math.random() * secondaryGenerators.length)
    ];

    const newColors = currentColors.map((color, idx) => {
      if (color.blocked) {
        return color;
      }
      if (color.name === 'text') {
        const newHexValue = this.generateTextColor()
        const newOptimalTxtColor = this.getOptimalTextColor(newHexValue)
        return {
          ...color,
          hex: newHexValue,
          optimalTextColor: newOptimalTxtColor
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
          optimalTextColor: this.getOptimalTextColor(primaryHex),
          shades: this.generateTailwindPalette(primaryHex)
        };
      }
      if (color.name === 'secondary') {
        const hex = randomSecondaryGenerator(primaryHex);
        return {
          ...color,
          hex,
          optimalTextColor: this.getOptimalTextColor(hex),
          shades: this.generateTailwindPalette(hex)
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

  /**
   * Updates the global CSS variables for the palette colors.
   */
  updateCssVariables() {
    const palette = this.pallette();
    const root = document.documentElement;

    palette.colors.forEach(color => {
      root.style.setProperty(`--color-${color.name}`, `#${color.hex}`);

      if (color.shades) {
        color.shades.forEach(shade => {
          root.style.setProperty(`--color-${color.name}-${shade.name}`, `${shade.hex}`);
        });
      }
    });
  }

  /**
   * Generates a vibrant color.
   * @returns HEX color string
   */
  /**
   * Generates a random primary color in hexadecimal format.
   *
   * The color is selected by randomly choosing a hue from a predefined set of primary and secondary hues,
   * then randomly generating saturation and lightness values within specified ranges.
   * The resulting HSL color is converted to its hexadecimal representation.
   *
   * @returns {string} The generated color as a hex string (e.g., "#ff5733").
   */
  private generatePrimaryColor(): string {
    const hueOptions = [
      0,    // Rojo
      15,   // Rojo anaranjado
      25,   // Naranja
      35,   // Naranja dorado
      45,   // Amarillo dorado
      55,   // Amarillo cálido
      60,   // Amarillo
      75,   // Amarillo verdoso
      90,   // Lima
      105,  // Verde lima
      120,  // Verde
      135,  // Verde bosque
      150,  // Verde azulado
      165,  // Verde agua
      180,  // Cian
      195,  // Azul verdoso
      210,  // Azul cielo
      220,  // Azul claro
      230,  // Azul pastel
      240,  // Azul
      250,  // Azul profundo
      260,  // Índigo
      270,  // Violeta
      280,  // Púrpura
      290,  // Púrpura magenta
      300,  // Magenta
      315,  // Rosa magenta
      330,  // Rosa
      345   // Rojo rosado
    ];

    const hue = hueOptions[Math.floor(Math.random() * hueOptions.length)];
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 50 + Math.floor(Math.random() * 30);

    return this.hslToHex(hue, saturation, lightness);
  }

  /**
   * Generates a monochromatic color based on a base color.
   * @param baseColor HEX color string
   * @returns HEX color string
   */
  generateMonochromaticColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);
    const sVar = Math.floor(Math.random() * (12 - (-12) + 1)) + (-12);

    // Ensure a minimum lightness difference of 15 units
    let newL = hsl.l + sVar;
    if (Math.abs(newL - hsl.l) < 15) {
      newL = hsl.l + (newL > hsl.l ? 15 : -15);
    }
    // Clamp lightness between 0 and 100
    newL = Math.max(0, Math.min(100, newL));

    return this.hslToHex(hsl.h, hsl.s + sVar, newL);
  }

  /**
 * Generates a monochromatic color based on a base color.
 * @param baseColor HEX color string
 * @returns HEX color string
 */
  generateComplementary(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);
    const complementaryHue = (hsl.h + 180) % 360;

    return this.hslToHex(complementaryHue, hsl.s, hsl.l);
  }


  /**
   * Generates an analog color based on a base color.
   * @param baseColor HEX color string
   * @returns HEX color string
   */
  generateAnalogColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);
    // Randomize the angle between +20 and +60 degrees from the base color
    const angle = 20 + Math.floor(Math.random() * 41); // 20 to 60
    const newHue = (hsl.h + angle) % 360;
    // Optionally vary saturation and lightness
    const satVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
    const lightVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
    const newS = Math.max(0, Math.min(100, hsl.s + satVariation));
    const newL = Math.max(0, Math.min(100, hsl.l + lightVariation));
    return this.hslToHex(newHue, newS, newL);
  }

  /**
   * Generates a background color based on a base color.
   * @param baseColor HEX color string
   * @returns HEX color string
   */
  private generateBackgroundColor(baseColor: string): string {
    const hsl = this.hexToHsl(baseColor);

    const isDarkTheme = this.getCurrentTheme();

    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const newLightness = isDarkTheme
      ? randomInt(10, 15) // oscuro: 10–15%
      : randomInt(96, 100); // claro: 96–100%

    const newSaturation = isDarkTheme
      ? randomInt(20, 30) // oscuro: 20–30%
      : randomInt(96, 100); // claro: 96–100%

    return this.hslToHex(hsl.h, newSaturation, newLightness);
  }

  /**
   * Generates a neutral text color HEX value based on the theme.
   * @param isDark If true, generates a light neutral color; otherwise, a dark neutral color.
   * @returns HEX color string
   */
  generateTextColor(): string {
    // For light theme, generate a dark neutral (near black)
    // For dark theme, generate a light neutral (near white)
    const lightness = this.getCurrentTheme()
      ? 90 + Math.floor(Math.random() * 6) // 90-95% lightness for light text
      : 5 + Math.floor(Math.random() * 6); // 5-10% lightness for dark text
    const hue = 0; // Neutral gray
    const saturation = 0; // No color, pure gray
    return this.hslToHex(hue, saturation, lightness);
  }

  /**
   * Returns the optimal text color ('black' or 'white') for a given background color.
   * @param backgroundColor HEX color string
   * @returns 'black' or 'white'
   */
  getOptimalTextColor(backgroundColor: string): 'black' | 'white' {
    const rgb = this.hexToRgb(backgroundColor);
    const brightness = this.calculateRelativeLuminance(rgb);
    return brightness > 0.5 ? 'black' : 'white';
  }

  /**
   * Converts a HEX color string to an RGB object.
   * @param hex HEX color string
   * @returns RGB object
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  /**
   * Calculates the relative luminance of an RGB color (WCAG formula).
   * @param rgb RGB object
   * @returns Relative luminance value (0-1)
   */
  private calculateRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  generateTailwindPalette(hex: string): ColorData[] {
    hex = hex.replace(/^#/, '').toLowerCase();
    const baseHSL = this.hexToHsl(hex);

    const lightnessMap = {
      '50': 95,
      '100': 90,
      '200': 80,
      '300': 70,
      '400': 60,
      '500': 50,
      '600': 40,
      '700': 30,
      '800': 20,
      '900': 15,
      '950': 10,
    };

    let closestKey = '500';
    let minDiff = Infinity;
    for (const [key, l] of Object.entries(lightnessMap)) {
      const diff = Math.abs(baseHSL.l - l);
      if (diff < minDiff) {
        minDiff = diff;
        closestKey = key;
      }
    }

    const result: ColorData[] = [];
    const baseL = baseHSL.l;

    for (const [key, targetL] of Object.entries(lightnessMap)) {
      const delta = targetL - baseL;
      const adjustedL = baseHSL.l + delta;
      const adjustedS = baseHSL.s > 20 ? baseHSL.s - Math.abs(delta) * 0.1 : baseHSL.s;
      const hexValue = `${this.hslToHex(baseHSL.h, adjustedS, adjustedL)}`;
      result.push({
        name: key,
        hex: `#${hexValue}`,
        optimalTextColor: this.getOptimalTextColor(hexValue),
        blocked: false,
        shades: []
      });
    }

    return result;
  }


  /**
   * Converts HSL values to a HEX color string.
   * @param h Hue (0-360)
   * @param s Saturation (0-100)
   * @param l Lightness (0-100)
   * @returns HEX color string
   */
  private hslToHex(h: number, s: number, l: number): string {
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));

    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      const value = Math.max(0, Math.min(255, Math.round(255 * color)));
      return value.toString(16).padStart(2, '0');
    };
    const hex = `${f(0)}${f(8)}${f(4)}`;

    if (!/^[0-9a-f]{6}$/i.test(hex)) {
      console.warn(`Generated invalid HEX color: ${hex}, falling back to default`);
      return '000000';
    }

    return hex;
  }

  /**
   * Converts a HEX color string to HSL values.
   * @param hex HEX color string
   * @returns HSL object
   */
  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

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

  /**
   * Validates if a string is a valid HEX color.
   * @param hex HEX color string
   * @returns true if valid, false otherwise
   */
  private isValidHex(hex: string): boolean {
    return /^[0-9a-f]{6}$/i.test(hex);
  }

  getCurrentTheme(): boolean {
    return localStorage.getItem('theme') === 'dark';
  }
}
