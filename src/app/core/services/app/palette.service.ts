import { computed, inject, Injectable, signal } from '@angular/core';
import { Palette, PaletteColor } from '../../interfaces/palette';
import { colorGenerationService } from './color-generation.service';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {
  colorGeneration = inject(colorGenerationService)
  palettes = signal<Palette[]>([]);
  currentPaletteIndex = signal<number>(0);

  currentPalette = computed(() => {
    const palettes = this.palettes();
    const index = this.currentPaletteIndex();
    return palettes[index] || null;
  });

  createPalette(name: string, initialColor?: { hex: string, colorName: string }): void {
    const newPalette: Palette = {
      name: name.trim() || 'New Palette',
      colors: [],
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    if (initialColor) {
      const generatedShades = this.colorGeneration.generatePalette(
        initialColor.hex,
        initialColor.colorName
      );

      newPalette.colors.push({
        name: initialColor.colorName,
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


  addColorToPalette(hexColor: string, colorName: string): void {
    const currentPalettes = this.palettes();
    const currentIndex = this.currentPaletteIndex();

    // Verificar que existe una paleta actual
    if (currentIndex < 0 || !currentPalettes[currentIndex]) {
      console.warn('No hay paleta actual seleccionada');
      return;
    }

    // Generar los shades del nuevo color
    const generatedShades = this.colorGeneration.generatePalette(hexColor, colorName);

    const newColor: PaletteColor = {
      name: colorName.trim() || 'Unnamed Color',
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

    console.log(this.currentPalette())
  }

  removeColorFromPalette(colorIndex: number): void { }
  updateColorInPalette(colorIndex: number, newHex: string): void { }
  renameColorInPalette(colorIndex: number, newName: string): void { }
}
