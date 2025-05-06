import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TbTicket } from "react-icons/tb";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ConnectWallet from "../../Wallet/ConnectWallet";

const profileLink = [
  { link: "Tickets", route: "/my-tickets" },
  { link: "Edit Profile", route: "/settings/profile-update" },
  { link: "Settings", route: "/settings" },
  { link: "Log out", route: "/settings" },
];

const iconMap = {
  "Edit Profile": FaUser,
  Settings: FaCog,
  Tickets: TbTicket,
  "Log out": FaSignOutAlt,
};

const ProfileModal = ({ onClose, isOpen }) => {
  const { user } = useSelector((state) => state.user);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-start z-50 font-inter">
      <div className="relative w-[90%] max-w-sm mt-6 mr-6 rounded-xl bg-white dark:bg-zinc-900 text-center shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-300 shadow-md bg-orange-100 dark:bg-orange-200/10">
            <img
              src={
                user?.photo?.imageUrl ||
                user?.photo ||
                import.meta.env.DEFAULT_IMAGE_URL
              }
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              {user.name}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-zinc-200 dark:border-zinc-700"></div>

        {/* Profile Links */}
        <div className="flex flex-col gap-3">
          {profileLink?.map(({ link, route }, index) => {
            const Icon = iconMap[link] || FaUser;
            return (
              <Link
                to={route}
                key={index}
                onClick={onClose}
                className="flex justify-between items-center px-4 py-3 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-200/10 dark:hover:bg-orange-300/10 transition duration-300"
              >
                <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-200">
                  <Icon size={20} />
                  <span className="text-sm font-medium">{link}</span>
                </div>
                <IoIosArrowForward
                  size={20}
                  className="text-zinc-400 dark:text-zinc-500"
                />
              </Link>
            );
          })}
        </div>
        <div>
            {/* <ConnectWallet/> */}
          </div>
      </div>
    </div>
  );
};

export default ProfileModal;
