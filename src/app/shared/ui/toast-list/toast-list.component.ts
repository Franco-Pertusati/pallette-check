import { Component, inject, input } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from "../toast/toast.component";

@Component({
  selector: 'app-toast-list',
  imports: [ToastComponent],
  templateUrl: './toast-list.component.html',
})
export class ToastListComponent {
  toasts = inject(ToastService)
}
