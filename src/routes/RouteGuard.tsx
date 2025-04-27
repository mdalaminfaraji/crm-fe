import { ReactNode, Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Loading component for suspense fallback
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

interface RouteGuardProps {
  children: ReactNode;
  requireAuth: boolean;
}

/**
 * RouteGuard component that handles both protected and public routes
 * @param children - The route component to render
 * @param requireAuth - Whether authentication is required for this route
 */
export const RouteGuard = ({ children, requireAuth }: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // For protected routes: redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For public routes: redirect to dashboard if already authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the children with Suspense for lazy loading
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

/**
 * ProtectedRoute component - Only allows authenticated users
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <RouteGuard requireAuth={true}>{children}</RouteGuard>;
};

/**
 * PublicRoute component - Redirects authenticated users to dashboard
 */
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  return <RouteGuard requireAuth={false}>{children}</RouteGuard>;
};
