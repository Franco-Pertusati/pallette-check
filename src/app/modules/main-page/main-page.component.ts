import { Component } from '@angular/core';
import { SidebarComponent } from "./sections/sidebar/sidebar.component";
import { MainContentComponent } from "./sections/main-content/main-content.component";

@Component({
  selector: 'app-main-page',
  imports: [SidebarComponent, MainContentComponent],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {

}
