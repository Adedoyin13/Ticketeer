import React, { useEffect, useState } from "react";
import register from "./../../../assets/regi.png";
import { toast } from "react-toastify";
import PasswordInput from "../../Reusables/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/reducers/userSlice";
import GoogleAuth from "./GoogleAuth";
import Loader from "../../Spinners/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrengthError, setPasswordStrengthError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, isAuthenticated } = useSelector(
    (state) => state.user
  ); // Get state

    if(loading.register) {
      return <Loader loading={loading.register}/>
    }

  useEffect(() => {
    if (user && isAuthenticated) {
      navigate("/dashboard", { replace: true }); // Redirect after login
    }
  }, [navigate]);

  // Handle form changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPasswordError("");
    setPasswordStrengthError("");
  };

  const isPasswordStrong = (password) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPassword = formData.password.trim();
    if (!isPasswordStrong(trimmedPassword)) {
      setPasswordStrengthError(
        "Password must be at least 8 characters, include an uppercase letter, a number & a special character."
      );
      return;
    }
    setPasswordStrengthError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");

    const { confirmPassword, ...dataToSend } = formData; // ✅ Remove confirmPassword before sending

    const resultAction = await dispatch(registerUser(dataToSend));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handlePastePassword = (e) => {
    e.preventDefault();
    toast.error("Cannot paste into this field");
    return;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-10 bg-orange-50 dark:bg-zinc-900 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch justify-center bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden min-h-[600px]">
          {/* Image Section */}
          <div className="hidden lg:flex lg:w-1/2">
            <img
              src={register}
              alt="Registration illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 px-6 lg:px-10 py-8 flex flex-col justify-center">
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold font-merriweather dark:text-white">
                Get Ready to Experience More!
              </h1>
              <p className="font-inter text-gray-600 dark:text-gray-300">
                Sign up and unlock access to the best events near you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 max-w-md mx-auto flex flex-col gap-4 font-inter"
            >
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-medium pl-1 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Please fill your full name"
                  className="bg-orange-50 dark:bg-zinc-700 dark:text-white p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-400 transition-all"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="font-medium pl-1 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Please fill your email"
                  className="bg-orange-50 dark:bg-zinc-700 dark:text-white p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-400 transition-all"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="font-medium pl-1 dark:text-white"
                >
                  Password
                </label>
                <PasswordInput
                  placeholder="Enter password"
                  id="password"
                  name="password"
                  required
                  className="bg-orange-50 dark:bg-zinc-700 dark:text-white p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-400 w-full transition-all"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="font-medium pl-1 dark:text-white"
                >
                  Confirm Password
                </label>
                <PasswordInput
                  placeholder="Confirm password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="bg-orange-50 dark:bg-zinc-700 dark:text-white p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-400 w-full transition-all"
                  onPaste={handlePastePassword}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>

              {/* Error messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {passwordStrengthError && (
                <p className="text-red-500 text-sm">{passwordStrengthError}</p>
              )}
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              {/* Terms and checkbox */}
              <div className="flex gap-2 items-start mt-1">
                <input
                  type="checkbox"
                  className="mt-1 cursor-pointer"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{" "}
                  <Link
                    to="/terms-and-conditions"
                    className="text-orange-600 hover:underline"
                  >
                    terms & conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-orange-600 hover:underline"
                  >
                    privacy policy
                  </Link>{" "}
                  of Ticketeer
                </p>
              </div>

              {/* Submit + Social Auth */}
              <div className="flex flex-col gap-4 items-center mt-2">
                <button
                  type="submit"
                  className={`py-3 px-6 w-full md:w-2/3 font-medium rounded-full text-white transition-all duration-300 ${
                    isChecked
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-orange-300 cursor-not-allowed"
                  }`}
                  disabled={!isChecked || loading.register}
                >
                  {loading.register ? "Creating Account..." : "Create Account"}
                </button>

                <p className="font-bold text-lg dark:text-white">OR</p>

                <GoogleAuth />

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link to="/login" className="text-orange-400 hover:underline">
                    Login
                  </Link>
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need help?{" "}
                  <Link
                    to="/contact"
                    className="text-orange-400 hover:underline"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </form>

            {/* Home Link */}
            <div className="flex justify-end mt-4">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-red-400"
              >
                - Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
