import { Component, inject, input } from '@angular/core';
import { Toast } from '../../../core/interfaces/toast';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from "../toast/toast.component";

@Component({
  selector: 'app-toast-list',
  imports: [ToastComponent],
  templateUrl: './toast-list.component.html',
  styleUrl: './toast-list.component.css'
})
export class ToastListComponent {
  toasts = inject(ToastService)
}
