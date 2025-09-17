import { Component } from '@angular/core';
import { NavbarComponent } from "./sections/navbar/navbar.component";
import { CurrentColorComponent } from "./sections/current-color/current-color.component";
import { ColorInputComponent } from "./sections/color-input/color-input.component";

@Component({
  selector: 'app-main-page',
  imports: [NavbarComponent, CurrentColorComponent, ColorInputComponent],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {

}
