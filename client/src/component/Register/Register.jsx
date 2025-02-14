import React, { useState } from 'react'
import register from './../../assets/register.png'
import { toast } from 'react-toastify';
import PasswordInput from '../Layout/PasswordInput';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const Register = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      };
    
      const handlePastePassword = (e) => {
        e.preventDefault();
        toast.error("Cannot paste into this field");
        return;
      };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-20 bg-orange-50">
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
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-8 lg:py-12 flex flex-col justify-center">
          <div className="text-center flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-bold font-merriweather">
              Get Ready to Experience More!
            </h1>
            <p className="font-inter text-gray-600">
              Sign up and unlock access to the best events near you.
            </p>
          </div>
  
          <form className="mt-8 max-w-md mx-auto flex flex-col gap-5 font-inter">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="font-medium">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Please fill your full name"
                className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
                required
              />
            </div>
  
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
                required
                className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
              />
            </div>
  
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="font-medium">Confirm Password</label>
              <PasswordInput
                placeholder="Confirm password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
                onPaste={handlePastePassword}
              />
            </div>
  
            <div className="flex gap-2 items-start mt-2">
              <input
                type="checkbox"
                className="mt-1 cursor-pointer"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <p className="text-sm">
                I agree to the{" "}
                <Link to="/terms-and-conditions">
                  <span className="text-orange-600 hover:text-orange-700 hover:underline">terms & conditions</span>
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy">
                  <span className="text-orange-600 hover:text-orange-700 hover:underline">privacy policy</span>
                </Link>{" "}
                of Ticketeer
              </p>
            </div>
  
            <div className="flex flex-col gap-6 items-center mt-6 font-inter">
              <button
                type="submit"
                className={`py-3 px-6 w-full md:w-2/3 font-medium rounded-full transition-all duration-300 text-white ${
                  isChecked ? "bg-orange-400 hover:bg-orange-500" : "bg-orange-300 cursor-not-allowed"
                }`}
              >
                Create account
              </button>
  
              <p className="font-bold text-2xl">OR</p>
              <button className="bg-orange-50 p-4 rounded-full hover:bg-orange-100">
                <FcGoogle size={30} />
              </button>
              <p>
                Already have an account?{" "}
                <span className="text-orange-400 hover:text-orange-600">
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
)
}

export default Register