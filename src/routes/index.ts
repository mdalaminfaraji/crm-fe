import AppRouter from './AppRouter';
import { ProtectedRoute, PublicRoute, RouteGuard, LoadingSpinner } from './RouteGuard';
import { privateRoutes, publicRoutes, routes, RouteType, RouteConfig } from './routeConfig';

export {
  AppRouter,
  ProtectedRoute,
  PublicRoute,
  RouteGuard,
  LoadingSpinner,
  privateRoutes,
  publicRoutes,
  routes,
  RouteType,
};

export type { RouteConfig };
