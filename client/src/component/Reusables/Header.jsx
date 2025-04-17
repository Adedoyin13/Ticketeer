import React, { useEffect, useState } from "react";
import img from "./../../assets/default-img.png";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Sidebar from "../Reusables/Sidebar";
import NotificationModal from "../Modals/NotificationModal/NotificationModal";
import ProfileModal from "../Modals/UserModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/reducers/userSlice";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import { isDarkModeEnabled, toggleDarkMode } from "../../theme";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const formatName = (namee) => {
  const name = namee.split(" ")[0];
  return name;
};

const navLink = [
  { title: "Home", route: "/dashboard" },
  { title: "Create event", route: "/create-event" },
  { title: "Create ticket", route: "/create-ticket" },
  { title: "Events", route: "/event-list" },
  { title: "Manage event", route: "/manage-event" },
  { title: "My events", route: "/my-events" },
  { title: "My tickets", route: "/my-tickets" },
  { title: "Tickets", route: "/tickets" },
  { title: "Settings", route: "/settings" },
  { title: "Profile Update", route: "/settings/update" },
];

const Header = () => {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkModeEnabled());
  }, []);

  const handleToggle = () => {
    toggleDarkMode();
    setIsDark((prev) => !prev);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const openNotificationModal = () => {
    setNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setNotificationModalOpen(false);
  };

  const { user, loading, error } = useSelector((state) => state.user);
  console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getUser()); // ✅ Fetch user from backend
    }
  }, [dispatch]);

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (error) {
    return toast.error(error);
  }

  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-orange-50 dark:bg-zinc-900 shadow-md font-inter">
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-3 border-b border-orange-200 dark:border-zinc-700 backdrop-blur-md">
        {/* Left - Menu & Active Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={openModal}
            className="p-2 rounded-md text-zinc-800 dark:text-zinc-200 hover:bg-orange-200 dark:hover:bg-zinc-800 transition"
          >
            <FiMenu size={22} />
          </button>

          <ul className="hidden sm:flex items-center">
            {navLink.map(({ route, title }, index) => (
              <li key={index}>
                <Link
                  to={route}
                  className={`text-sm sm:text-base font-medium transition duration-300 ${
                    route === location.pathname
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
          >
            {isDark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </button>

          <button
            onClick={openNotificationModal}
            className="text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition"
          >
            <IoMdNotificationsOutline size={24} />
          </button>

          <div
            onClick={openProfileModal}
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
      {modalOpen && <Sidebar onClose={closeModal} isOpen={openModal} />}
      {profileModalOpen && (
        <ProfileModal onClose={closeProfileModal} isOpen={openProfileModal} />
      )}
      {notificationModalOpen && (
        <NotificationModal onClose={closeNotificationModal} />
      )}
    </header>
  );
};

export default Header;
