import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../features/auth/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-800">
      {/* Left Side: Brand (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 items-center justify-center p-12">
        <span className="text-white text-5xl font-bold tracking-tight">
          Taskify
        </span>
      </div>

      {/* Right Side: Register Card */}
      <div className="w-full lg:w-1/2 bg-red-50 rounded-3xl m-6 lg:m-10 lg:mr-40 flex flex-col items-center justify-center shadow-2xl">
        <div className="w-full max-w-md p-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Join Taskify
          </h2>
          <p className="text-gray-600 mb-8">
            Create your account to start organizing.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Name Field */}
            <div className="flex flex-col">
              <label
                className="text-sm font-semibold text-gray-700 mb-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition-all"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                required
              />
            </div>

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
                value={email}
                onChange={onChange}
                placeholder="name@company.com"
                required
              />
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
                onChange={onChange}
                placeholder="Min. 8 characters"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl mt-2 hover:bg-gray-800 transition-colors"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>

          {/* Back to Login Link */}
          <p className="text-center mt-8 text-gray-600">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="ml-2 text-red-600 font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
