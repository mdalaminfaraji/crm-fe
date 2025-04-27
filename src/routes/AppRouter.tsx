import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { privateRoutes, publicRoutes } from "./routeConfig";
import { LoadingSpinner, ProtectedRoute, PublicRoute } from "./RouteGuard";
import Layout from "../components/layout/Layout";

/**
 * Main router component that handles all application routes
 */
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicRoute>
                <route.component />
              </PublicRoute>
            }
          />
        ))}

        {/* Protected Routes */}
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <Layout>
                  <route.component />
                </Layout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Redirect root to dashboard or login based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-white">
                  404
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
                  Page not found
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-primary mt-6"
                >
                  Go back
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
