import { Component, effect, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonComponent } from "../shared/ui/button/button.component";
import { PalletteOutputComponent } from './pallette-output/pallette-output.component';
import { ShadesOutputComponent } from "./shades-output/shades-output.component";

@Component({
  selector: 'app-pallet-generator',
  imports: [NgClass, ButtonComponent, ShadesOutputComponent, PalletteOutputComponent],
  templateUrl: './pallet-generator.component.html',
  styleUrl: './pallet-generator.component.css'
})
export class PalletGeneratorComponent {
  isOpen: boolean = true;
  componentsCarrousel: any = []

  toggleState() {
    this.isOpen = !this.isOpen
  }
}
