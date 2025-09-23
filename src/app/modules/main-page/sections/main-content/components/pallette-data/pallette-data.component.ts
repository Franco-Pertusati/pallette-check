import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { PaletteService } from '../../../../../../core/services/app/palette.service';
import { ColorShadesComponent } from "../color-shades/color-shades.component";
import { CommonModule } from '@angular/common';
import { Palette, PaletteColor } from '../../../../../../core/interfaces/palette';

@Component({
  selector: 'app-pallette-data',
  imports: [ButtonComponent, ColorShadesComponent, CommonModule],
  templateUrl: './pallette-data.component.html'
})
export class PalletteDataComponent {
  paletteService = inject(PaletteService);
  colors: Palette | null = null

  ngOnInit() {
    this.createPalette()
    this.colors = this.paletteService.currentPalette()
    console.log(this.colors)
  }

  createPalette() {
    this.paletteService.createPalette('New Palette', {colorName: 'primary', hex: '#9c81d1'})
  }

  addNewColor() {
    this.paletteService.addColorToPalette('FC440F', 'secondary')
  }
}
