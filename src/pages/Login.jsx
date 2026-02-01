import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";
import { useEffect, useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message, errors, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-800">
      {/* Left Side: Brand (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 items-center justify-center p-12">
        <span className="text-white text-5xl font-bold tracking-tight">
          Taskify
        </span>
      </div>

      {/* Right Side: Login Card */}
      <div className="w-full lg:w-1/2 bg-red-50 rounded-3xl m-6 lg:m-10 lg:mr-40 flex flex-col items-center justify-center shadow-2xl">
        <div className="w-full max-w-md p-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Get Into Taskify
          </h2>
          <p className="text-gray-600 mb-10 text-sm">
            Please enter your details.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {isError && message && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4 text-sm">
                {message}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col">
              <label
                className="text-sm font-semibold text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition-all"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {/* Field Specific Errors */}
              {errors?.email?.map((err, i) => (
                <span key={i} className="text-red-500 text-xs mt-1">
                  {err}
                </span>
              ))}
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label
                className="text-sm font-semibold text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition-all"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              {/* Field Specific Errors */}
              {errors?.password?.map((err, i) => (
                <span key={i} className="text-red-500 text-xs mt-1">
                  {err}
                </span>
              ))}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl mt-2 hover:bg-gray-800 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <p className="text-center mt-8 text-gray-600">
            New to Taskify?
            <button
              onClick={() => navigate("/auth/register")}
              className="ml-2 text-red-600 font-bold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
