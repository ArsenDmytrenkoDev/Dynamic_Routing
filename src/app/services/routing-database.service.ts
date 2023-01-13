import { Injectable, Injector } from '@angular/core';
import { LoadChildrenCallback, Route, Router, Routes } from '@angular/router';
import { DYNAMIC_ROUTES } from '../constants/dynamic-routes.constants';
import { ROUTE_ALIASES } from '../constants/route-aliases.constants';
import { DynamicRoute } from '../interfaces/dynamic-route.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutingDatabaseService {
  private dynamicRoutes: Routes = [];

  constructor(private injector: Injector) {}

  public async initRoutesTree(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.dynamicRoutes = this.buildRoutesTree(DYNAMIC_ROUTES);
        const router = this.injector.get(Router);
        router.resetConfig(this.dynamicRoutes);
        resolve();
      }, 2000);
    });
  }

  public getAllRoutes(): Routes {
    return this.dynamicRoutes;
  }

  private buildRoutesTree(dynamicRoutes: DynamicRoute[]): Routes {
    const generatedRoutes: Routes = [];

    dynamicRoutes.forEach((dynamicRoute) => {
      const component = this.getComponent(dynamicRoute.alias);

      if (!component) return;

      if (dynamicRoute.default) {
        const defaultRoutes = this.generateDefaultRoutes(
          dynamicRoute.path,
          component
        );
        generatedRoutes.push(...defaultRoutes);
        return;
      }

      const generatedRoute: Route = {
        path: dynamicRoute.path,
        loadChildren: component,
      };
      generatedRoutes.push(generatedRoute);
    });

    const notFoundRoutes = this.generateNotFoundRoutes();
    generatedRoutes.push(...notFoundRoutes);

    return generatedRoutes;
  }

  private generateDefaultRoutes(
    path: string,
    component: LoadChildrenCallback
  ): Routes {
    const redirectToDefaultRoute: Route = {
      path: '',
      pathMatch: 'full',
      redirectTo: path,
    };
    const defaultRoute: Route = {
      path: path,
      loadChildren: component,
    };
    return [redirectToDefaultRoute, defaultRoute];
  }

  private generateNotFoundRoutes(): Routes {
    const notFoundRoute: Route = {
      path: 'not-found',
      loadChildren: this.getComponent('NOT_FOUND'),
    };
    const redirectToNotFoundRoute: Route = {
      path: '**',
      redirectTo: 'not-found',
    };
    return [notFoundRoute, redirectToNotFoundRoute];
  }

  private getComponent(alias: string | undefined): any {
    if (!alias) return null;

    const component = ROUTE_ALIASES[alias] || null;

    return component;
  }
}
