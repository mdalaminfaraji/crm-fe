/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

// Lazy load components for better performance
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Clients = lazy(() => import("../pages/Clients"));
const Projects = lazy(() => import("../pages/Projects"));
const Interactions = lazy(() => import("../pages/Interactions"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ComingSoon = lazy(() => import("../components/common/ComingSoon"));

// Route types
export enum RouteType {
  PUBLIC = "public",
  PRIVATE = "private",
}

// Interface for route configuration
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any>;
  type: RouteType;
  exact?: boolean;
  title: string;
  icon?: string;
  showInSidebar?: boolean;
}

// Public routes configuration
export const publicRoutes: RouteConfig[] = [
  {
    path: "/login",
    component: Login,
    type: RouteType.PUBLIC,
    exact: true,
    title: "Login",
  },
  {
    path: "/register",
    component: Register,
    type: RouteType.PUBLIC,
    exact: true,
    title: "Register",
  },
];

// Private routes configuration
export const privateRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    component: Dashboard,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Dashboard",
    icon: "dashboard",
    showInSidebar: true,
  },
  {
    path: "/clients",
    component: Clients,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Clients",
    icon: "users",
    showInSidebar: true,
  },
  {
    path: "/projects",
    component: Projects,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Projects",
    icon: "folder",
    showInSidebar: true,
  },
  {
    path: "/interactions",
    component: Interactions,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Interactions",
    icon: "message",
    showInSidebar: true,
  },
  {
    path: "/reminders",
    component: ComingSoon,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Reminders",
    icon: "bell",
    showInSidebar: true,
  },
  {
    path: "/settings",
    component: ComingSoon,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Settings",
    icon: "settings",
    showInSidebar: true,
  },
  {
    path: "/help",
    component: ComingSoon,
    type: RouteType.PRIVATE,
    exact: true,
    title: "Help",
    icon: "help",
    showInSidebar: true,
  },
];

// All routes combined
export const routes = [...publicRoutes, ...privateRoutes];
