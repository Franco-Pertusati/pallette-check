import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-theme-toggle',
  imports: [ButtonComponent],
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent {
  isDarkMode = false;

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    this.isDarkMode = theme === 'dark';
    this.updateThemeClass();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateThemeClass();
  }

  private updateThemeClass(): void {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }
}
