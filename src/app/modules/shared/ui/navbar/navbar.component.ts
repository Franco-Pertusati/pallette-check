import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { ThemeTogglePcComponent } from "../theme-toggle-pc/theme-toggle-pc.component";

@Component({
  selector: 'app-navbar',
  imports: [ThemeTogglePcComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

}
