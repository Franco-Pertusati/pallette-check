import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from "./modules/shared/ui/button/button.component";

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pallet-check';
}
