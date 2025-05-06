import React from "react";
import logo from "./../../assets/Ticketeer-Logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div>
  <div className="bg-slate-500 dark:bg-zinc-900 h-80 flex md:flex-row scroll-smooth flex-col items-center justify-evenly text-white dark:text-gray-300">
    <div className="flex flex-col gap-6 items-start">
      <div>
        <img src={logo} alt="Ticketeer Logo" />
      </div>
      <p className="font-inter lg:font-medium font-normal lg:text-lg md:text-base text-sm">
        &copy; {getCurrentYear()}. All Rights Reserved
      </p>
    </div>
    <div className="flex lg:gap-20 md:gap-10 gap-12">
      {/* About Section */}
      <div className="flex flex-col gap-6">
        <div className="font-lora lg:font-semibold font-medium lg:text-lg md:text-base text-sm">
          About
        </div>
        <ul className="flex flex-col gap-4 font-inter md:font-medium font-normal md:text-sm text-xs">
          <Link to="/about">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">About</li>
          </Link>
          <Link to="/about#howItWorks">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">How It works</li>
          </Link>
          <Link to="/about#features">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">Our Features</li>
          </Link>
        </ul>
      </div>

      {/* Blog Section */}
      <div className="flex flex-col gap-6">
        <div className="font-lora lg:font-semibold font-medium lg:text-lg md:text-base text-sm">
          Blog
        </div>
        <ul className="flex flex-col gap-4 font-inter md:font-medium font-normal md:text-sm text-xs">
          <Link to="/blog">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">Blog</li>
          </Link>
          <Link to="/blog#points">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">Key Points</li>
          </Link>
          <Link to="/blog#thought">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">Thoughts</li>
          </Link>
        </ul>
      </div>

      {/* Event Section */}
      <div className="flex flex-col gap-6">
        <div className="font-lora lg:font-semibold font-medium lg:text-lg md:text-base text-sm">
          Event
        </div>
        <ul className="flex flex-col gap-4 font-inter md:font-medium font-normal md:text-sm text-xs">
          <Link to="/create-event">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">Create Event</li>
          </Link>
          <Link to="/event-list">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">Explore Events</li>
          </Link>
          <Link to="/my-tickets">
            <li className="hover:text-orange-300 dark:hover:text-orange-400">My Tickets</li>
          </Link>
        </ul>
      </div>
    </div>
  </div>
</div>
  );
};

export default Footer;
