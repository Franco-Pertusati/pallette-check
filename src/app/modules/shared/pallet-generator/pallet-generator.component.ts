import { Component, effect, signal } from '@angular/core';
import { ButtonComponent } from "../ui/button/button.component";
import { PalletecolorInputComponent } from "./palletecolor-input/palletecolor-input.component";
import { PalleteData } from '../../../core/interfaces/palleteData';
import { PalletteService } from '../../../core/services/pallette.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pallet-generator',
  imports: [ButtonComponent, PalletecolorInputComponent, NgClass],
  templateUrl: './pallet-generator.component.html',
  styleUrl: './pallet-generator.component.css'
})
export class PalletGeneratorComponent {
  pallette!: PalleteData;
  isOpen: boolean = true;

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

  toggleState() {
    this.isOpen = !this.isOpen
  }
}
