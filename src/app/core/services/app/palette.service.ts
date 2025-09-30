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

  unsavedChanges: boolean = false

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
      this.unsavedChanges = true
    });
  }

  private storageKey = 'palette';

  // Guardar en localStorage
  savePalette(): void {
    const palette = this.currentPalette()
    if (!palette) return;

    try {
      // Save the palette itself
      localStorage.setItem(palette.id, JSON.stringify(palette));

      // Maintain an index of saved palette ids under storageKey
      const indexRaw = localStorage.getItem(this.storageKey);
      const index = indexRaw ? JSON.parse(indexRaw) as string[] : [];
      if (!index.includes(palette.id)) {
        index.push(palette.id);
        localStorage.setItem(this.storageKey, JSON.stringify(index));
      }

      this.unsavedChanges = false;
    } catch (e) {
      console.error('Error saving palette to localStorage', e);
    }
  }

  loadPalettes(): Palette[] | null {
    try {
      const indexRaw = localStorage.getItem(this.storageKey);
      if (!indexRaw) return null;

      const ids = JSON.parse(indexRaw) as string[];
      const palettes: Palette[] = [];

      ids.forEach(id => {
        const raw = localStorage.getItem(id);
        if (raw) {
          try {
            const palette = JSON.parse(raw) as Palette;
            palettes.push(palette);
          } catch {
            // Ignore invalid palette
          }
        }
      });

      if (palettes.length) {
        this.palettes.set(palettes);
        // Ensure current index is valid
        if (this.currentPaletteIndex() >= palettes.length) {
          this.currentPaletteIndex.set(0);
        }
      }

      return palettes;
    } catch (e) {
      console.error('Error loading palettes from localStorage', e);
      return null;
    }
  }

  // Eliminar
  clearPalette(): void {
    try {
      const indexRaw = localStorage.getItem(this.storageKey);
      if (indexRaw) {
        const ids = JSON.parse(indexRaw) as string[];
        ids.forEach(id => localStorage.removeItem(id));
      }
      localStorage.removeItem(this.storageKey);

      // Reset in-memory state
      this.palettes.set([]);
      this.currentPaletteIndex.set(0);
      this.unsavedChanges = false;
    } catch (e) {
      console.error('Error clearing palettes from localStorage', e);
    }
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

  deletePalette(paletteId: string): void {
    // Remove from localStorage index and the stored item
    try {
      const indexRaw = localStorage.getItem(this.storageKey);
      if (indexRaw) {
        let ids = JSON.parse(indexRaw) as string[];
        ids = ids.filter(id => id !== paletteId);
        localStorage.setItem(this.storageKey, JSON.stringify(ids));
      }
      localStorage.removeItem(paletteId);
    } catch (e) {
      console.error('Error deleting palette from localStorage', e);
    }

    // Update in-memory palettes
    this.palettes.update(palettes => palettes.filter(p => p.id !== paletteId));

    // Adjust current index if needed
    const currentIndex = this.currentPaletteIndex();
    const remaining = this.palettes().length;
    if (remaining === 0) {
      this.currentPaletteIndex.set(0);
    } else if (currentIndex >= remaining) {
      this.currentPaletteIndex.set(remaining - 1);
    }
  }

  renamePalette(paletteId: string, newName: string): void {
    const trimmed = newName.trim();
    if (!trimmed) return;

    this.palettes.update(palettes => {
      const updated = palettes.map(p => p.id === paletteId ? { ...p, name: trimmed, updatedAt: Date.now() } : p);

      // Persist renamed palette if present in localStorage
      const changed = updated.find(p => p.id === paletteId);
      if (changed) {
        try { localStorage.setItem(changed.id, JSON.stringify(changed)); } catch (e) { console.error(e); }
      }

      return updated;
    });
  }

  setCurrentPalette(index: number): void {
    const palettes = this.palettes();
    if (index < 0 || index >= palettes.length) {
      console.warn(`Índice de paleta inválido: ${index}.`);
      return;
    }
    this.currentPaletteIndex.set(index);
  }
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

    const colorsLenght = this.currentPalette().colors.length

    const newName = () => {
      if (colorsLenght === 2) return 'Accent'
      if (colorsLenght === 1) return 'Secondary'
      return 'Primary'
    }

    const baseHex = () => {
      if (colorsLenght === 0) return this.colorGeneration.getHarmoniousColor(this.currentPalette().colors[0].shades[5].value)
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
