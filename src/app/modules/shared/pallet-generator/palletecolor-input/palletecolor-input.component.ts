import { Component, model } from '@angular/core';
import { ColorData } from '../../../../core/interfaces/colorData';
import { ButtonComponent } from "../../ui/button/button.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-palletecolor-input',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './palletecolor-input.component.html'
})
export class PalletecolorInputComponent {
  color = model.required<ColorData>();
}
