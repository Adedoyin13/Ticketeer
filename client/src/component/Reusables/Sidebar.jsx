import React from "react";
import TicketeerLogo from "./../../assets/Ticketeer-Logo.png";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { TbTicket } from "react-icons/tb";
import { FaUser, FaCog, FaHome, FaRegChartBar } from "react-icons/fa";
import {
  MdOutlineEventNote,
  MdCreateNewFolder,
  MdEventBusy,
} from "react-icons/md";
import { LuTicket } from "react-icons/lu";

const sideLink = [
  { title: "Dashboard", route: "/dashboard" },
  { title: "Create Event", route: "/create-event" },
  { title: "Events", route: "/event-list" },
  { title: "My Events", route: "/my-events" },
  { title: "My Tickets", route: "/my-tickets" },
  // { title: "Tickets", route: "/tickets" },
  // { title: "Sales & reports", route: "/reports" },
  { title: "Settings", route: "/settings" },
];

const iconMap = {
  Dashboard: FaHome,
  "Create Event": MdCreateNewFolder,
  Events: MdOutlineEventNote,
  Tickets: TbTicket,
  "My Events": MdOutlineEventNote,
  "My Tickets": LuTicket,
  "Sales & reports": FaRegChartBar,
  Settings: FaCog,
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-0 z-50 font-inter">
      {/* Overlay for smaller screens */}
      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Sidebar Container */}
      <div className="relative w-11/12 max-w-sm sm:max-w-3/12 md:w-4/12 lg:w-3/12 h-full bg-orange-300 shadow-lg p-6 flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex flex-col gap-10">
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-600"
          >
            <FaArrowLeft size={20} />
          </button>

          <ul className="flex flex-col gap-4">
            {sideLink.map(({ title, route }, index) => {
              const Icon = iconMap[title] || FaRegChartBar;
              const isActive = route === location.pathname;
              return (
                <Link to={route} key={index} onClick={onClose}>
                  <li
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm sm:text-base transition-all duration-300 ${
                      isActive
                        ? "bg-orange-100 text-gray-900 font-semibold"
                        : "hover:bg-orange-200 text-gray-800"
                    }`}
                  >
                    <Icon size={18} />
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
            className="w-[100px] object-contain"
          />
          <p className="text-xs text-gray-700 text-center">
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
