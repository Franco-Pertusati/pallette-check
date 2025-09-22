import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { colorGenerationService } from '../../../../../../core/services/app/color-generation.service';
import { PaletteService } from '../../../../../../core/services/app/palette.service';

@Component({
  selector: 'app-color-input',
  imports: [ButtonComponent],
  templateUrl: './color-input.component.html'
})
export class ColorInputComponent {
  paletteService = inject(PaletteService)

  onEnter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    console.log('input value: ' + value)
  }
}
