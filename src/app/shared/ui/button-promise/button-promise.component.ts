import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { OperationStatus } from '../../../core/interfaces/operationStatus';

@Component({
  selector: 'app-button-promise',
  imports: [NgClass],
  templateUrl: './button-promise.component.html',
  styleUrl: './button-promise.component.css'
})
export class ButtonPromiseComponent {
  style = input<'text' | 'filled' | 'border' | 'sidebar' | 'wide'>('text');
  vertList = input<boolean>(false);
  extraCss = input<string>()

  label = input<string>('');
  icon = input<string>('');
  notifications = input<number>(0);

  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);

  state = input.required<OperationStatus>()
}
