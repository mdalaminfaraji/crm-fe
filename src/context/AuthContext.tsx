import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user type
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Define the register data type
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null
});

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
        
        // Check if user is already authenticated in localStorage
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuth) {
          // In a real app, you would validate the token with the backend
          // const response = await fetch('http://localhost:5000/api/auth/profile', {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem('token')}`
          //   },
          //   credentials: 'include'
          // });
          
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData.user);
          // } else {
          //   // If token is invalid, clear auth data
          //   localStorage.removeItem('token');
          //   localStorage.removeItem('isAuthenticated');
          //   setUser(null);
          // }

          // For demo purposes, set a mock user
          setUser({
            id: '1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User'
          });
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
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
      
      // In a real app, you would call your API
      // const response = await fetch('http://localhost:5000/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ email, password }),
      //   credentials: 'include'
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Login failed');
      // }
      
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      
      // For demo purposes, simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email !== 'demo@example.com' || password !== 'password') {
        throw new Error('Invalid credentials');
      }
      
      // Set mock user data
      const userData = {
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User'
      };
      
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', 'mock-jwt-token');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would call your API
      // const response = await fetch('http://localhost:5000/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(userData)
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Registration failed');
      // }
      
      // For demo purposes, simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would typically redirect to login after registration
      // Here we'll just simulate a successful registration
      console.log('Registration successful:', userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you would call your API
      // await fetch('http://localhost:5000/api/auth/logout', {
      //   method: 'POST',
      //   credentials: 'include'
      // });
      
      // For demo purposes, simulate logout delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
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
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


