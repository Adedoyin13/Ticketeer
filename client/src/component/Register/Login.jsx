import React from "react";
import login from './../../assets/About-Show-Ticket.png'
// import login from './../../assets/register.png'
import PasswordInput from "../Layout/PasswordInput";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-20 bg-orange-50">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row items-stretch justify-center bg-white rounded-2xl shadow-md overflow-hidden">
      
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 lg:h-full">
        <img
          src={login}
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 px-6 lg:px-12 py-2 lg:py-12 flex flex-col gap-10 justify-center">
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-bold font-merriweather">
            Let's Get You Back to the Action!
          </h1>
          <p className="font-inter text-gray-600">
            Log in to book and manage your tickets.
          </p>
        </div>

        <form className="w-full max-w-md mx-auto flex flex-col gap-5 font-inter">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Please fill your email"
              className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">Password</label>
            <PasswordInput
              placeholder="Enter password"
              id="password"
              name="password"
              required={true}
              className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
            />
          </div>

          <div className="flex flex-col gap-6 items-center mt-4">
            <button
              type="submit"
              className="py-3 px-6 w-full md:w-2/3 font-medium rounded-full transition-all duration-300 text-white bg-orange-400 hover:bg-orange-500"
            >
              Log In
            </button>

            <p className="text-sm text-gray-600">
              New to Ticketeer?{" "}
              <span className="text-orange-400 hover:text-orange-600">
                <Link to="/register">Sign Up</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;
