import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdLogout, MdModeEdit, MdOutlineIosShare } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ShareModal from "../../Modals/UserModal/ShareModal";
import Logout from "../../Modals/UserModal/Logout";
import DeleteAccount from "../../Modals/UserModal/DeleteAccount";

const Settings = () => {
  const [shareModal, setShareModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const openShareModal = () => {
    setShareModal(true);
  };

  const closeShareModal = () => {
    setShareModal(false);
  };

  const openLogoutModal = () => {
    setLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setLogoutModal(false);
  };

  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  return (
    <div className="flex justify-center items-center bg-orange-50 dark:bg-zinc-900 min-h-screen px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800/60 bg-opacity-70 dark:bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4 transition-all">
        {/* Profile Update */}
        <Link to="/settings/profile-update">
          <div className="flex items-center justify-between hover:bg-orange-100 dark:hover:bg-zinc-700 rounded-xl px-4 py-3 cursor-pointer transition">
            <div className="flex items-center gap-4">
              <MdLogout
                size={24}
                className="text-slate-700 dark:text-zinc-200"
              />
              <div className="flex flex-col">
                <p className="text-base font-semibold text-slate-800 dark:text-zinc-100">
                  Edit Profile
                </p>
                <p className="text-sm text-slate-600 dark:text-zinc-400">
                  Update your information
                </p>
              </div>
            </div>
            <IoIosArrowForward
              size={22}
              className="text-slate-500 dark:text-zinc-400"
            />
          </div>
        </Link>

        {/* Share */}
        <div
          onClick={openShareModal}
          className="flex items-center justify-between hover:bg-orange-100 dark:hover:bg-zinc-700 rounded-xl px-4 py-3 cursor-pointer transition"
        >
          <div className="flex items-center gap-4">
            <MdOutlineIosShare
              size={24}
              className="text-slate-700 dark:text-zinc-200"
            />
            <div className="flex flex-col">
              <p className="text-base font-semibold text-slate-800 dark:text-zinc-100">
                Share
              </p>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Reach a wide audience
              </p>
            </div>
          </div>
          <IoIosArrowForward
            size={22}
            className="text-slate-500 dark:text-zinc-400"
          />
        </div>

        {/* Logout */}
        <div
          onClick={openLogoutModal}
          className="flex items-center justify-between hover:bg-orange-100 dark:hover:bg-zinc-700 rounded-xl px-4 py-3 cursor-pointer transition"
        >
          <div className="flex items-center gap-4">
            <MdModeEdit
              size={24}
              className="text-slate-700 dark:text-zinc-200"
            />
            <div className="flex flex-col">
              <p className="text-base font-semibold text-slate-800 dark:text-zinc-100">
                Log out
              </p>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                See you soon
              </p>
            </div>
          </div>
          <IoIosArrowForward
            size={22}
            className="text-slate-500 dark:text-zinc-400"
          />
        </div>

        {/* Delete Account */}
        <div
          onClick={openDeleteModal}
          className="flex items-center justify-between hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl px-4 py-3 cursor-pointer transition"
        >
          <div className="flex items-center gap-4 text-red-600 dark:text-red-500">
            <RiDeleteBinLine size={24} />
            <div className="flex flex-col">
              <p className="text-base font-semibold">Delete Account</p>
              <p className="text-sm">We're sorry to see you go</p>
            </div>
          </div>
          <IoIosArrowForward
            size={22}
            className="text-red-500 dark:text-red-400"
          />
        </div>
      </div>

      {shareModal && <ShareModal onClose={closeShareModal} />}
      {logoutModal && <Logout onClose={closeLogoutModal} />}
      {deleteModal && <DeleteAccount onClose={closeDeleteModal} />}
    </div>
  );
};

export default Settings;
