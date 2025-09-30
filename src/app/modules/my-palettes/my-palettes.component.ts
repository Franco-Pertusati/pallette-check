import { Component, inject } from '@angular/core';
import { PaletteService } from '../../core/services/app/palette.service';
import { Palette } from '../../core/interfaces/palette';
import { ButtonComponent } from "../../shared/ui/button/button.component";
import { DialogService } from '../../core/services/dialog.service';
import { ExportDialogComponent } from '../main-page/sections/main-content/components/pallette-data/export-dialog/export-dialog.component';

@Component({
  selector: 'app-my-palettes',
  imports: [ButtonComponent],
  templateUrl: './my-palettes.component.html'
})
export class MyPalettesComponent {
  palettesService = inject(PaletteService)
  dialog = inject(DialogService)

  palettes: Palette[] = []

  ngOnInit() {
    this.loadPalletes()
  }

  loadPalletes() {
    const newPalettes = this.palettesService.loadPalettes()
    if (newPalettes != null) {
      this.palettes = newPalettes
    }
  }

  openExportDialogs() {
    this.dialog.openDialog(ExportDialogComponent)
  }
}
