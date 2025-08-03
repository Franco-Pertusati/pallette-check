import { Component } from '@angular/core';
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { PalletteService } from '../../../../core/services/pallette.service';

@Component({
  selector: 'app-theme-toggle-pc',
  imports: [ThemeToggleComponent],
  templateUrl: './theme-toggle-pc.component.html'
})
export class ThemeTogglePcComponent {
  constructor(private palletteService:PalletteService) {}

  updatePallette() {
    this.palletteService.updatePallete()
  }
}
