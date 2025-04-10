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
  { title: "Tickets", route: "/tickets" },
  { title: "Settings", route: "/settings" },
  { title: "Profile Update", route: "/settings/update" },
];

const Header = () => {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

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
  const dispatch = useDispatch()

    useEffect(() => {
      if (!user) {
        dispatch(getUser()); // ✅ Fetch user from backend
      }
    }, [dispatch]);

    if(loading) {
      return <Loader loading={loading}/>
    };  

  return (
    <div className="w-full lg:fixed fixed top-0 left-0 right-0 z-10 font-inter bg-orange-100">
      <nav className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 border-b border-slate-500 shadow-sm z-50 transition-all duration-700 ease-in-out ">
        <div className="flex gap-3">
          <button className="" onClick={openModal}>
            <FiMenu size={20} />
          </button>
          <ul>
            {navLink.map(({ route, title }, index) => (
              <li key={index}>
                <Link
                  to={route}
                  className={
                    route === location.pathname
                      ? "text-lg font-medium"
                      : "hidden"
                  }
                >
                  <p>{title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-10 items-center">
          <button>
            <IoMdNotificationsOutline
              size={25}
              onClick={openNotificationModal}
            />
          </button>
          <div className="flex gap-4 items-center" onClick={openProfileModal}>
            <div className="w-[50px] h-[50px] cursor-pointer overflow-hidden rounded-full bg-white">
              <img
                src={user?.photo?.imageUrl}
                alt="User image"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <p className="font-medium text-xl">{user?.name}</p> */}
            <p className="font-medium text-xl">{formatName(user?.name)}</p>
          </div>
        </div>
      </nav>
      {modalOpen && <Sidebar onClose={closeModal} isOpen={openModal} />}
      {profileModalOpen && (
        <ProfileModal onClose={closeProfileModal} isOpen={openProfileModal} />
      )}
      {notificationModalOpen && (
        <NotificationModal onClose={closeNotificationModal} />
      )}
    </div>
  );
};

export default Header;
