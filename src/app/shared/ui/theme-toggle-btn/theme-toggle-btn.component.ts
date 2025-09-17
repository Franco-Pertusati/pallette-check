import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle-btn',
  imports: [ButtonComponent],
  templateUrl: './theme-toggle-btn.component.html',
  styleUrl: './theme-toggle-btn.component.css'
})
export class ThemeToggleBtnComponent {
  theme = inject(ThemeService)

  toggleTheme() {
    this.theme.toggleTheme()
  }
}
