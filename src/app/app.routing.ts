import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   fullMatch: 'full',
  //   redirectTo: 'home',
  // }
  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  // },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
  // },
  // {
  //   path: 'projects',
  //   loadChildren: () => import('./pages/projects/projects.module').then((m) => m.ProjectsModule),
  // },
  // {
  //   path: 'users',
  //   loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),
  // },
  // {
  //   path: 'not-found',
  //   loadChildren: () => import('./pages/not-found/not-found.module').then((m) => m.NotFoundModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
