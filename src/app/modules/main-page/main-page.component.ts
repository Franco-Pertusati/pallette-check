import { Component } from '@angular/core';
import { NavbarComponent } from "./sections/navbar/navbar.component";
import { SidebarComponent } from "./sections/sidebar/sidebar.component";
import { MainContentComponent } from "./sections/main-content/main-content.component";
import { DialogComponent } from "../../shared/ui/dialog/dialog.component";

@Component({
  selector: 'app-main-page',
  imports: [NavbarComponent, SidebarComponent, MainContentComponent],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {

}
