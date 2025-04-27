/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ReactNode } from "react";
import { AuthContext, User, RegisterData } from "./AuthContext";
import authService from "../services/authService";
import Swal from "sweetalert2";

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Check if token exists in localStorage
        const token = localStorage.getItem("token");

        if (token) {
          try {
            // Validate the token by fetching the user profile
            const response = await authService.getProfile();

            // Set user data from the response
            setUser({
              id: response.user.id,
              email: response.user.email,
              firstName: response.user.firstName || "",
              lastName: response.user.lastName || "",
            });

            // Ensure isAuthenticated is set to true
            localStorage.setItem("isAuthenticated", "true");
          } catch (profileError) {
            // If token is invalid or expired, clear auth data
            console.error("Invalid token:", profileError);
            localStorage.removeItem("token");
            localStorage.removeItem("isAuthenticated");
            setUser(null);
          }
        } else {
          // No token found, ensure user is logged out
          setUser(null);
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error: unknown) {
        // Handle unexpected errors
        console.error("Auth check error:", error);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the backend API through authService
      const response = await authService.login({ email, password });

      // Store the JWT token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("isAuthenticated", "true");

      // Set the user data
      setUser({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName || "",
        lastName: response.user.lastName || "",
      });
    } catch (error: unknown) {
      // Type-safe error handling
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Login failed"
          : "An error occurred during login";

      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000,
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the backend API through authService
      const response = await authService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      // Return the response data for potential use in the component
      return response;
    } catch (error: unknown) {
      // Type-safe error handling
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.message || "Registration failed"
          : "An error occurred during registration";

      setError(errorMessage);

      console.error("Registration error:", error);
      throw error; // Re-throw to allow handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);

      // Call the backend API through authService
      await authService.logout();

      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      setUser(null);

      // Show success notification
      Swal.fire({
        icon: "success",
        title: "Logout Successful",
        text: "You have been successfully logged out.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error: unknown) {
      // Type-safe error handling
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during logout";

      console.error("Logout error:", errorMessage);

      // Even if there's an error, we still want to clear the local auth data
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      setUser(null);

      // Show info notification instead of error since the user is logged out anyway
      Swal.fire({
        icon: "info",
        title: "Logged Out",
        text: "You have been logged out.",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Compute isAuthenticated based on user state
  const isAuthenticated = !!user;

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
