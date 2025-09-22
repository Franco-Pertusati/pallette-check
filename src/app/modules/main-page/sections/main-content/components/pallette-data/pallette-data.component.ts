import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { PaletteService } from '../../../../../../core/services/app/palette.service';
import { ColorShadesComponent } from "../color-shades/color-shades.component";

@Component({
  selector: 'app-pallette-data',
  imports: [ButtonComponent, ColorShadesComponent],
  templateUrl: './pallette-data.component.html'
})
export class PalletteDataComponent {
  paletteService = inject(PaletteService);

  ngOnInit() {
    this.createPalette()
  }

  createPalette() {
    this.paletteService.createPalette('New Palette', {colorName: 'color1', hex: '#349567'})
  }
}
