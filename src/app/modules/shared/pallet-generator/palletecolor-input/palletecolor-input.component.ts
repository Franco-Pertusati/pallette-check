import { Component, Input, input } from '@angular/core';
import { ColorData } from '../../../core/interfaces/colorData';

@Component({
  selector: 'app-palletecolor-input',
  imports: [],
  templateUrl: './palletecolor-input.component.html'
})
export class PalletecolorInputComponent {
  @Input() colorData:ColorData | undefined = undefined
}
