import { Routes } from "@angular/router";
import { HomeComponent } from "../pages/home/home.component";
import { NotFoundComponent } from "../pages/not-found/not-found.component";

export const STATIC_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
