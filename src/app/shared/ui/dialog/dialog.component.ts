import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  dialogService = inject(DialogService)

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  closeDialog() {
    this.dialogService.closeDialog()
  }
}
