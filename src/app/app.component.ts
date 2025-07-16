import { Component } from '@angular/core';
import { ComponentsShowcaseComponent } from "./modules/shared/components-showcase/components-showcase.component";
import { NavbarComponent } from "./modules/shared/ui/navbar/navbar.component";
import { SidebarComponent } from "./modules/shared/ui/sidebar/sidebar.component";
import { OutputSidebarComponent } from "./modules/shared/output-sidebar/output-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [ComponentsShowcaseComponent, NavbarComponent, SidebarComponent, OutputSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
