import { Component, inject } from '@angular/core';
import { PaletteService } from '../../../../../../../core/services/app/palette.service';
import { Palette } from '../../../../../../../core/interfaces/palette';
import { ButtonComponent } from "../../../../../../../shared/ui/button/button.component";

@Component({
  selector: 'app-export-dialog',
  imports: [ButtonComponent],
  templateUrl: './export-dialog.component.html'
})
export class ExportDialogComponent {
  paletteService = inject(PaletteService)
  selected: 'CSS' | 'Tailwind-3' | 'Tailwind-4' | null = 'CSS';
  palette: Palette = this.paletteService.currentPalette()

  setSelected(value: 'CSS' | 'Tailwind-3' | 'Tailwind-4') {
    this.selected = value;
  }
}
