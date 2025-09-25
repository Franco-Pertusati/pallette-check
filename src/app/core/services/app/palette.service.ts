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

    const initialColor = this.colorGeneration.generateRandomColor()

    if (initialColor) {
      const generatedShades = this.colorGeneration.generateShades(
        initialColor.name,
        initialColor.hex
      );

      newPalette.colors.push({
        name: initialColor.name,
        shades: generatedShades,
      });
    }
    this.palettes.update(currentPalettes => [...currentPalettes, newPalette]);
  }

  // duplicatePalette(paletteId: string): Palette {}
  deletePalette(paletteId: string): void { }
  renamePalette(paletteId: string, newName: string): void { }


  setCurrentPalette(index: number): void { }
  // getCurrentPalette(): Palette | null { }
  // getAllPalettes(): Palette[] { }


  addColorToPalette(): void {
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

    const randomColor = this.colorGeneration.generateRandomColor()
    const generatedShades = this.colorGeneration.generateShades(randomColor.name, randomColor.hex);

    const newColor: PaletteColor = {
      name: randomColor.name,
      shades: generatedShades
    };

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

  removeColorFromPalette(colorIndex: number): void { }
  updateColorInPalette(colorIndex: number, newHex: string): void { }
  renameColorInPalette(colorIndex: number, newName: string): void { }
}
