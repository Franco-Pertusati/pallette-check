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

  createPalette(name: string, initialColor?: { hex: string, colorName: string }): Palette {
    const newPalette: Palette = {
      name: name.trim() || 'New Palette',
      colors: []
    };

    // Si se proporciona un color inicial, agregarlo a la paleta
    if (initialColor) {
      const generatedShades = this.colorGeneration.generatePalette(
        initialColor.hex,
        initialColor.colorName
      );

      newPalette.colors.push({
        name: initialColor.colorName,
        shades: generatedShades,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    // Actualizar el signal con la nueva paleta
    this.palettes.update(currentPalettes => [...currentPalettes, newPalette]);

    return newPalette;
  }

  // duplicatePalette(paletteId: string): Palette {}
  deletePalette(paletteId: string): void { }
  renamePalette(paletteId: string, newName: string): void { }


  setCurrentPalette(index: number): void { }
  // getCurrentPalette(): Palette | null { }
  // getAllPalettes(): Palette[] { }


  addColorToPalette(paletteIndex: number, hexColor: string, colorName: string): void { }
  removeColorFromPalette(paletteIndex: number, colorIndex: number): void { }
  updateColorInPalette(paletteIndex: number, colorIndex: number, newHex: string): void { }
  renameColorInPalette(paletteIndex: number, colorIndex: number, newName: string): void { }
}
