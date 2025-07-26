import { Component } from '@angular/core';
import { ButtonComponent } from "../ui/button/button.component";
import { ColorData } from '../../core/interfaces/colorData';
import { PalletecolorInputComponent } from "./palletecolor-input/palletecolor-input.component";
import { PalleteData } from '../../core/interfaces/palleteData';

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
}
