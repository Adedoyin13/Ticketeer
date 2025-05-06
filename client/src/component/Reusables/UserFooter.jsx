import React from "react";
import { Link } from "react-router-dom";

const UserFooter = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="w-full fixed bottom-0 bg-orange-50 dark:bg-zinc-900 font-inter shadow-inner border-t border-orange-200 dark:border-zinc-700 z-20">
      <footer className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-4 transition-all duration-500">
        {/* Left Section */}
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-medium">
          <Link to="/">
            <span className="text-orange-600 dark:text-orange-400 font-semibold text-base">
              Ticketeer
            </span>
          </Link>
          <span>&copy; {getCurrentYear()}</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition"
          >
            Home
          </Link>
          {/* Add more footer links here later */}
        </div>
      </footer>
    </div>
  );
};

export default UserFooter;
