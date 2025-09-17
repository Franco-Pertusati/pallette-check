import { Component, input } from '@angular/core';
import { Toast } from '../../../core/interfaces/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toast = input.required<Toast>()
}
