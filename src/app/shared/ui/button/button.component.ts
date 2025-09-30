import { Component, input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Output() btnClick = new EventEmitter<void>();
  style = input<'text' | 'filled' | 'border'>('text');
  classList = input<string>('');
  label = input<string>('');
  icon = input<string>('');
  notifications = input<number>(0);
  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);

  styleMap: Record<string, string> = {
    text: 'bg-transparent',
    filled: 'bg-text text-dark',
    border: 'border border-light',
  };

  baseClasses = `inline-flex items-center justify-center gap-1.5 rounded-xl font-medium cursor-pointer`;

  get classes(): string {
    const variant = this.styleMap[this.style()] ?? '';
    const padding =
      !this.showLabel() || !this.label() ? 'p-1.5' : 'px-3 py-1.5';
    return `${this.baseClasses} ${variant} ${padding} ${this.classList()}`;
  }
}
