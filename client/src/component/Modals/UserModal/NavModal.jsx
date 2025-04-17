import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

const navTitle = [
  { url: "/", title: "Home" },
  { url: "/about", title: "About" },
  { url: "/events", title: "Explore events" },
  { url: "/create", title: "Create event" },
  { url: "/blog", title: "Blog" },
];

const NavModal = ({ onClose }) => {
  const location = useLocation();
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-zinc-900 dark:bg-opacity-70 flex justify-center items-center z-50 lg:hidden">
      <div className="flex flex-col gap-6 p-8 rounded-lg shadow-lg relative w-full bg-orange-50 dark:bg-zinc-800 mx-4">
        <div
          onClick={onClose}
          className="hover:bg-orange-100 dark:hover:bg-zinc-700 cursor-pointer p-4 w-14 h-14 rounded-lg transition"
        >
          <IoClose size={25} className="text-zinc-800 dark:text-zinc-200" />
        </div>

        {/* Navigation Links */}
        <ul className="lg:hidden items-center md:space-y-10 space-y-6 pl-16 font-inter font-semibold md:font-bold md:text-3xl text-2xl pb-5">
          {navTitle.map(({ url, title }, index) => (
            <li key={index}>
              <Link
                to={url}
                onClick={onClose}
                className={`transition-colors duration-700 ease-in-out hover:text-orange-600 
                ${
                  url === location.pathname
                    ? "text-orange-700 dark:text-orange-500 font-semibold"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavModal;
