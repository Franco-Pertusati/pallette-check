import { Component, computed, inject, input } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { PaletteService } from '../../../../../../core/services/app/palette.service';
import { PaletteColor } from '../../../../../../core/interfaces/palette';
import { ToastService } from '../../../../../../core/services/toast.service';

@Component({
  selector: 'app-color-shades',
  imports: [ButtonComponent],
  templateUrl: './color-shades.component.html'
})
export class ColorShadesComponent {
  paletteService = inject(PaletteService)
  color = input.required<PaletteColor>()
  index = input.required<number>()
  toast = inject(ToastService)

  shadesToArray = computed(() => {
    const shades = this.color().shades;
    return Object.entries(shades).map(([key, value]) => ({ key, value }));
  });

  removeColor() {
    this.paletteService.removeColorFromPalette(this.index())
  }

  editHex(value: string) {
    this.paletteService.updateColorHex(this.index(), value)
  }

  editName(value: string) {
    this.paletteService.renameColorInPalette(this.index(), value)
  }

  copyColor(colorHex: string) {
    navigator.clipboard.writeText(colorHex)
    this.toast.success('Copied!')
  }
}
