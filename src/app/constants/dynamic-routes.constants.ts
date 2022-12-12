import { Routes } from "@angular/router";
import { AdminComponent } from "../pages/admin/admin.component";
import { ProjectsComponent } from "../pages/projects/projects.component";
import { UsersComponent } from "../pages/users/users.component";

export const DYNAMIC_ROUTES: Routes = [
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }
]
