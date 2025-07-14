import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html'
})

export class ButtonComponent {
  style = input<'text' | 'filled' | 'border'>('filled');

  label = input<string>('Action');
  icon = input<string>('check');
  notifications = input<number>(0);

  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);


  getClasses(): string {
    const baseClass = 'flex gap-1.5 py-1.5 px-3 rounded-full hover:cursor-pointer';
    const styleClass = {
      text: '',
      filled: 'bg-gray-900 hover:bg-gray-800 text-white',
      border: 'border border-gray-800',
    }[this.style()];

    return `${baseClass} ${styleClass}`;
  }
}
