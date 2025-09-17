import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.component.html'
})

export class ButtonComponent {
  style = input<'text' | 'filled' | 'border' | 'sidebar' | 'wide' | 'cta' >('text');
  vertList = input<boolean>(false);
  extraCss = input<string>()

  label = input<string>('');
  icon = input<string>('');
  notifications = input<number>(0);

  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);
}
