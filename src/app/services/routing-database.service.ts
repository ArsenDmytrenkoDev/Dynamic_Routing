import { Injectable, Injector } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { DYNAMIC_ROUTES } from '../constants/dynamic-routes.constants';
import { STATIC_ROUTES } from '../constants/static-routes.constants';

@Injectable({
  providedIn: 'root',
})
export class RoutingDatabaseService {
  public dynamicRoutes: Routes = [];

  constructor(private injector: Injector) {}

  public async getDynamicRoutes(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.dynamicRoutes = DYNAMIC_ROUTES;
        const router = this.injector.get(Router);
        router.resetConfig(this.getAllRoutes());
        resolve();
      }, 3000);
    });
  }

  public getAllRoutes(): Routes {
    return [...this.dynamicRoutes, ...STATIC_ROUTES];
  }
}
