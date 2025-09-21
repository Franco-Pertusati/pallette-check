import { Component } from '@angular/core';
import { ThemeToggleBtnComponent } from "../../../../shared/ui/theme-toggle-btn/theme-toggle-btn.component";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";

@Component({
  selector: 'app-navbar',
  imports: [ThemeToggleBtnComponent, ButtonComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  menuOpen = false;
}
