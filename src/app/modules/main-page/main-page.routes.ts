import { Routes } from "@angular/router";
import { MainPageComponent } from "./main-page.component";

export const MAIN_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: MainPageComponent,
    // children: [
    //   { path: 'sign-up', component:  },
    //   { path: '', redirectTo: 'sign-up', pathMatch: 'full' }
    // ]
  }
];
