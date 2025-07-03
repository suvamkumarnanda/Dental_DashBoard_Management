
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const hardcodedUsers = [
  {
    email: 'admin@entnt.in',
    password: 'Admin@123', 
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'patient1@entnt.in',
    password: 'Patient@123',
    name: 'John Doe',
    role: 'patient',
  }
];

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  const roleFromState = location.state?.role || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: roleFromState,
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (user && !hasNavigated.current) {
      toast.success('Logged in successfully!');
      hasNavigated.current = true;

      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (user.role === 'patient') {
        navigate('/patient-dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Email is invalid';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!passwordPattern.test(formData.password)) {
      errs.password =
        'Password must include uppercase, lowercase, number, and special character';
    }

    if (!formData.role) {
      errs.role = 'Role is required';
    }

    return errs;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoginError('');
    setIsLoading(true);

    try {
      // Find matched user
      const foundUser = hardcodedUsers.find(
        (u) =>
          u.email === formData.email &&
          u.password === formData.password &&
          u.role === formData.role
      );

      if (!foundUser) {
        setLoginError('Invalid email, password, or role.');
        setIsLoading(false);
        return;
      }

      // Call login with user object 
      await login({
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      });
      // navigation handled by useEffect
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">
            Login{' '}
            {formData.role &&
              `as ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
          </h2>

          {loginError && (
            <div
              className="mb-4 text-red-600 font-semibold text-center"
              role="alert"
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-3 py-2 border rounded ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
           
            <div className="mb-4 relative">
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`w-full px-3 py-2 border rounded ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-8 text-sm text-pink-700 hover:text-blue-900 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            
            {!roleFromState && (
              <div className="mb-6">
                <label htmlFor="role" className="block mb-1 font-medium">
                  Login as
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  aria-invalid={!!errors.role}
                  aria-describedby={errors.role ? 'role-error' : undefined}
                  className={`w-full px-3 py-2 border rounded ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                </select>
                {errors.role && (
                  <p id="role-error" className="text-red-500 text-sm mt-1">
                    {errors.role}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded text-white transition ${
                isLoading
                  ? 'bg-pink-400 cursor-not-allowed'
                  : 'bg-pink-700 hover:bg-pink-800'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-700 hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
