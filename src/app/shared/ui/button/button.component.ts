import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  style = input<'text' | 'filled' | 'border'>('text');
  classList = input<string>('');
  label = input<string>('');
  icon = input<string>('');
  notifications = input<number>(0);
  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);

  styleMap: Record<string, string> = {
    text: 'bg-dark',
    filled: 'bg-text text-dark',
    border: 'bg-red-600 text-white hover:bg-red-700',
  };

  baseClasses = `inline-flex items-center justify-center rounded-xl font-medium focus:outline-none`;

  get classes(): string {
    const variant = this.styleMap[this.style()] ?? '';
    const padding =
      !this.showLabel() || !this.label() ? 'p-1.5' : 'px-3 py-1.5';
    return `${this.baseClasses} ${variant} ${padding} ${this.classList()}`;
  }
}
