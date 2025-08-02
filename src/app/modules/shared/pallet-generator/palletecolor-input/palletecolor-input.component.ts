import { Component, input, model, output, EventEmitter } from '@angular/core';
import { ColorData } from '../../../../core/interfaces/colorData';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-palletecolor-input',
  imports: [CommonModule],
  templateUrl: './palletecolor-input.component.html'
})
export class PalletecolorInputComponent {
  color = model.required<ColorData>();
}
