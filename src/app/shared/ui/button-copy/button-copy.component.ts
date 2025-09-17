import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-button-copy',
  imports: [NgClass],
  templateUrl: './button-copy.component.html',
  styleUrl: './button-copy.component.css'
})
export class ButtonCopyComponent {
  toast = inject(ToastService)

  style = input<'text' | 'filled' | 'border' | 'sidebar' | 'wide' | 'cta'>('text');
  vertList = input<boolean>(false);
  extraCss = input<string>()

  label = input<string>('');
  icon = 'content_copy';
  notifications = input<number>(0);

  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);

  texToCopy = input.required<string>()

  copyContent() {
    navigator.clipboard.writeText(this.texToCopy())
    this.toast.success('Copy to cliboard!')
    this.icon = 'check'
    setTimeout(() => {
      this.icon = 'content_copy'
    }, 1500);
  }
}
