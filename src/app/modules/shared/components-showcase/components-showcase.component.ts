import { Component } from '@angular/core';
import { HeaderComponent } from "../exampleComponents/header/header.component";
import { CardsComponent } from "../exampleComponents/cards/cards.component";
import { PalletteService } from '../../../core/services/pallette.service';

@Component({
  selector: 'app-components-showcase',
  imports: [HeaderComponent, CardsComponent],
  templateUrl: './components-showcase.component.html'
})
export class ComponentsShowcaseComponent {
  constructor(private ps: PalletteService) {}

  ngOnInit() {
    this.generateRandomPallette()
  }

  generateRandomPallette() {
    this.ps.updatePallete()
  }
}
