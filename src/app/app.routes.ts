import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/main-page/main-page.routes')
      .then(m => m.MAIN_PAGE_ROUTES),
  },
];
