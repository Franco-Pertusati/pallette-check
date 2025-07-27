import { Component } from '@angular/core';
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
  palleteData: PalleteData = {
    colors: [
      { name: 'Text', hex: '0b0218' },
      { name: 'Background', hex: 'f8f2fe' },
      { name: 'Primary', hex: '8319ee' },
      { name: 'Secondary', hex: 'f4718d' },
    ],
    isDark: false
  }

  constructor(public palletService: PalletService) {
    this.palleteData = palletService.generateRandomPalette()
   }

  generateRandomPallette() {
    this.palleteData = this.palletService.generateRandomPalette()
  }
}
