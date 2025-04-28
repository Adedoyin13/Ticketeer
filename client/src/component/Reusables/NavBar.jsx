import React, { useEffect, useState } from "react";
import TicketeerLogo from "./../../assets/Ticketeer-Logo.png";
import logo from "./../../assets/ticket-logo.png";
import { IoMdMenu } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import NavModal from "../Modals/UserModal/NavModal";
import { useDispatch, useSelector } from "react-redux";
// import NavModal from "../Modals/UserModal/NavModal";

const navTitle = [
  { url: "/", title: "Home" },
  { url: "/about", title: "About" },
  { url: "/events", title: "Explore events" },
  { url: "/create", title: "Create event" },
  { url: "/blog", title: "Blog" },
];

const NavBar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useSelector((state) => state.user);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentBg =
    location.pathname === "/" || location.pathname === "/create";

  return (
    <div className="w-full lg:fixed fixed top-0 left-0 right-0 z-50">
      <nav
        className={`relative flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 shadow-sm z-50 transition-all duration-700 ease-in-out 
          ${
            isTransparentBg && !scrolled
              ? "bg-cover bg-center bg-no-repeat text-white border-none"
              : "bg-orange-50 text-gray-800 shadow-orange-200 border-b"
          } 
        `}
        style={
          isTransparentBg && !scrolled
            ? {
                backgroundImage: `url(${
                  location.pathname === "/"
                    ? "/path-to-home-hero.jpg"
                    : "/path-to-events-hero.jpg"
                } : '/path-to-create-events-hero.jpg)`,
              }
            : {}
        }
      >
        {/* Logo Section */}
        <div>
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src={TicketeerLogo}
                className="w-32 sm:w-36 lg:w-40 hidden md:block"
                alt="Ticketeer Logo"
              />
            </Link>
          </div>
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} className="w-10 md:hidden" alt="Ticketeer Logo" />
            </Link>
          </div>
        </div>

        {/* Navigation and Actions Container */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-16">
          {/* Navigation Links */}
          <ul className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-inter font-semibold text-sm xl:text-base">
            {navTitle.map(({ url, title }, index) => (
              <li key={index}>
                <Link
                  to={url}
                  className={`transition-colors duration-700 ease-in-out hover:text-orange-600 
                    ${
                      url === location.pathname
                        ? "text-orange-700 font-semibold"
                        : isTransparentBg && !scrolled
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {user ? (
              <Link to="/dashboard">
                <div className="border border-orange-500 shadow-md shadow-orange-100 rounded-full px-2 py-1 flex gap-1 items-center">
                  <p>{user.email}</p>
                  <div className="w-4 h-4 sm:w-8 sm:h-8 overflow-hidden rounded-full border border-orange-300">
                    <img
                      src={user?.photo?.imageUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button
                    className={`px-6 sm:px-8 lg:px-10 py-2 lg:py-2.5 font-medium rounded-full text-sm transition-all duration-700 ease-in-out 
                ${
                  isMobile
                    ? "bg-orange-400 text-white hover:bg-orange-500"
                    : "border-2 border-orange-600 text-orange-700 hover:text-orange-800 hover:border-orange-700 hover:bg-orange-200"
                }`}
                  >
                    Log In
                  </button>
                </Link>

                <Link to="/register" className="hidden lg:block">
                  <button className="px-4 lg:px-10 py-2 lg:py-2.5 bg-orange-400 text-white font-medium rounded-full text-sm transition-colors duration-500 ease-in-out hover:bg-orange-500">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button className="lg:hidden" onClick={openModal}>
              <IoMdMenu
                className={`text-2xl sm:text-3xl transition-all duration-700 ease-in-out hover:bg-orange-100 cursor-pointer p-4 h-14 w-14 rounded-lg ${
                  isTransparentBg && !scrolled ? "text-white" : "text-gray-800"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>
      {modalOpen && <NavModal onClose={closeModal} />}
    </div>
  );
};

export default NavBar;
