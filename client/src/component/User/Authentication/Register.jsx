import React, { useState } from "react";
import register from "./../../../assets/regi.png";
import { toast } from "react-toastify";
import PasswordInput from "../../Reusables/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/reducers/userSlice";
import GoogleAuth from "./GoogleAuth";

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
  const { loading, error } = useSelector((state) => state.user); // Get state

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

  const handleGoogleLogin = () => {
    window.location.href = `${SERVER_URL}/user/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-10 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch justify-center bg-white rounded-2xl shadow-md overflow-hidden min-h-[600px]">
          {/* Image Section */}
          <div className="hidden lg:flex lg:w-1/2 h-auto lg:h-full">
            <img
              src={register}
              alt="Registration illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 px-6 lg:px-8 py-4 lg:py-6 flex flex-col justify-center">
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold font-merriweather">
                Get Ready to Experience More!
              </h1>
              <p className="font-inter text-gray-600">
                Sign up and unlock access to the best events near you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 max-w-md mx-auto flex flex-col gap-4 font-inter"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="font-medium pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Please fill your full name"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="font-medium pl-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Please fill your email"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="font-medium pl-1">
                  Password
                </label>
                <PasswordInput
                  placeholder="Enter password"
                  id="password"
                  name="password"
                  required
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="font-medium pl-1">
                  Confirm Password
                </label>
                <PasswordInput
                  placeholder="Confirm password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
                  onPaste={handlePastePassword}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  // disabled={loading}
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {passwordStrengthError && (
                <p style={{ color: "red" }}>{passwordStrengthError}</p>
              )}{" "}
              {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}{" "}
              <div className="flex gap-2 items-start mt-1">
                <input
                  type="checkbox"
                  className="mt-1 cursor-pointer"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <p className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms-and-conditions">
                    <span className="text-orange-600 hover:text-orange-700 hover:underline">
                      terms & conditions
                    </span>
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy">
                    <span className="text-orange-600 hover:text-orange-700 hover:underline">
                      privacy policy
                    </span>
                  </Link>{" "}
                  of Ticketeer
                </p>
              </div>
              <div className="flex flex-col gap-4 items-center mt-2 font-inter">
                <button
                  type="submit"
                  className={`py-3 px-6 w-full md:w-2/3 font-medium rounded-full transition-all duration-300 text-white ${
                    isChecked
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-orange-300 cursor-not-allowed"
                  }`}
                  disabled={!isChecked || loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="font-bold text-lg">OR</p>
                {/* <button onClick={handleGoogleLogin} className="bg-orange-50 p-3 rounded-full hover:bg-orange-100">
                  <FcGoogle size={30} />
                </button> */}
                <GoogleAuth/>
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <span className="text-orange-400 hover:text-orange-600">
                    <Link to="/login">Login</Link>
                  </span>
                </p>
                <p className="text-xs text-gray-600">
                  Need help?{" "}
                  <span className="text-orange-400 hover:text-orange-600">
                    <Link to="/contact">Contact Support</Link>
                  </span>
                </p>
              </div>
            </form>
            <div className="flex justify-end">
              <Link to="/">
                <p className="text-base text-gray-600 hover:text-red-400 mt-2">
                  - Home
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
