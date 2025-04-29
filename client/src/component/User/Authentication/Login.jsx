import React, { useEffect, useState } from "react";
import loginImg from "./../../../assets/About-Show-Ticket.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "../../Reusables/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, setUser } from "../../../redux/reducers/userSlice";
import GoogleAuth from "./GoogleAuth";
import Loader from "../../Spinners/Loader";
import { setWalletAddress } from "../../../redux/reducers/walletSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      dispatch(setWalletAddress(user.walletAddress));
      console.log(result);
      toast.success("Login successful!");
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-orange-50 dark:bg-zinc-900 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-stretch justify-center backdrop-blur-sm bg-white/90 dark:bg-zinc-800/70 shadow-2xl rounded-3xl overflow-hidden border border-orange-100 dark:border-zinc-700 transition-all duration-300">
        {/* Image Section */}
        <div className="hidden lg:flex lg:w-1/2">
          <img
            src={loginImg}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 px-8 py-10 md:py-14 flex flex-col justify-center gap-6">
          <div className="text-center flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold font-merriweather text-gray-800 dark:text-white">
              Welcome Back to the Action!
            </h1>
            <p className="text-sm md:text-base font-inter text-gray-600 dark:text-gray-300">
              Log in to book and manage your tickets.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto flex flex-col gap-5 font-inter"
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="bg-orange-50 dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-3 rounded-lg border border-orange-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <PasswordInput
                placeholder="Enter password"
                id="password"
                name="password"
                required
                className="bg-orange-50 dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-3 rounded-lg border border-orange-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Error Message */}
            {/* {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )} */}

            {/* Login Button & Google */}
            <div className="flex flex-col gap-4 items-center mt-2">
              <button
                type="submit"
                className="py-3 px-6 w-full md:w-2/3 font-semibold rounded-full transition-all duration-300 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300"
                disabled={loading.login}
              >
                {loading.login ? "Logging in..." : "Login"}
              </button>

              <p className="font-bold text-sm text-gray-500 dark:text-gray-300">
                OR
              </p>
              <GoogleAuth />

              <p className="text-sm text-gray-600 dark:text-gray-300">
                New to Ticketeer?{" "}
                <Link
                  to="/register"
                  className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium"
                >
                  Sign Up
                </Link>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <Link
                  to="/contact"
                  className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </form>

          {/* Back to Home */}
          <div className="flex justify-end mt-4">
            <Link to="/">
              <p className="text-base text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                ← Home
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
