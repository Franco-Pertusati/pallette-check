import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Palette, PaletteColor } from '../../interfaces/palette';
import { colorGenerationService } from './color-generation.service';
import { CssMagnamentService } from './css-magnament.service';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {
  colorGeneration = inject(colorGenerationService)
  cssMagnament = inject(CssMagnamentService)

  palettes = signal<Palette[]>([]);
  currentPaletteIndex = signal<number>(0);

  currentPalette = linkedSignal(() => {
    const palettes = this.palettes();
    const index = this.currentPaletteIndex();
    return palettes[index] || null;
  });


  constructor() {
    effect(() => {
      const palette = this.currentPalette();
      if (palette && palette.colors.length > 0) {
        this.cssMagnament.applyCSSVariables(this.currentPalette());
      }
    });
  }

  createPalette(name: string): void {
    const newPalette: Palette = {
      name: name.trim() || 'New Palette',
      colors: [],
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const initialColorName = 'Primary'
    const generatedShades = this.colorGeneration.generateShades(initialColorName, this.colorGeneration.generateRandomColor())

    const initialColor: PaletteColor = {
      name: initialColorName,
      shades: generatedShades
    }

    newPalette.colors.push(initialColor)

    this.palettes.update(currentPalettes => [...currentPalettes, newPalette]);
  }

  deletePalette(paletteId: string): void { }
  renamePalette(paletteId: string, newName: string): void { }
  setCurrentPalette(index: number): void { }
  // getAllPalettes(): Palette[] { }


  addColorToPalette(): void {
    console.log(this.currentPalette().colors)
    const currentPalettes = this.palettes();
    const currentIndex = this.currentPaletteIndex();

    // Verificar que existe una paleta actual
    if (currentIndex < 0 || !currentPalettes[currentIndex]) {
      console.warn('No hay paleta actual seleccionada');
      return;
    }

    // Verificar si no tiene 3 colores
    if (this.currentPalette().colors.length > 2) {
      return
    }

    const colorsLenght = this.currentPalette().colors.length

    const newName = () => {
      if (colorsLenght === 2) return 'Accent'
      if (colorsLenght === 1) return 'Secondary'
      return 'Primary'
    }

    const baseHex = () => {
      if (colorsLenght > 1) return this.colorGeneration.getHarmoniousColor(this.currentPalette().colors[0].shades[5].value, 'complementary')
      return this.colorGeneration.generateRandomColor()
    }

    var newColor: PaletteColor = {
      name: newName(),
      shades: this.colorGeneration.generateShades(newName(), baseHex())
    }

    // Actualizar la paleta agregando el nuevo color
    this.palettes.update(palettes => {
      const updatedPalettes = [...palettes];
      const targetPalette = { ...updatedPalettes[currentIndex] };

      // Agregar el nuevo color y actualizar timestamp
      targetPalette.colors = [...targetPalette.colors, newColor];
      targetPalette.updatedAt = Date.now();

      updatedPalettes[currentIndex] = targetPalette;
      return updatedPalettes;
    });
  }

  /**
   * Remueve un color de la paleta actual
   * @param colorIndex Índice del color a remover (0, 1 o 2)
   */
  removeColorFromPalette(colorIndex: number): void {
    const currentPalettes = this.palettes();
    const currentIndex = this.currentPaletteIndex();

    // Verificar que existe una paleta actual
    if (currentIndex < 0 || !currentPalettes[currentIndex]) {
      console.warn('No hay paleta actual seleccionada');
      return;
    }

    const currentPalette = currentPalettes[currentIndex];

    // Verificar que el índice es válido
    if (colorIndex < 0 || colorIndex >= currentPalette.colors.length) {
      console.warn(`Índice de color inválido: ${colorIndex}. La paleta tiene ${currentPalette.colors.length} colores`);
      return;
    }

    // Verificar que no sea el único color
    if (currentPalette.colors.length === 1) {
      console.warn('No se puede eliminar el único color de la paleta');
      return;
    }

    // Obtener el nombre del color antes de eliminarlo
    const colorName = currentPalette.colors[colorIndex].name;

    // Actualizar la paleta removiendo el color
    this.palettes.update(palettes => {
      const updatedPalettes = [...palettes];
      const targetPalette = { ...updatedPalettes[currentIndex] };

      // Remover el color del array y actualizar timestamp
      targetPalette.colors = targetPalette.colors.filter((_, index) => index !== colorIndex);
      targetPalette.updatedAt = Date.now();

      updatedPalettes[currentIndex] = targetPalette;
      return updatedPalettes;
    });

    console.log(`Color removido: ${colorName} (índice ${colorIndex})`);
  }

  /**
   * Actualiza el nombre de un color en la paleta actual
   * @param colorIndex Índice del color a renombrar (0, 1 o 2)
   * @param newName Nuevo nombre del color
   */
  renameColorInPalette(colorIndex: number, newName: string): void {
    const currentPalettes = this.palettes();
    const currentIndex = this.currentPaletteIndex();

    // Verificar que existe una paleta actual
    if (currentIndex < 0 || !currentPalettes[currentIndex]) {
      console.warn('No hay paleta actual seleccionada');
      return;
    }

    const currentPalette = currentPalettes[currentIndex];

    // Verificar que el índice es válido
    if (colorIndex < 0 || colorIndex >= currentPalette.colors.length) {
      console.warn(`Índice de color inválido: ${colorIndex}. La paleta tiene ${currentPalette.colors.length} colores`);
      return;
    }

    const trimmedName = newName.trim();
    if (!trimmedName) {
      console.warn('El nombre del color no puede estar vacío');
      return;
    }

    // Actualizar solo el nombre del color
    this.palettes.update(palettes => {
      const updatedPalettes = [...palettes];
      const targetPalette = { ...updatedPalettes[currentIndex] };

      targetPalette.colors = [...targetPalette.colors];
      targetPalette.colors[colorIndex] = {
        ...targetPalette.colors[colorIndex],
        name: trimmedName
      };
      targetPalette.updatedAt = Date.now();

      updatedPalettes[currentIndex] = targetPalette;
      return updatedPalettes;
    });

    console.log(`Color renombrado en índice ${colorIndex}: ${trimmedName}`);
  }

  /**
   * Actualiza solo el valor hexadecimal de un color en la paleta actual
   * @param colorIndex Índice del color a modificar (0, 1 o 2)
   * @param newHex Nuevo valor hexadecimal del color
   */
  updateColorHex(colorIndex: number, newHex: string): void {
    const currentPalettes = this.palettes();
    const currentIndex = this.currentPaletteIndex();

    // Verificar que existe una paleta actual
    if (currentIndex < 0 || !currentPalettes[currentIndex]) {
      console.warn('No hay paleta actual seleccionada');
      return;
    }

    const currentPalette = currentPalettes[currentIndex];

    // Verificar que el índice es válido
    if (colorIndex < 0 || colorIndex >= currentPalette.colors.length) {
      console.warn(`Índice de color inválido: ${colorIndex}. La paleta tiene ${currentPalette.colors.length} colores`);
      return;
    }

    const currentColor = currentPalette.colors[colorIndex];

    // Generar nuevos shades con el nuevo color manteniendo el nombre actual
    const newShades = this.colorGeneration.generateShades(currentColor.name, newHex);

    // Actualizar la paleta con el nuevo color
    this.palettes.update(palettes => {
      const updatedPalettes = [...palettes];
      const targetPalette = { ...updatedPalettes[currentIndex] };

      // Crear el color actualizado manteniendo el nombre
      const updatedColor = {
        name: currentColor.name,
        shades: newShades
      };

      // Reemplazar el color en el índice especificado
      targetPalette.colors = [...targetPalette.colors];
      targetPalette.colors[colorIndex] = updatedColor;
      targetPalette.updatedAt = Date.now();

      updatedPalettes[currentIndex] = targetPalette;
      return updatedPalettes;
    });

    console.log(`Color hex actualizado en índice ${colorIndex}: ${currentColor.name} → ${newHex}`);
  }


}
