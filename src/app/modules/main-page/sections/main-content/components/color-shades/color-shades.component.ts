import { Component, computed, inject, input } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { PaletteService } from '../../../../../../core/services/app/palette.service';
import { PaletteColor } from '../../../../../../core/interfaces/palette';

@Component({
  selector: 'app-color-shades',
  imports: [ButtonComponent],
  templateUrl: './color-shades.component.html'
})
export class ColorShadesComponent {
  color = input.required<PaletteColor>()

  shadesToArray = computed(() => {
    const shades = this.color().shades;
    return Object.entries(shades).map(([key, value]) => ({ key, value }));
  });
}
