import React from "react";
import { Link } from "react-router-dom";

const UserFooter = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="w-full lg:fixed fixed bottom-0 font-inter bg-orange-100">
      <footer className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-5 border-t border-slate-500 shadow-sm z-50 transition-all duration-700 ease-in-out ">
        <div className="flex justify-between px-10 w-full">
         <div className="flex gap-2 items-center">
         <p>Ticketeer</p>
            <p className="text-sm">&copy; {getCurrentYear()}</p>
         </div>
          <div className="flex justify-between gap-4 items-center">
            <Link to="/reviews">
              <p className="text-base">Reviews</p>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserFooter;
