import { createContext } from 'react';
import { AuthResponse } from '../services/authService';

// Define the user type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  error: string | null;
}

// Define the register data type
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => Promise.resolve(),
  register: () => Promise.resolve({} as AuthResponse),
  logout: () => Promise.resolve(),
  error: null
});
