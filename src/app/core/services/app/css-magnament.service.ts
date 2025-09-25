import { Injectable } from '@angular/core';
import { Palette } from '../../interfaces/palette';

@Injectable({
  providedIn: 'root'
})
export class CssMagnamentService {

  /**
   * Aplica las variables CSS de una paleta al :root del documento
   * @param palette La paleta con los colores a aplicar
   */
  applyCSSVariables(palette: Palette): void {
    if (!palette || palette.colors.length === 0) {
      console.warn('No hay paleta o la paleta está vacía');
      return;
    }

    const colorNames = ['primary', 'secondary', 'accent'];
    const rootElement = document.documentElement;

    // Si hay solo un color, aplicarlo a todas las variables
    if (palette.colors.length === 1) {
      const singleColor = palette.colors[0];

      colorNames.forEach(colorName => {
        singleColor.shades.forEach(shade => {
          const shadeNumber = shade.key.split('-').pop();
          const cssVariableName = `--color-${colorName}-${shadeNumber}`;
          rootElement.style.setProperty(cssVariableName, shade.value);
        });
      });

      console.log('Variable CSS única aplicada a primary, secondary y accent');
      return;
    }

    // Lógica normal para múltiples colores
    palette.colors.forEach((color, index) => {
      const colorName = colorNames[index];
      if (colorName) {
        color.shades.forEach(shade => {
          const shadeNumber = shade.key.split('-').pop();
          const cssVariableName = `--color-${colorName}-${shadeNumber}`;
          rootElement.style.setProperty(cssVariableName, shade.value);
        });
      }
    });

    console.log('Variables CSS aplicadas al :root');
  }

  /**
   * Limpia todas las variables CSS de colores del :root
   */
  clearCSSVariables(): void {
    const colorNames = ['primary', 'secondary', 'accent'];
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const rootElement = document.documentElement;

    colorNames.forEach(colorName => {
      shades.forEach(shade => {
        const cssVariableName = `--color-${colorName}-${shade}`;
        rootElement.style.removeProperty(cssVariableName);
      });
    });

    console.log('Variables CSS limpiadas del :root');
  }
}
