import { Routes } from "@angular/router";
import { MainPageComponent } from "./main-page.component";

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
    component: MainPageComponent,
  },
  {
    path: 'help',
    component: MainPageComponent,
  },
  {
    path: '**',
    redirectTo: 'new-palette', // Redirección por si alguien pone una ruta no válida
  }
];
