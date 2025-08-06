import { Component, effect } from '@angular/core';
import { PalletecolorInputComponent } from "./palletecolor-input/palletecolor-input.component";
import { PalletteService } from '../../../core/services/pallette.service';
import { PalleteData } from '../../../core/interfaces/palleteData';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-pallette-output',
  imports: [ButtonComponent, PalletecolorInputComponent],
  templateUrl: './pallette-output.component.html'
})
export class PalletteOutputComponent {
  pallette!: PalleteData;

  constructor(private palletteService: PalletteService) {
    effect(() => {
      this.pallette = this.palletteService.pallette();
    });
  }

  generateRandomPallette() {
    this.palletteService.updatePallete()
  }

  toggleBlocked(index: number) {
    this.pallette.colors[index].blocked = !this.pallette.colors[index].blocked;
  }
}
