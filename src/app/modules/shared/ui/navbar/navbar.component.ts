import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";

@Component({
  selector: 'app-navbar',
  imports: [ButtonComponent, ThemeToggleComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

}
