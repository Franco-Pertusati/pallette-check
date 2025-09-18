import { Component } from '@angular/core';
import { ColorInputComponent } from "./components/color-input/color-input.component";

@Component({
  selector: 'app-sidebar',
  imports: [ColorInputComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  }
