import { DynamicRoute } from '../interfaces/dynamic-route.interface';

export const DYNAMIC_ROUTES: DynamicRoute[] = [
  {
    path: 'home',
    alias: 'HOME',
    default: true,
  },
  {
    path: 'users',
    alias: 'USERS',
    default: false,
  },
  {
    path: 'projects',
    alias: 'PROJECTS',
    default: false,
  },
  {
    path: 'admin',
    alias: 'ADMIN',
    default: false,
  },
  {
    path: 'not-found',
    alias: '',
    default: false,
  },
];
