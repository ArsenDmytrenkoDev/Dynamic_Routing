import {LoadChildrenCallback} from '@angular/router';

export const ROUTE_ALIASES: { [index: string]: LoadChildrenCallback } = {
  USERS: () => import('../pages/users/users.module').then((m) => m.UsersModule),
  HOME: () => import('../pages/home/home.module').then((m) => m.HomeModule),
  PROJECTS: () => import('../pages/projects/projects.module').then((m) => m.ProjectsModule),
  ADMIN: () => import('../pages/admin/admin.module').then((m) => m.AdminModule),
  NOT_FOUND: () => import('../pages/not-found/not-found.module').then((m) => m.NotFoundModule),
};
