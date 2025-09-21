import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { colorGenerationService } from '../../../../../../core/services/app/color-generation.service';

@Component({
  selector: 'app-color-input',
  imports: [ButtonComponent],
  templateUrl: './color-input.component.html'
})
export class ColorInputComponent {
  colorService = inject(colorGenerationService)

  onEnter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    console.log('input value: ' + value)
    console.log(this.colorService.generatePalette(value, 'deco'))
  }
}
