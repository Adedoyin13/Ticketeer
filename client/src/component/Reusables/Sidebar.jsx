import React from "react";
import TicketeerLogo from "./../../assets/Ticketeer-Logo.png";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaCog, FaHome } from "react-icons/fa";
import { MdOutlineEventNote, MdCreateNewFolder } from "react-icons/md";
import { LuTicket } from "react-icons/lu";

const sideLink = [
  { title: "Dashboard", route: "/dashboard" },
  { title: "Create Event", route: "/create-event" },
  { title: "Events", route: "/event-list" },
  { title: "My Events", route: "/my-events" },
  { title: "My Tickets", route: "/my-tickets" },
  { title: "Settings", route: "/settings" },
];

const iconMap = {
  Dashboard: FaHome,
  "Create Event": MdCreateNewFolder,
  Events: MdOutlineEventNote,
  "My Events": MdOutlineEventNote,
  "My Tickets": LuTicket,
  Settings: FaCog,
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-0 z-50 font-inter">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    ></div>
  
    {/* Sidebar Container */}
    <div className="relative w-11/12 max-w-sm sm:max-w-3/12 md:w-4/12 lg:w-3/12 h-full bg-white dark:bg-zinc-900 shadow-2xl rounded-r-2xl p-6 flex flex-col justify-between transition-all duration-300 ease-in-out">
      {/* Top Section */}
      <div className="flex flex-col gap-10">
        <button
          onClick={onClose}
          className="text-zinc-700 dark:text-gray-300 hover:text-orange-500 transition"
        >
          <FaArrowLeft size={20} />
        </button>
  
        <ul className="flex flex-col gap-3">
          {sideLink.map(({ title, route }, index) => {
            const Icon = iconMap[title] || MdOutlineEventNote;
            const isActive = route === location.pathname;
  
            return (
              <Link to={route} key={index} onClick={onClose}>
                <li
                  className={`flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer text-sm sm:text-base font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-zinc-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-zinc-800 hover:text-orange-600"
                  }`}
                >
                  <Icon size={20} />
                  {title}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
  
      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={TicketeerLogo}
          alt="Ticketeer Logo"
          className="w-[100px] object-contain opacity-90 dark:opacity-80"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Need help?{" "}
          <Link
            to="/contact"
            onClick={onClose}
            className="text-orange-600 hover:underline"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  </aside>  
  );
};

export default Sidebar;
