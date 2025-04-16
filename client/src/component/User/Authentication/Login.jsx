import React, { useEffect, useState } from "react";
import loginImg from "./../../../assets/About-Show-Ticket.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "../../Reusables/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../../../redux/reducers/userSlice";
import GoogleAuth from "./GoogleAuth";

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
      // sessionStorage.setItem('user', JSON.stringify(userData));
  // Also store in cookies if needed for backend verification
  // document.cookie = `sessionId=${userData.sessionId}; path=/; Secure; SameSite=Strict`;
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
      navigate("/dashboard", { replace: true }); // Redirect after login
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center py-8 md:py-20 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch justify-center bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Image Section */}
          <div className="hidden lg:flex lg:w-1/2 lg:h-full">
            <img
              src={loginImg}
              alt="Login illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 px-6 lg:px-12 py-8 flex flex-col gap-5 justify-center">
            <div className="text-center flex flex-col gap-1">
              <h1 className="text-xl md:text-2xl font-bold font-merriweather">
                Let's Get You Back to the Action!
              </h1>
              <p className="font-inter text-gray-600">
                Log in to book and manage your tickets.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md mx-auto flex flex-col gap-4 font-inter"
            >
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

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-medium pl-1">
                  Password
                </label>
                <PasswordInput
                  placeholder="Enter password"
                  id="password"
                  name="password"
                  required={true}
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="flex flex-col gap-4 items-center mt-2">
                <button
                  type="submit"
                  className="py-3 px-6 w-full md:w-2/3 font-medium rounded-full transition-all duration-300 text-white bg-orange-400 hover:bg-orange-500"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <p className="font-bold text-lg">OR</p>
                {/* <button onClick={handleGoogleLogin} className="bg-orange-50 p-3 rounded-full hover:bg-orange-100">
                  <FcGoogle size={30} />
                </button> */}

                  <GoogleAuth/>

                <p className="text-sm text-gray-600">
                  New to Ticketeer?{" "}
                  <span className="text-orange-400 hover:text-orange-600">
                    <Link to="/register">Sign Up</Link>
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
                <p className="text-base text-gray-600 hover:text-red-400">
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

export default Login;
