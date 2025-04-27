import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register: registerUser,
    isLoading,
    error,
    isAuthenticated,
  } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Call the register function from auth context
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      Swal.fire({
        icon: "success",
        title: "Registration successful!",
        text: "You have been automatically logged in.",
        showConfirmButton: false,
        timer: 2000,
      });

      // After successful registration and auto-login, redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      console.log("User registered and logged in:", response);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration failed!",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
        showConfirmButton: false,
        timer: 2000,
      });
      console.error("Registration submission error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-lg w-full space-y-8 card">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up to get started with Mini-CRM
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="label">
                First Name
              </label>
              <div>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className="input pl-10"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="label">
                Last Name
              </label>
              <div>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className="input pl-10"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input pl-10"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input "
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400" />
                  ) : (
                    <FiEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="input pl-10"
                  placeholder="Enter your confirm password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
