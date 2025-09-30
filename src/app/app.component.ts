import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogComponent } from "./shared/ui/dialog/dialog.component";
import { DialogService } from './core/services/dialog.service';
import { CommonModule } from '@angular/common';
import { ToastListComponent } from "./shared/ui/toast-list/toast-list.component";
import { ToastService } from './core/services/toast.service';
import { NavbarComponent } from "./modules/main-page/sections/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogComponent, CommonModule, ToastListComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  dialog = inject(DialogService);
}
