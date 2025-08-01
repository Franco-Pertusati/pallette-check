import { Component, effect } from '@angular/core';
import { ButtonComponent } from "../ui/button/button.component";
import { PalletecolorInputComponent } from "./palletecolor-input/palletecolor-input.component";
import { PalleteData } from '../../../core/interfaces/palleteData';
import { PalletService } from '../../../core/services/pallet.service';

@Component({
  selector: 'app-pallet-generator',
  imports: [ButtonComponent, PalletecolorInputComponent],
  templateUrl: './pallet-generator.component.html'
})
export class PalletGeneratorComponent {
  pallette!: PalleteData;

  constructor(private palletteService: PalletService) {
    effect(() => {
      this.pallette = this.palletteService.pallette();
    });
  }

  generateRandomPallette() {
    this.palletteService.updatePallete(false, [], 1)
  }
}
