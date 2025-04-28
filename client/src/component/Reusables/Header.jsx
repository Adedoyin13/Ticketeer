import React, { useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Sidebar from "../Reusables/Sidebar";
import NotificationModal from "../Modals/NotificationModal/NotificationModal";
import ProfileModal from "../Modals/UserModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { toggleThemeMode } from "../../redux/reducers/userSlice";

const formatName = (namee) => {
  const name = namee?.split(" ")[0];
  return name;
};

const navLink = [
  { title: "Home", route: "/dashboard" },
  { title: "Create Event", route: "/create-event" },
  { title: "Create Ticket", route: "/create-ticket" },
  { title: "Events", route: "/event-list" },
  { title: "Manage Event", route: "/manage-event/:eventId" },
  { title: "View Event", route: "/view-event/:eventId" },
  { title: "My Events", route: "/my-events" },
  { title: "My Tickets", route: "/my-tickets" },
  { title: "Tickets", route: "/tickets" },
  { title: "Settings", route: "/settings" },
  { title: "Profile Update", route: "/settings/profile-update" },
];

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const { user, loading = {}, error, themeMode } = useSelector((state) => state.user);

  const handleToggle = () => {
    dispatch(toggleThemeMode());
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const toggleModal = (setter) => () => setter((prev) => !prev);

  const isActive = (route) =>
    matchPath({ path: route, end: false }, location.pathname);

  if (loading.getUser) {
    return <Loader loading={loading.getUser} />;
  }

  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-orange-50 dark:bg-zinc-900 shadow-md font-inter">
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-3 border-b border-orange-200 dark:border-zinc-700 backdrop-blur-md">
        {/* Left - Menu & Active Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleModal(setModalOpen)}
            className="p-2 rounded-md text-zinc-800 dark:text-zinc-200 hover:bg-orange-200 dark:hover:bg-zinc-800 transition"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={22} />
          </button>

          <ul className="hidden sm:flex items-center">
            {navLink.map(({ route, title }, index) => (
              <li key={index}>
                <Link
                  to={route}
                  className={`text-sm sm:text-base font-medium transition duration-300 ${
                    isActive(route)
                      ? "text-orange-600 dark:text-orange-400"
                      : "hidden"
                  }`}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right - Notification & Profile */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleToggle}
            className="text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition"
            aria-label="Toggle theme"
          >
            {themeMode === "light" ? (
              <MdDarkMode size={24} />
            ) : (
              <MdLightMode size={24} />
            )}
          </button>

          <button
            onClick={toggleModal(setNotificationModalOpen)}
            className="text-zinc-800 relative dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition"
            aria-label="Open notifications"
          >
            <IoMdNotificationsOutline size={24} />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>

          <div
            onClick={toggleModal(setProfileModalOpen)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border border-orange-300 dark:border-zinc-600">
              <img
                src={user?.photo?.imageUrl || user?.photo}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
              {formatName(user?.name) || user?.name}
            </p>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {modalOpen && <Sidebar onClose={toggleModal(setModalOpen)} isOpen={modalOpen} />}
      {profileModalOpen && (
        <ProfileModal onClose={toggleModal(setProfileModalOpen)} isOpen={profileModalOpen} />
      )}
      {notificationModalOpen && (
        <NotificationModal onClose={toggleModal(setNotificationModalOpen)} />
      )}
    </header>
  );
};

export default Header;