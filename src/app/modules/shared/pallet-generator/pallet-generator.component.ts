import { Component, effect, signal } from '@angular/core';
import { ButtonComponent } from "../ui/button/button.component";
import { PalletecolorInputComponent } from "./palletecolor-input/palletecolor-input.component";
import { PalleteData } from '../../../core/interfaces/palleteData';
import { PalletteService } from '../../../core/services/pallette.service';

@Component({
  selector: 'app-pallet-generator',
  imports: [ButtonComponent, PalletecolorInputComponent],
  templateUrl: './pallet-generator.component.html'
})
export class PalletGeneratorComponent {
  pallette!: PalleteData;

  constructor(private palletteService: PalletteService) {
    effect(() => {
      this.pallette = this.palletteService.pallette();
    });
  }

  generateRandomPallette() {
    this.palletteService.updatePallete(false, 1)
  }

  toggleBlocked(index: number) {
    this.pallette.colors[index].blocked = !this.pallette.colors[index].blocked;
  }
}
