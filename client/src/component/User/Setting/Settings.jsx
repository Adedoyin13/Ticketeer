import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdLogout, MdModeEdit, MdOutlineIosShare } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ShareModal from "../../Modals/UserModal/ShareModal";
import Logout from "../../Modals/UserModal/Logout";
import DeleteAccount from "../../Modals/UserModal/DeleteAccount";

const Settings = () => {
  const [shareModal, setShareModal] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const openShareModal = () => {
    setShareModal(true)
  }

  const closeShareModal = () => {
    setShareModal(false)
  }

  const openLogoutModal = () => {
    setLogoutModal(true)
  }

  const closeLogoutModal = () => {
    setLogoutModal(false)
  }

  const openDeleteModal = () => {
    setDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  return (
    <div className="flex justify-center items-center bg-orange-100 h-screen">
      <div className="relative flex flex-col gap-2 py-6 px-1 rounded-xl shadow-lg bg-orange-300 bg-opacity-50">
        <Link to='/settings/profile-update'>
          <div className="flex justify-between items-center hover:bg-orange-100 rounded-lg gap-4 w-full pr-8 py-2 cursor-pointer">
            <div className="flex justify-between items-center w-full gap-4 px-10">
              <button>
                <MdLogout size={25} />
              </button>
              <div className="flex flex-col items-start ">
                <p className="font-medium text-xl">Edit Profile</p>
                <p className="font-normal text-lg">
                  Update your informations to fit accurately
                </p>
              </div>
            </div>
            <button>
              <IoIosArrowForward size={25} />
            </button>
          </div>
        </Link>

        <div className="flex justify-between items-center hover:bg-orange-100 rounded-lg gap-5 w-full pr-8 py-2 cursor-pointer" onClick={openShareModal}>
          <div className="flex justify-between items-center gap-4 px-10">
            <button>
              <MdOutlineIosShare size={25} />
            </button>
            <div className="flex flex-col items-start ">
              <p className="font-medium text-xl">Share</p>
              <p className="font-normal text-lg">
                Share across to a wide rage of audience
              </p>
            </div>
          </div>
          <button>
            <IoIosArrowForward size={25} />
          </button>
        </div>

        <div className="flex justify-between items-center hover:bg-orange-100 rounded-lg gap-5 w-full pr-8 py-2 cursor-pointer" onClick={openLogoutModal}>
          <div className="flex justify-between items-center gap-4 px-10">
            <button>
              <MdModeEdit size={25} />
            </button>
            <div className="flex flex-col items-start ">
              <p className="font-medium text-xl">Log out</p>
              <p className="font-normal text-lg">See you in a while</p>
            </div>
          </div>
          <button>
            <IoIosArrowForward size={25} />
          </button>
        </div>

        <div className="flex justify-between items-center hover:bg-orange-100 rounded-lg gap-5 w-full pr-8 py-2 cursor-pointer" onClick={openDeleteModal}>
          <div className="flex justify-between items-center gap-4 px-10 text-red-600">
            <button>
              <RiDeleteBinLine size={25} />
            </button>
            <div className="flex flex-col items-start">
              <p className="font-medium text-xl">Delete account</p>
              <p className="font-normal text-lg">We're sorry to see you go</p>
            </div>
          </div>
          <button>
            <IoIosArrowForward size={25} />
          </button>
        </div>
      </div>
      {shareModal && <ShareModal onClose={closeShareModal}/>}
      {logoutModal && <Logout onClose={closeLogoutModal}/>}
      {deleteModal && <DeleteAccount onClose={closeDeleteModal}/>}
    </div>
  );
};

export default Settings;
