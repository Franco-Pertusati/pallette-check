import { Component, effect } from '@angular/core';
import { PalletteService } from '../../../core/services/pallette.service';
import { ColorData } from '../../../core/interfaces/colorData';
import { ButtonComponent } from "../../shared/ui/button/button.component";

@Component({
  selector: 'app-shades-output',
  imports: [ButtonComponent],
  templateUrl: './shades-output.component.html'
})
export class ShadesOutputComponent {
  primaryShades: ColorData[] = []
  secondaryShades: ColorData[] = []

  constructor(private palletteService: PalletteService) {
    effect(() => {
      this.primaryShades = this.palletteService.pallette().colors[2].shades;
      this.secondaryShades = this.palletteService.pallette().colors[3].shades;
    });
  }
}
