import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.component.html'
})

export class ButtonComponent {
  style = input<'text' | 'filled' | 'border'>('filled');
  vertList = input<boolean>(false);

  label = input<string>('');
  icon = input<string>('');
  notifications = input<number>(0);

  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);


  getClasses(): string {
    const baseClass = 'flex gap-1.5 py-1.5 rounded-xl hover:cursor-pointer text-gray-800 dark:text-neutral-50';
    const styleClass = {
      text: 'bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-800',
      filled: 'bg-primary text-background',
      border: 'border border-gray-800',
    }[this.style()];

    return `${baseClass} ${styleClass} ${this.vertList() ? 'w-full' : ''}`;
  }
}
