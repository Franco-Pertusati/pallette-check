import { Component, inject } from '@angular/core';
import { PaletteService } from '../../../../../../../core/services/app/palette.service';
import { Palette } from '../../../../../../../core/interfaces/palette';
import { NgIf, NgForOf } from '@angular/common';
import { ButtonComponent } from "../../../../../../../shared/ui/button/button.component";
import { DialogService } from '../../../../../../../core/services/dialog.service';
import { ToastService } from '../../../../../../../core/services/toast.service';

@Component({
  selector: 'app-export-dialog',
  imports: [NgIf, NgForOf, ButtonComponent],
  templateUrl: './export-dialog.component.html'
})
export class ExportDialogComponent {
  toast = inject(ToastService)
  paletteService = inject(PaletteService)
  selected: 'CSS' | 'Tailwind-3' | 'Tailwind-4' | null = 'CSS';
  palette: Palette = this.paletteService.currentPalette()

  setSelected(value: 'CSS' | 'Tailwind-3' | 'Tailwind-4') {
    this.selected = value;
  }

  // Generate plain CSS variables
  generateCss(): string {
    if (!this.palette) return '';
    const lines: string[] = [];
    this.palette.colors.forEach(color => {
      color.shades.forEach(shade => {
        lines.push(`--${shade.key}: ${shade.value};`);
      });
    });
    return lines.join('\n');
  }

  // Generate Tailwind v3 format
  generateTailwind3(): string {
    if (!this.palette) return '';
    const parts: string[] = [];
    parts.push('colors: {');
    this.palette.colors.forEach(color => {
      parts.push(`  '${color.name}': {`);
      color.shades.forEach(shade => {
        // shade.key like 'color-50' or 'primary-50' -> get the number part
        const partsKey = shade.key.split('-');
        const idx = partsKey[partsKey.length - 1];
        parts.push(`    '${idx}': '${shade.value}',`);
      });
      parts.push('  },');
    });
    parts.push('}');
    return parts.join('\n');
  }

  // Generate Tailwind v4 / token-like format
  generateTailwind4(): string {
    if (!this.palette) return '';
    const lines: string[] = [];
    this.palette.colors.forEach(color => {
      color.shades.forEach(shade => {
        lines.push(`--color-${shade.key}: ${shade.value};`);
      });
    });
    return lines.join('\n');
  }

  // Central function that returns the text to copy according to selected option
  getExportText(): string {
    this.toast.success("Copied!")
    if (this.selected === 'CSS') return this.generateCss();
    if (this.selected === 'Tailwind-3') return this.generateTailwind3();
    if (this.selected === 'Tailwind-4') return this.generateTailwind4();
    return '';
  }

  // Copy to clipboard; uses navigator.clipboard if available
  async copyExport() {
    const text = this.getExportText();
    if (!text) return;
    try {
      if (navigator && 'clipboard' in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: create textarea
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      // You can add a toast/notification here
    } catch (e) {
      console.error('Copy failed', e);
    }
  }
}
