import { Routes } from "@angular/router";
import { MainPageComponent } from "./main-page.component";
import { MyPalettesComponent } from "../my-palettes/my-palettes.component";
import { HelpComponent } from "../help/help.component";

export const MAIN_PAGE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'new-palette',
    pathMatch: 'full',
  },
  {
    path: 'new-palette',
    component: MainPageComponent,
  },
  {
    path: 'my-palettes',
    component: MyPalettesComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: '**',
    redirectTo: 'new-palette',
  }
];
