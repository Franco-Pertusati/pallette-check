import { Component, input, model, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorData } from '../../../../core/interfaces/colorData';

@Component({
  selector: 'app-palletecolor-input',
  imports: [CommonModule],
  templateUrl: './palletecolor-input.component.html'
})
export class PalletecolorInputComponent {
  color = model.required<ColorData>();
}
